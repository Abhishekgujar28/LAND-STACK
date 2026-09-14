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

    // Check mock mode authentication
    if (config.dataProviderMode === 'mock') {
      const mockUser = _parseMockAuth(req, token);
      if (mockUser) {
        req.user = mockUser;
        return next();
      }
    }

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
      .eq('auth_user_id', authId)
      .eq('active', true)
      .maybeSingle();

    if (officer) {
      // Load active assignment
      const { data: assignments } = await admin
        .from('officer_assignments')
        .select('*')
        .eq('officer_id', officer.id)
        .eq('is_active', true);

      return {
        authId,
        userType: UserTypes.GOVERNMENT,
        userId: officer.id,
        role: officer.role,
        department: officer.department_code,
        email: officer.email,
        name: officer.name,
        profile: officer,
        assignments: assignments || [],
        activeContext: officer.active_context || null,
        jurisdiction: {
          stateCode: officer.state_code,
          districtCode: officer.district_code,
          tehsilCode: officer.tehsil_code,
          villageCode: officer.village_code,
        },
      };
    }
  }

  // Check if this is a citizen (phone-based auth)
  const { data: citizen } = await admin
    .from('citizens')
    .select('*')
    .eq('auth_user_id', authId)
    .maybeSingle();

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

/**
 * Mock auth for development when Supabase is not configured.
 * 
 * In mock mode, we look for X-Mock-User-Id and X-Mock-Role headers
 * to simulate authentication. This MUST be disabled in production.
 */
function _parseMockAuth(req, token) {
  if (config.nodeEnv === 'production') return null;
  if (config.dataProviderMode !== 'mock') return null;

  let mockUserId = req.headers['x-mock-user-id'];
  let mockRole = req.headers['x-mock-role'];
  let mockUserType = req.headers['x-mock-user-type'];

  if (!mockUserId && token && typeof token === 'string' && token.startsWith('mock-access-')) {
    const parts = token.split('-');
    mockUserId = parts.slice(2, -1).join('-');
    if (!mockUserId) mockUserId = parts[2];
  }

  if (!mockUserId) return null;

  if (!mockRole) {
    if (mockUserId.includes('talathi') || mockUserId === 'GOV-002') {
      mockRole = 'TALATHI';
    } else if (mockUserId.includes('admin') || mockUserId === 'GOV-014') {
      mockRole = 'ADMIN';
    } else if (mockUserId.includes('tahsildar') || mockUserId === 'GOV-001') {
      mockRole = 'TEHSILDAR';
    } else if (mockUserId.startsWith('GOV') || mockUserId.startsWith('off')) {
      mockRole = 'TEHSILDAR';
    } else {
      mockRole = 'CITIZEN';
    }
  }

  if (!mockUserType) {
    mockUserType = mockRole === 'CITIZEN' ? 'CITIZEN' : 'GOVERNMENT';
  }

  return {
    authId: `mock-auth-${mockUserId}`,
    userType: mockUserType,
    userId: mockUserId,
    role: mockRole,
    department: req.headers['x-mock-department'] || (mockUserType === 'GOVERNMENT' ? 'REV' : null),
    email: req.headers['x-mock-email'] || `${mockUserId.toLowerCase()}@example.com`,
    name:
      req.headers['x-mock-name'] ||
      (mockRole === 'TEHSILDAR'
        ? 'Sanjay Deshmukh'
        : mockRole === 'TALATHI'
        ? 'Prakash Shinde'
        : 'Aarav Patil'),
    profile: {},
    assignments: [],
    activeContext: req.headers['x-mock-context'] || (mockUserType === 'GOVERNMENT' ? 'RURAL' : null),
    jurisdiction: {
      stateCode: req.headers['x-mock-state'] || 'MH',
      districtCode: req.headers['x-mock-district'] || 'DIST-PUN',
      tehsilCode: req.headers['x-mock-tehsil'] || 'TEH-HAV',
      villageCode: req.headers['x-mock-village'] || (mockRole === 'TALATHI' ? 'VIL-WAG' : null),
    },
  };
}
