/**
 * Land Stack — Auth Service
 * 
 * Business logic for authentication flows:
 * - Citizen OTP request/verify
 * - Government email/password + MFA
 * - Session management
 * - Context resolution
 * - Audit events
 */

import { getSupabaseAdmin, isMockMode } from '../../config/supabase.js';
import { Errors } from '../../core/errors.js';
import { UserTypes, Roles, getPermissionsForRole } from '../../core/permissions.js';

// ─── Mock user data for development ────────────────────────────────────────────
const MOCK_CITIZENS = [
  { id: 'CIT-001', name: 'Aarav Patil', local_name: 'आरव पाटील', state_code: 'MH', mobile: '9823045891', email: 'aarav.patil@example.com', kyc_verified: true },
  { id: 'CIT-002', name: 'Sunita Kulkarni', local_name: 'सुनिता कुलकर्णी', state_code: 'MH', mobile: '9823112345', email: 'sunita.k@example.com', kyc_verified: true },
  { id: 'CIT-003', name: 'Rajesh Gaikwad', local_name: 'राजेश गायकवाड', state_code: 'MH', mobile: '9823223456', email: 'rajesh.g@example.com', kyc_verified: true },
  { id: 'CIT-004', name: 'Priya Shinde', local_name: 'प्रिया शिंदे', state_code: 'MH', mobile: '9823334567', email: 'priya.shinde@example.com', kyc_verified: true },
  { id: 'CIT-005', name: 'Rameshwar Chaudhary', local_name: 'रामेश्वर चौधरी', state_code: 'RJ', mobile: '9829012345', email: 'rameshwar.c@example.com', kyc_verified: true },
];

const MOCK_OFFICERS = [
  { id: 'GOV-001', name: 'Sanjay Deshmukh', local_name: 'संजय देशमुख', role: 'TEHSILDAR', department_code: 'DEPT-REV', email: 'sanjay.deshmukh@maharashtra.gov.in', state_code: 'MH', district_code: 'DIST-PUN', tehsil_code: 'TEH-HAV', active: true, active_context: 'RURAL' },
  { id: 'GOV-001-ALT', name: 'Sanjay Deshmukh', local_name: 'संजय देशमुख', role: 'TEHSILDAR', department_code: 'DEPT-REV', email: 'tahsildar.haveli@mahabhumi.gov.in', state_code: 'MH', district_code: 'DIST-PUN', tehsil_code: 'TEH-HAV', active: true, active_context: 'RURAL' },
  { id: 'GOV-002', name: 'Prakash Shinde', local_name: 'प्रकाश शिंदे', role: 'TALATHI', department_code: 'DEPT-REV', email: 'prakash.shinde@maharashtra.gov.in', state_code: 'MH', district_code: 'DIST-PUN', tehsil_code: 'TEH-HAV', village_code: 'VIL-WAG', active: true, active_context: 'RURAL' },
  { id: 'GOV-002-ALT', name: 'Prakash Shinde', local_name: 'प्रकाश शिंदे', role: 'TALATHI', department_code: 'DEPT-REV', email: 'talathi.wagholi@mahabhumi.gov.in', state_code: 'MH', district_code: 'DIST-PUN', tehsil_code: 'TEH-HAV', village_code: 'VIL-WAG', active: true, active_context: 'RURAL' },
  { id: 'GOV-003', name: 'Rekha Joshi', local_name: 'रेखा जोशी', role: 'SRO', department_code: 'DEPT-REG', email: 'rekha.joshi@igrmaharashtra.gov.in', state_code: 'MH', district_code: 'DIST-PUN', tehsil_code: 'TEH-HAV', active: true, active_context: 'RURAL' },
  { id: 'GOV-004', name: 'Dr. Suhas Diwase, IAS', local_name: 'डॉ. सुहास दिवसे', role: 'COLLECTOR', department_code: 'DEPT-DIST', email: 'collector.pune@maharashtra.gov.in', state_code: 'MH', district_code: 'DIST-PUN', active: true, active_context: 'RURAL' },
  { id: 'GOV-005', name: 'Vikram Patole', local_name: 'विक्रम पाटोळे', role: 'SURVEY_GIS', department_code: 'DEPT-SUR', email: 'vikram.patole@maharashtra.gov.in', state_code: 'MH', district_code: 'DIST-PUN', tehsil_code: 'TEH-HAV', active: true, active_context: 'SHARED_GIS' },
  { id: 'GOV-006', name: 'Anita Bhosale', local_name: 'अनिता भोसले', role: 'ULB_OFFICER', department_code: 'DEPT-ULB', email: 'anita.bhosale@pmc.gov.in', state_code: 'MH', district_code: 'DIST-PUN', active: true, active_context: 'URBAN' },
  { id: 'GOV-011', name: 'Anil Verma', local_name: 'अनिल वर्मा', role: 'STATE_PMU', department_code: 'DEPT-STATE', email: 'anil.verma@pmu.landrecords.gov.in', state_code: 'MH', active: true, active_context: 'STATE' },
  { id: 'GOV-013', name: 'Meera Sengupta', local_name: 'मीरा सेनगुप्ता', role: 'NATIONAL_MONITOR', department_code: 'DEPT-NAT', email: 'meera.sengupta@dolr.gov.in', active: true, active_context: 'NATIONAL' },
  { id: 'GOV-014', name: 'Manoj Tiwari', local_name: 'मनोज तिवारी', role: 'ADMIN', department_code: 'DEPT-ADMIN', email: 'admin.landstack@nic.in', active: true, active_context: 'NATIONAL' },
  { id: 'GOV-014-ALT', name: 'System Administrator', local_name: 'प्रशासक', role: 'ADMIN', department_code: 'DEPT-ADMIN', email: 'admin@landstack.gov.in', active: true, active_context: 'NATIONAL' },
];

const MOCK_ASSIGNMENTS = [
  { id: 'ASSIGN-001', officer_id: 'GOV-001', role: 'TEHSILDAR', context: 'RURAL', department_code: 'DEPT-REV', state_code: 'MH', district_code: 'DIST-PUN', tehsil_code: 'TEH-HAV', is_active: true },
  { id: 'ASSIGN-002', officer_id: 'GOV-002', role: 'TALATHI', context: 'RURAL', department_code: 'DEPT-REV', state_code: 'MH', district_code: 'DIST-PUN', tehsil_code: 'TEH-HAV', village_code: 'VIL-WAG', is_active: true },
  { id: 'ASSIGN-003', officer_id: 'GOV-003', role: 'SRO', context: 'RURAL', department_code: 'DEPT-REG', state_code: 'MH', district_code: 'DIST-PUN', tehsil_code: 'TEH-HAV', is_active: true },
  { id: 'ASSIGN-004', officer_id: 'GOV-003', role: 'SRO', context: 'URBAN', department_code: 'DEPT-REG', state_code: 'MH', district_code: 'DIST-PUN', tehsil_code: 'TEH-HAV', is_active: true },
  { id: 'ASSIGN-005', officer_id: 'GOV-005', role: 'SURVEY_GIS', context: 'SHARED_GIS', department_code: 'DEPT-SUR', state_code: 'MH', district_code: 'DIST-PUN', tehsil_code: 'TEH-HAV', is_active: true },
  { id: 'ASSIGN-006', officer_id: 'GOV-006', role: 'ULB_OFFICER', context: 'URBAN', department_code: 'DEPT-ULB', state_code: 'MH', district_code: 'DIST-PUN', is_active: true },
];

export const authService = {
  // ─── Citizen OTP Request ───────────────────────────────────────────────────
  async requestCitizenOtp(mobile) {
    if (isMockMode()) {
      // In mock mode, always succeed
      return { success: true, message: 'OTP sent successfully (mock mode: use 123456).' };
    }

    const admin = getSupabaseAdmin();
    if (!admin) throw Errors.internal('Auth service not available.');

    const phone = `+91${mobile}`;

    const { error } = await admin.auth.signInWithOtp({ phone });

    if (error) {
      console.error('[AuthService] OTP request failed:', error.message);
      if (error.message.includes('rate')) {
        throw Errors.otpRateLimited();
      }
      throw Errors.internal('Failed to send OTP. Please try again.');
    }

    return { success: true, message: 'OTP sent to your registered mobile number.' };
  },

  // ─── Citizen OTP Verify ────────────────────────────────────────────────────
  async verifyCitizenOtp(mobile, otp) {
    if (isMockMode()) {
      // In mock mode, accept OTP "123456"
      if (otp !== '123456') {
        throw Errors.invalidOtp();
      }

      const citizen = MOCK_CITIZENS.find(c => c.mobile === mobile) || MOCK_CITIZENS[0];
      const permissions = getPermissionsForRole(Roles.CITIZEN);

      return {
        user: _buildCitizenMeResponse(citizen, permissions),
        // In mock mode, return mock tokens
        accessToken: `mock-access-${citizen.id}-${Date.now()}`,
        refreshToken: `mock-refresh-${citizen.id}-${Date.now()}`,
      };
    }

    const admin = getSupabaseAdmin();
    if (!admin) throw Errors.internal('Auth service not available.');

    const phone = `+91${mobile}`;

    const { data, error } = await admin.auth.verifyOtp({
      phone,
      token: otp,
      type: 'sms',
    });

    if (error) {
      if (error.message.includes('expired')) throw Errors.otpExpired();
      throw Errors.invalidOtp();
    }

    const session = data.session;
    if (!session) throw Errors.invalidOtp();

    // Resolve or create citizen profile
    const citizen = await _resolveOrCreateCitizen(admin, data.user, mobile);
    const permissions = getPermissionsForRole(Roles.CITIZEN);

    return {
      user: _buildCitizenMeResponse(citizen, permissions),
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    };
  },

  // ─── Government Login ──────────────────────────────────────────────────────
  async loginGovernment(email, password) {
    if (isMockMode()) {
      // In mock mode, accept any password for known officers
      const officer = MOCK_OFFICERS.find(o => o.email === email);
      if (!officer) throw Errors.unauthenticated('Invalid credentials.');
      if (!officer.active) throw Errors.accountInactive();

      const assignments = MOCK_ASSIGNMENTS.filter(a => a.officer_id === officer.id && a.is_active);
      const permissions = getPermissionsForRole(officer.role);

      return {
        user: _buildOfficerMeResponse(officer, assignments, permissions),
        accessToken: `mock-access-${officer.id}-${Date.now()}`,
        refreshToken: `mock-refresh-${officer.id}-${Date.now()}`,
      };
    }

    const admin = getSupabaseAdmin();
    if (!admin) throw Errors.internal('Auth service not available.');

    // Authenticate with Supabase Auth
    const { data, error } = await admin.auth.signInWithPassword({ email, password });

    if (error) {
      throw Errors.unauthenticated('Invalid credentials.');
    }

    const session = data.session;
    if (!session) throw Errors.unauthenticated('Login failed.');

    // Resolve officer identity from DB — role comes from the database, NOT the request
    const { data: officer, error: officerError } = await admin
      .from('government_users')
      .select('*, government_roles(*)')
      .eq('auth_user_id', data.user.id)
      .eq('active', true)
      .maybeSingle();

    if (officerError || !officer) {
      throw Errors.unauthenticated('No active officer profile found for this account.');
    }

    // Load assignments
    const { data: assignments } = await admin
      .from('officer_assignments')
      .select('*')
      .eq('officer_id', officer.id)
      .eq('is_active', true);

    const permissions = getPermissionsForRole(officer.role);

    return {
      user: _buildOfficerMeResponse(officer, assignments || [], permissions),
      accessToken: session.access_token,
      refreshToken: session.refresh_token,
    };
  },

  // ─── Token Refresh ─────────────────────────────────────────────────────────
  async refreshSession(refreshToken) {
    if (isMockMode()) {
      // In mock mode, just return a new mock token
      return {
        accessToken: `mock-access-refreshed-${Date.now()}`,
        refreshToken: `mock-refresh-refreshed-${Date.now()}`,
      };
    }

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
      if (isMockMode()) {
        const citizen = MOCK_CITIZENS.find(c => c.id === user.userId) || MOCK_CITIZENS[0];
        return _buildCitizenMeResponse(citizen, permissions);
      }
      return _buildCitizenMeResponse(user.profile, permissions);
    }

    // Government officer
    const permissions = getPermissionsForRole(user.role);
    if (isMockMode()) {
      const officer = MOCK_OFFICERS.find(o => o.id === user.userId);
      const assignments = MOCK_ASSIGNMENTS.filter(a => a.officer_id === user.userId && a.is_active);
      return _buildOfficerMeResponse(officer || user.profile, assignments, permissions);
    }

    return _buildOfficerMeResponse(user.profile, user.assignments || [], permissions);
  },

  // ─── Get Officer Contexts ──────────────────────────────────────────────────
  async getContexts(user) {
    if (!user || user.userType !== UserTypes.GOVERNMENT) {
      throw Errors.forbiddenRole('Only government officers have operational contexts.');
    }

    if (isMockMode()) {
      const assignments = MOCK_ASSIGNMENTS.filter(a => a.officer_id === user.userId && a.is_active);
      return {
        activeContext: user.activeContext,
        availableContexts: assignments.map(a => ({
          assignmentId: a.id,
          context: a.context,
          role: a.role,
          department: a.department_code,
          jurisdiction: {
            stateCode: a.state_code,
            districtCode: a.district_code,
            tehsilCode: a.tehsil_code,
            villageCode: a.village_code,
          },
        })),
      };
    }

    const admin = getSupabaseAdmin();
    if (!admin) throw Errors.internal('Auth service not available.');

    const { data: assignments } = await admin
      .from('officer_assignments')
      .select('*')
      .eq('officer_id', user.userId)
      .eq('is_active', true);

    return {
      activeContext: user.activeContext,
      availableContexts: (assignments || []).map(a => ({
        assignmentId: a.id,
        context: a.context,
        role: a.role,
        department: a.department_code,
        jurisdiction: {
          stateCode: a.state_code,
          districtCode: a.district_code,
          tehsilCode: a.tehsil_code,
          villageCode: a.village_code,
        },
      })),
    };
  },

  // ─── Switch Context ────────────────────────────────────────────────────────
  async switchContext(user, context, assignmentId) {
    if (!user || user.userType !== UserTypes.GOVERNMENT) {
      throw Errors.forbiddenRole('Only government officers can switch contexts.');
    }

    // Validate the context is available to this officer
    if (isMockMode()) {
      const assignments = MOCK_ASSIGNMENTS.filter(a => a.officer_id === user.userId && a.is_active);
      const validAssignment = assignments.find(a => {
        if (assignmentId) return a.id === assignmentId && a.context === context;
        return a.context === context;
      });

      if (!validAssignment) {
        throw Errors.forbiddenContext(`You do not have an active assignment for context: ${context}.`);
      }

      return {
        previousContext: user.activeContext,
        newContext: context,
        assignment: validAssignment,
      };
    }

    const admin = getSupabaseAdmin();
    if (!admin) throw Errors.internal('Auth service not available.');

    const { data: assignments } = await admin
      .from('officer_assignments')
      .select('*')
      .eq('officer_id', user.userId)
      .eq('is_active', true)
      .eq('context', context);

    const validAssignment = assignmentId
      ? (assignments || []).find(a => a.id === assignmentId)
      : (assignments || [])[0];

    if (!validAssignment) {
      throw Errors.forbiddenContext(`You do not have an active assignment for context: ${context}.`);
    }

    // Update active context on officer record
    await admin
      .from('government_users')
      .update({ active_context: context, updated_at: new Date().toISOString() })
      .eq('id', user.userId);

    return {
      previousContext: user.activeContext,
      newContext: context,
      assignment: validAssignment,
    };
  },

  // ─── Logout ────────────────────────────────────────────────────────────────
  async logout(accessToken) {
    if (isMockMode()) {
      return { success: true };
    }

    const admin = getSupabaseAdmin();
    if (admin && accessToken) {
      try {
        await admin.auth.admin.signOut(accessToken);
      } catch (err) {
        // Non-critical — continue with cookie clearing
        console.warn('[AuthService] Supabase signout failed:', err.message);
      }
    }

    return { success: true };
  },
};

// ─── Internal Helpers ──────────────────────────────────────────────────────────

async function _resolveOrCreateCitizen(admin, authUser, mobile) {
  // Check if citizen profile exists
  const { data: existing } = await admin
    .from('citizens')
    .select('*')
    .eq('auth_user_id', authUser.id)
    .maybeSingle();

  if (existing) return existing;

  // Create new citizen profile
  const newCitizen = {
    id: `CIT-${Date.now()}`,
    auth_user_id: authUser.id,
    name: 'New Citizen',
    mobile: mobile,
    state_code: 'MH', // Default — can be updated later
    kyc_verified: false,
    registered_at: new Date().toISOString(),
  };

  const { data: created, error } = await admin
    .from('citizens')
    .insert(newCitizen)
    .select()
    .single();

  if (error) {
    console.error('[AuthService] Failed to create citizen profile:', error.message);
    throw Errors.internal('Failed to create user profile.');
  }

  return created;
}

function _buildCitizenMeResponse(citizen, permissions) {
  return {
    userId: citizen.id,
    userType: UserTypes.CITIZEN,
    role: Roles.CITIZEN,
    name: citizen.name,
    localName: citizen.local_name,
    maskedMobile: _maskMobile(citizen.mobile),
    email: citizen.email ? _maskEmail(citizen.email) : null,
    stateCode: citizen.state_code,
    kycVerified: citizen.kyc_verified || false,
    permissions,
  };
}

function _buildOfficerMeResponse(officer, assignments, permissions) {
  return {
    userId: officer.id,
    userType: UserTypes.GOVERNMENT,
    role: officer.role,
    name: officer.name,
    localName: officer.local_name,
    email: officer.email,
    department: officer.department_code,
    designation: officer.designation,
    activeContext: officer.active_context,
    jurisdiction: {
      stateCode: officer.state_code,
      districtCode: officer.district_code,
      tehsilCode: officer.tehsil_code,
      villageCode: officer.village_code,
    },
    assignments: (assignments || []).map(a => ({
      id: a.id,
      context: a.context,
      role: a.role,
      department: a.department_code,
      jurisdiction: {
        stateCode: a.state_code,
        districtCode: a.district_code,
        tehsilCode: a.tehsil_code,
        villageCode: a.village_code,
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
