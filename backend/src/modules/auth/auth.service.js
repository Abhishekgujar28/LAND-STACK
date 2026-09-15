/**
 * Land Stack — Auth Service (Database-Only)
 * 
 * Business logic for authentication flows:
 * - Citizen OTP request/verify (Database-backed + Supabase Auth Session)
 * - Government email/password (Supabase Auth + PostgreSQL government_users)
 * - Session management & Refresh tokens
 * - Context resolution & switching
 */

import { getSupabaseAdmin, getSupabaseAnon } from '../../config/supabase.js';
import { Errors } from '../../core/errors.js';
import { UserTypes, Roles, getPermissionsForRole } from '../../core/permissions.js';


export const authService = {
  // ─── Citizen OTP Request ───────────────────────────────────────────────────
  async requestCitizenOtp(mobile) {
    const admin = getSupabaseAdmin();
    if (!admin) throw Errors.internal('Auth service not available.');

    const digits = String(mobile).replace(/\D/g, '').slice(-10);
    const pattern = digits.length >= 10 ? `%${digits.slice(0, 5)}%${digits.slice(5)}%` : `%${digits}%`;

    // Verify that the citizen exists in our PostgreSQL database
    const { data: citizen, error } = await admin
      .from('citizens')
      .select('id, name, mobile, email')
      .ilike('mobile', pattern)
      .maybeSingle();

    if (error) {
      console.error('[AuthService] Citizen lookup error:', error.message);
      throw Errors.internal('Database error during citizen verification.');
    }

    if (!citizen) {
      throw Errors.notFound(`Mobile number +91 ${digits} is not registered with any citizen record.`);
    }

    // Trigger Supabase OTP (Requires SMS provider configured in Supabase)
    const anon = getSupabaseAnon();
    const { error: authErr } = await anon.auth.signInWithOtp({
      phone: `+91${digits}`,
    });

    if (authErr) {
      console.warn('[AuthService] Supabase OTP error:', authErr.message);
      // We don't throw here to prevent leaking whether the user has auth set up, but we could.
    }

    return {
      success: true,
      message: `OTP sent to registered mobile number.`,
    };
  },

  // ─── Citizen OTP Verify ────────────────────────────────────────────────────
  async verifyCitizenOtp(mobile, otp) {
    const admin = getSupabaseAdmin();
    const anon = getSupabaseAnon();
    if (!admin) throw Errors.internal('Auth service not available.');

    const digits = String(mobile).replace(/\D/g, '').slice(-10);
    const pattern = digits.length >= 10 ? `%${digits.slice(0, 5)}%${digits.slice(5)}%` : `%${digits}%`;

    const { data: authData, error: authError } = await anon.auth.verifyOtp({
      phone: `+91${digits}`,
      token: otp,
      type: 'sms',
    });

    if (authError || !authData?.session) {
      throw Errors.invalidOtp('Invalid OTP or OTP expired.');
    }

    // Load citizen profile from database
    const { data: citizen, error: citError } = await admin
      .from('citizens')
      .select('*')
      .ilike('mobile', pattern)
      .maybeSingle();

    if (citError || !citizen) {
      throw Errors.notFound('Citizen profile not found in database.');
    }

    const authSession = authData.session;
    const permissions = getPermissionsForRole(Roles.CITIZEN);

    return {
      user: _buildCitizenMeResponse(citizen, permissions),
      accessToken: authSession.access_token,
      refreshToken: authSession.refresh_token,
    };
  },

  // ─── Government Login ──────────────────────────────────────────────────────
  async loginGovernment(email, password) {
    const admin = getSupabaseAdmin();
    const anon = getSupabaseAnon();
    if (!admin || !anon) throw Errors.internal('Auth service not available.');

    const cleanEmail = String(email).trim().toLowerCase();

    // Resolve officer identity from database — role and jurisdiction are strictly DB-driven
    const { data: officer, error: officerError } = await admin
      .from('government_users')
      .select('*, government_roles(*)')
      .eq('email', cleanEmail)
      .eq('active', true)
      .maybeSingle();

    if (officerError) {
      console.error('[AuthService] Officer lookup error:', officerError.message);
      throw Errors.internal('Database error during officer login.');
    }

    if (!officer) {
      throw Errors.unauthenticated('No active government officer profile found for this email.');
    }

    // Authenticate with Supabase Auth
    let { data: authData, error: authError } = await anon.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (authError || !authData?.session) {
      throw Errors.unauthenticated('Invalid credentials.');
    }

    const session = authData.session;
    const permissions = getPermissionsForRole(officer.role);

    const activeContext = officer.active_context ||
      (officer.role === 'TALATHI' || officer.role === 'TEHSILDAR' || officer.role === 'PATWARI' ? 'RURAL'
      : officer.role === 'ULB_OFFICER' ? 'URBAN'
      : officer.role === 'SURVEY_GIS' ? 'SHARED_GIS'
      : officer.role === 'COLLECTOR' ? 'DISTRICT'
      : officer.role === 'STATE_PMU' || officer.role === 'STATE_AUTHORITY' ? 'STATE'
      : 'NATIONAL');

    const assignments = [
      {
        id: `ASSIGN-${officer.id}`,
        context: activeContext,
        role: officer.role,
        department: officer.department_code,
        jurisdiction: {
          stateCode: officer.state_code,
          districtCode: officer.district_code,
          tehsilCode: officer.tehsil_code,
          villageCode: officer.village_code,
        },
      }
    ];

    return {
      user: _buildOfficerMeResponse(officer, assignments, permissions),
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    };
  },

  // ─── Token Refresh ─────────────────────────────────────────────────────────
  async refreshSession(refreshToken) {
    const admin = getSupabaseAdmin();
    if (!admin) throw Errors.internal('Auth service not available.');

    const { data, error } = await admin.auth.refreshSession({ refresh_token: refreshToken });

    if (error || !data.session) {
      throw Errors.sessionExpired();
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
    };
  },

  // ─── Get Authenticated User (/me) ─────────────────────────────────────────
  async getMe(user) {
    if (!user) throw Errors.unauthenticated();

    if (user.userType === UserTypes.CITIZEN) {
      const permissions = getPermissionsForRole(Roles.CITIZEN);
      return _buildCitizenMeResponse(user.profile, permissions);
    }

    // Government officer
    const permissions = getPermissionsForRole(user.role);
    return _buildOfficerMeResponse(user.profile, user.assignments || [], permissions);
  },

  // ─── Get Officer Contexts ──────────────────────────────────────────────────
  async getContexts(user) {
    if (!user || user.userType !== UserTypes.GOVERNMENT) {
      throw Errors.forbiddenRole('Only government officers have operational contexts.');
    }

    const officer = user.profile;
    const activeContext = user.activeContext || officer.active_context || 'RURAL';

    return {
      activeContext,
      availableContexts: [
        {
          assignmentId: `ASSIGN-${user.userId}`,
          context: activeContext,
          role: user.role,
          department: officer.department_code,
          jurisdiction: {
            stateCode: officer.state_code,
            districtCode: officer.district_code,
            tehsilCode: officer.tehsil_code,
            villageCode: officer.village_code,
          },
        }
      ],
    };
  },

  // ─── Switch Context ────────────────────────────────────────────────────────
  async switchContext(user, context) {
    if (!user || user.userType !== UserTypes.GOVERNMENT) {
      throw Errors.forbiddenRole('Only government officers can switch contexts.');
    }

    const admin = getSupabaseAdmin();
    if (admin) {
      await admin
        .from('government_users')
        .update({ active_context: context, updated_at: new Date().toISOString() })
        .eq('id', user.userId);
    }

    return {
      previousContext: user.activeContext,
      newContext: context,
    };
  },

  // ─── Logout ────────────────────────────────────────────────────────────────
  async logout(accessToken) {
    const admin = getSupabaseAdmin();
    if (admin && accessToken) {
      try {
        await admin.auth.admin.signOut(accessToken);
      } catch (err) {
        console.warn('[AuthService] Supabase signout failed:', err.message);
      }
    }
    return { success: true };
  },
};

// ─── Response Formatters ──────────────────────────────────────────────────────

function _buildCitizenMeResponse(citizen, permissions) {
  return {
    userId: citizen.id,
    userType: UserTypes.CITIZEN,
    role: Roles.CITIZEN,
    name: citizen.name,
    localName: citizen.local_name,
    mobile: citizen.mobile,
    maskedMobile: _maskMobile(citizen.mobile),
    email: citizen.email ? _maskEmail(citizen.email) : null,
    address: citizen.address,
    stateCode: citizen.state_code,
    kycVerified: citizen.kyc_verified || false,
    permissions,
  };
}

function _buildOfficerMeResponse(officer, assignments, permissions) {
  const jurisdictionStr = officer.jurisdiction ||
    [officer.village_code, officer.tehsil_code, officer.district_code, officer.state_code].filter(Boolean).join(', ') ||
    'Maharashtra (MH)';

  return {
    userId: officer.id,
    userType: UserTypes.GOVERNMENT,
    role: officer.role,
    name: officer.name,
    localName: officer.local_name,
    email: officer.email,
    department: officer.department_code,
    designation: officer.designation,
    activeContext: officer.active_context || 'RURAL',
    jurisdiction: jurisdictionStr,
    jurisdictionCodes: {
      stateCode: officer.state_code,
      districtCode: officer.district_code,
      tehsilCode: officer.tehsil_code,
      villageCode: officer.village_code,
    },
    assignments: (assignments || []).map(a => ({
      id: a.id || `ASSIGN-${officer.id}`,
      context: a.context || officer.active_context || 'RURAL',
      role: a.role || officer.role,
      department: a.department || officer.department_code,
      jurisdiction: a.jurisdiction || {
        stateCode: officer.state_code,
        districtCode: officer.district_code,
        tehsilCode: officer.tehsil_code,
        villageCode: officer.village_code,
      },
    })),
    permissions,
  };
}

function _maskMobile(mobile) {
  if (!mobile) return null;
  const digits = mobile.replace(/\D/g, '');
  if (digits.length < 4) return '****';
  return `${'*'.repeat(digits.length - 4)}${digits.slice(-4)}`;
}

function _maskEmail(email) {
  if (!email) return null;
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const masked = local.length <= 2
    ? '*'.repeat(local.length)
    : `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`;
  return `${masked}@${domain}`;
}
