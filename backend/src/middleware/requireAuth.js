/**
 * Land Stack — Authentication Middleware
 * 
 * Extracts JWT from HTTP-only cookie, verifies with Supabase Auth,
 * and attaches the authenticated user identity to req.user.
 * 
 * This is the first gate in the security chain:
 * requireAuth → requireRole → requirePermission → requireJurisdiction
 */

import { getSupabaseAdmin, createAuthClient } from '../config/supabase.js';
import { getTokensFromCookies } from '../config/cookie.js';
import { config } from '../config/env.js';
import { Errors } from '../core/errors.js';
import { UserTypes } from '../core/permissions.js';

/**
 * Middleware: Require authentication
 * 
 * Verifies the access token from cookies, resolves user identity
 * from the database, and attaches to req.user.
 * 
 * req.user will contain:
 *   - authId: Supabase auth.users UUID
 *   - userType: 'CITIZEN' | 'GOVERNMENT'
 *   - userId: citizen or officer ID
 *   - role: resolved role
 *   - email / phone
 *   - profile: full profile data
 *   - activeContext: current context (for officers)
 *   - jurisdiction: jurisdiction info (for officers)
 *   - permissions: resolved permissions array
 */
export function requireAuth(req, res, next) {
  return _authenticate(req, res, next, { required: true });
}

/**
 * Middleware: Optional authentication
 * 
 * If a valid token is present, attaches req.user.
 * If not, continues without error (req.user = null).
 * Useful for endpoints that show different data to authenticated vs anonymous users.
 */
export function optionalAuth(req, res, next) {
  return _authenticate(req, res, next, { required: false });
}

// ─── Internal Auth Logic ───────────────────────────────────────────────────────

async function _authenticate(req, res, next, { required }) {
  try {
    const { accessToken } = getTokensFromCookies(req);

    // Also check Authorization header as fallback (for API testing tools)
    const headerToken = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null;

    const token = accessToken || headerToken;

    if (!token) {
      if (required) {
        return next(Errors.unauthenticated());
      }
      req.user = null;
      return next();
    }

    // Verify token with Supabase Auth
    const admin = getSupabaseAdmin();
    if (!admin) {
      if (required) {
        return next(Errors.unauthenticated('Authentication service unavailable.'));
      }
      req.user = null;
      return next();
    }

    const { data: { user: authUser }, error } = await admin.auth.getUser(token);

    if (error || !authUser) {
      if (required) {
        return next(Errors.invalidToken());
      }
      req.user = null;
      return next();
    }

    // Resolve full user identity from our database
    const userIdentity = await _resolveUserIdentity(admin, authUser);

    if (!userIdentity) {
      if (required) {
        return next(Errors.unauthenticated('User profile not found.'));
      }
      req.user = null;
      return next();
    }

    // Attach to request
    req.user = userIdentity;
    req.accessToken = token;

    // Create per-request Supabase client with user's token for RLS
    req.supabase = createAuthClient(token);

    next();
  } catch (err) {
    console.error('[Auth Middleware] Error:', err.message);
    if (required) {
      return next(Errors.unauthenticated());
    }
    req.user = null;
    next();
  }
}

/**
 * Resolve full user identity from the database
 */
async function _resolveUserIdentity(admin, authUser) {
  const authId = authUser.id;
  const email = authUser.email;
  const phone = authUser.phone;

  // Check if this is a government officer (email-based auth)
  if (email) {
    const { data: officer } = await admin
      .from('government_users')
      .select('*, government_roles(*)')
      .eq('email', email)
      .eq('active', true)
      .maybeSingle();

    if (officer) {
      const activeContext = officer.active_context ||
        (officer.role === 'TALATHI' || officer.role === 'TEHSILDAR' || officer.role === 'PATWARI' ? 'RURAL'
        : officer.role === 'ULB_OFFICER' ? 'URBAN'
        : officer.role === 'SURVEY_GIS' ? 'SHARED_GIS'
        : officer.role === 'COLLECTOR' ? 'DISTRICT'
        : officer.role === 'STATE_PMU' || officer.role === 'STATE_AUTHORITY' ? 'STATE'
        : 'NATIONAL');

      return {
        authId,
        userType: UserTypes.GOVERNMENT,
        userId: officer.id,
        role: officer.role,
        department: officer.department_code,
        email: officer.email,
        name: officer.name,
        profile: officer,
        assignments: [
          {
            assignmentId: `ASSIGN-${officer.id}`,
            role: officer.role,
            context: activeContext,
            department: officer.department_code,
            jurisdiction: {
              stateCode: officer.state_code,
              districtCode: officer.district_code,
              tehsilCode: officer.tehsil_code,
              villageCode: officer.village_code,
            },
          }
        ],
        activeContext,
        jurisdiction: {
          stateCode: officer.state_code,
          districtCode: officer.district_code,
          tehsilCode: officer.tehsil_code,
          villageCode: officer.village_code,
        },
      };
    }
  }

  // Check if this is a citizen (email or phone based auth)
  let citizenQuery = admin.from('citizens').select('*');
  if (email) {
    citizenQuery = citizenQuery.eq('email', email);
  } else if (phone) {
    const cleanPhone = phone.replace(/^\+91/, '').trim();
    citizenQuery = citizenQuery.or(`mobile.eq.${cleanPhone},mobile.eq.+91${cleanPhone},mobile.eq.+91 ${cleanPhone}`);
  }

  const { data: citizen } = await citizenQuery.maybeSingle();

  if (citizen) {
    return {
      authId,
      userType: UserTypes.CITIZEN,
      userId: citizen.id,
      role: 'CITIZEN',
      phone: citizen.mobile,
      email: citizen.email,
      name: citizen.name,
      profile: citizen,
      activeContext: null,
      jurisdiction: null,
    };
  }

  return null;
}
