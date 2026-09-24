/**
 * Land Stack — Centralized Permission System
 * 
 * Permissions are the atomic unit of authorization. Roles map to permission sets.
 * This replaces scattered `if (role === ...)` checks throughout the codebase.
 */

// ─── Permission Constants ──────────────────────────────────────────────────────
export const Permissions = Object.freeze({
  // Parcel
  PARCEL_SEARCH:            'parcel.search',
  PARCEL_VIEW_PUBLIC:       'parcel.view.public',
  PARCEL_VIEW_FULL:         'parcel.view.full',
  PARCEL_VIEW_OFFICER:      'parcel.view.officer',
  PARCEL_VIEW_SENSITIVE:    'parcel.view.sensitive',

  // Application
  APPLICATION_CREATE:       'application.create',
  APPLICATION_VIEW_OWN:     'application.view.own',
  APPLICATION_VIEW_ASSIGNED:'application.view.assigned',
  APPLICATION_ASSIGN:       'application.assign',
  APPLICATION_VERIFY:       'application.verify',

  // Mutation
  MUTATION_CREATE:          'mutation.create',
  MUTATION_REVIEW:          'mutation.review',
  MUTATION_NOTICE:          'mutation.notice',
  MUTATION_HEARING:         'mutation.hearing',
  MUTATION_APPROVE:         'mutation.approve',
  MUTATION_REJECT:          'mutation.reject',
  MUTATION_RETURN:          'mutation.return',
  MUTATION_ISSUE_ORDER:     'mutation.issue_order',
  MUTATION_FIELD_VERIFY:    'mutation.field_verify',

  // GIS
  GIS_VERIFY:               'gis.verify',
  GIS_EDIT:                 'gis.edit',
  GIS_BOUNDARY_CHECK:       'gis.boundary_check',
  GIS_AREA_RECONCILE:       'gis.area_reconcile',

  // Registration
  REGISTRATION_VERIFY:      'registration.verify',
  REGISTRATION_FORWARD:     'registration.forward',

  // Urban
  URBAN_TAX_VIEW:           'urban.tax.view',
  URBAN_ZONING_VERIFY:      'urban.zoning.verify',
  URBAN_MUTATION_HANDLE:    'urban.mutation.handle',

  // Analytics
  ANALYTICS_TEHSIL:         'analytics.tehsil',
  ANALYTICS_DISTRICT:       'analytics.district',
  ANALYTICS_STATE:          'analytics.state',
  ANALYTICS_NATIONAL:       'analytics.national',

  // Documents
  DOCUMENT_UPLOAD:          'document.upload',
  DOCUMENT_VIEW_OWN:        'document.view.own',
  DOCUMENT_VIEW_ASSIGNED:   'document.view.assigned',
  DOCUMENT_DOWNLOAD:        'document.download',

  // Notifications
  NOTIFICATION_VIEW:        'notification.view',
  NOTIFICATION_SEND:        'notification.send',

  // Watchlist
  WATCHLIST_MANAGE:         'watchlist.manage',

  // Grievance
  GRIEVANCE_CREATE:         'grievance.create',
  GRIEVANCE_VIEW_OWN:       'grievance.view.own',
  GRIEVANCE_VIEW_ASSIGNED:  'grievance.view.assigned',

  // Case
  CASE_VIEW_QUEUE:          'case.view.queue',
  CASE_ASSIGN:              'case.assign',
  CASE_REASSIGN:            'case.reassign',
  CASE_VIEW_DOSSIER:        'case.view.dossier',

  // Admin
  ADMIN_USERS:              'admin.users',
  ADMIN_ROLES:              'admin.roles',
  ADMIN_CONFIG:             'admin.config',

  // Audit
  AUDIT_VIEW:               'audit.view',
});

// ─── User Types ────────────────────────────────────────────────────────────────
export const UserTypes = Object.freeze({
  CITIZEN:    'CITIZEN',
  GOVERNMENT: 'GOVERNMENT',
});

// ─── Government Roles ──────────────────────────────────────────────────────────
export const Roles = Object.freeze({
  CITIZEN:           'CITIZEN',
  TALATHI:           'TALATHI',
  PATWARI:           'PATWARI',
  SRO:               'SRO',
  CRO:               'CRO',
  TEHSILDAR:         'TEHSILDAR',
  COLLECTOR:         'COLLECTOR',
  SURVEY_GIS:        'SURVEY_GIS',
  ULB_OFFICER:       'ULB_OFFICER',
  STATE_PMU:         'STATE_PMU',
  STATE_AUTHORITY:   'STATE_AUTHORITY',
  NATIONAL_MONITOR:  'NATIONAL_MONITOR',
  DOLR_NATIONAL:     'DOLR_NATIONAL',
  ADMIN:             'ADMIN',
});

// ─── Contexts ──────────────────────────────────────────────────────────────────
export const Contexts = Object.freeze({
  RURAL:       'RURAL',
  URBAN:       'URBAN',
  SHARED_GIS:  'SHARED_GIS',
  STATE:       'STATE',
  NATIONAL:    'NATIONAL',
});

// ─── Role → Permission Mapping ─────────────────────────────────────────────────
// This is the server-side source of truth. The frontend permissions.js is for UI hints only.
const P = Permissions;

export const ROLE_PERMISSIONS = Object.freeze({
  [Roles.CITIZEN]: [
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC, P.PARCEL_VIEW_FULL,
    P.APPLICATION_CREATE, P.APPLICATION_VIEW_OWN,
    P.MUTATION_CREATE,
    P.DOCUMENT_UPLOAD, P.DOCUMENT_VIEW_OWN, P.DOCUMENT_DOWNLOAD,
    P.NOTIFICATION_VIEW,
    P.WATCHLIST_MANAGE,
    P.GRIEVANCE_CREATE, P.GRIEVANCE_VIEW_OWN,
  ],

  [Roles.TALATHI]: [
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC, P.PARCEL_VIEW_OFFICER,
    P.MUTATION_FIELD_VERIFY, P.MUTATION_NOTICE,
    P.CASE_VIEW_QUEUE, P.CASE_VIEW_DOSSIER,
    P.GIS_VERIFY, P.GIS_BOUNDARY_CHECK,
    P.DOCUMENT_VIEW_ASSIGNED,
    P.NOTIFICATION_VIEW,
    P.ANALYTICS_TEHSIL,
  ],

  [Roles.PATWARI]: [
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC, P.PARCEL_VIEW_OFFICER,
    P.MUTATION_FIELD_VERIFY,
    P.CASE_VIEW_QUEUE, P.CASE_VIEW_DOSSIER,
    P.GIS_VERIFY, P.GIS_BOUNDARY_CHECK,
    P.DOCUMENT_VIEW_ASSIGNED,
    P.NOTIFICATION_VIEW,
  ],

  [Roles.SRO]: [
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC, P.PARCEL_VIEW_OFFICER,
    P.REGISTRATION_VERIFY, P.REGISTRATION_FORWARD,
    P.CASE_VIEW_QUEUE, P.CASE_VIEW_DOSSIER,
    P.DOCUMENT_VIEW_ASSIGNED,
    P.NOTIFICATION_VIEW,
  ],

  [Roles.TEHSILDAR]: [
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC, P.PARCEL_VIEW_OFFICER, P.PARCEL_VIEW_SENSITIVE,
    P.MUTATION_REVIEW, P.MUTATION_NOTICE, P.MUTATION_HEARING,
    P.MUTATION_APPROVE, P.MUTATION_REJECT, P.MUTATION_RETURN, P.MUTATION_ISSUE_ORDER,
    P.CASE_VIEW_QUEUE, P.CASE_VIEW_DOSSIER, P.CASE_ASSIGN, P.CASE_REASSIGN,
    P.APPLICATION_VIEW_ASSIGNED, P.APPLICATION_ASSIGN, P.APPLICATION_VERIFY,
    P.DOCUMENT_VIEW_ASSIGNED, P.DOCUMENT_DOWNLOAD,
    P.NOTIFICATION_VIEW, P.NOTIFICATION_SEND,
    P.ANALYTICS_TEHSIL, P.ANALYTICS_DISTRICT,
    P.AUDIT_VIEW,
  ],

  [Roles.CRO]: [
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC, P.PARCEL_VIEW_OFFICER, P.PARCEL_VIEW_SENSITIVE,
    P.MUTATION_REVIEW, P.MUTATION_NOTICE, P.MUTATION_HEARING,
    P.MUTATION_APPROVE, P.MUTATION_REJECT, P.MUTATION_RETURN, P.MUTATION_ISSUE_ORDER,
    P.CASE_VIEW_QUEUE, P.CASE_VIEW_DOSSIER, P.CASE_ASSIGN, P.CASE_REASSIGN,
    P.DOCUMENT_VIEW_ASSIGNED, P.DOCUMENT_DOWNLOAD,
    P.NOTIFICATION_VIEW, P.NOTIFICATION_SEND,
    P.ANALYTICS_TEHSIL, P.ANALYTICS_DISTRICT,
    P.AUDIT_VIEW,
  ],

  [Roles.SURVEY_GIS]: [
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC, P.PARCEL_VIEW_OFFICER,
    P.GIS_VERIFY, P.GIS_EDIT, P.GIS_BOUNDARY_CHECK, P.GIS_AREA_RECONCILE,
    P.CASE_VIEW_QUEUE, P.CASE_VIEW_DOSSIER,
    P.DOCUMENT_VIEW_ASSIGNED, P.DOCUMENT_UPLOAD,
    P.NOTIFICATION_VIEW,
  ],

  [Roles.ULB_OFFICER]: [
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC, P.PARCEL_VIEW_OFFICER,
    P.URBAN_TAX_VIEW, P.URBAN_ZONING_VERIFY, P.URBAN_MUTATION_HANDLE,
    P.MUTATION_REVIEW, P.MUTATION_APPROVE, P.MUTATION_REJECT,
    P.CASE_VIEW_QUEUE, P.CASE_VIEW_DOSSIER, P.CASE_ASSIGN,
    P.DOCUMENT_VIEW_ASSIGNED,
    P.NOTIFICATION_VIEW, P.NOTIFICATION_SEND,
    P.ANALYTICS_DISTRICT,
  ],

  [Roles.COLLECTOR]: [
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC, P.PARCEL_VIEW_OFFICER, P.PARCEL_VIEW_SENSITIVE,
    P.CASE_VIEW_QUEUE, P.CASE_VIEW_DOSSIER, P.CASE_REASSIGN,
    P.DOCUMENT_VIEW_ASSIGNED, P.DOCUMENT_DOWNLOAD,
    P.NOTIFICATION_VIEW, P.NOTIFICATION_SEND,
    P.ANALYTICS_TEHSIL, P.ANALYTICS_DISTRICT, P.ANALYTICS_STATE,
    P.AUDIT_VIEW,
  ],

  [Roles.STATE_PMU]: [
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC,
    P.ANALYTICS_TEHSIL, P.ANALYTICS_DISTRICT, P.ANALYTICS_STATE,
    P.NOTIFICATION_VIEW,
    P.AUDIT_VIEW,
  ],

  [Roles.STATE_AUTHORITY]: [
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC,
    P.ANALYTICS_TEHSIL, P.ANALYTICS_DISTRICT, P.ANALYTICS_STATE,
    P.NOTIFICATION_VIEW,
    P.AUDIT_VIEW,
  ],

  [Roles.NATIONAL_MONITOR]: [
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC,
    P.ANALYTICS_STATE, P.ANALYTICS_NATIONAL,
    P.NOTIFICATION_VIEW,
  ],

  [Roles.DOLR_NATIONAL]: [
    P.ANALYTICS_STATE, P.ANALYTICS_NATIONAL,
    P.NOTIFICATION_VIEW,
  ],

  [Roles.ADMIN]: [
    P.ADMIN_USERS, P.ADMIN_ROLES, P.ADMIN_CONFIG,
    P.AUDIT_VIEW,
    P.ANALYTICS_TEHSIL, P.ANALYTICS_DISTRICT, P.ANALYTICS_STATE, P.ANALYTICS_NATIONAL,
    P.NOTIFICATION_VIEW, P.NOTIFICATION_SEND,
    P.PARCEL_SEARCH, P.PARCEL_VIEW_PUBLIC,
    // Admin explicitly does NOT get: MUTATION_APPROVE, MUTATION_REJECT, MUTATION_ISSUE_ORDER
    // Admin is not a statutory bypass
  ],
});

// ─── Permission Check Helpers ──────────────────────────────────────────────────

/**
 * Check whether a role has a specific permission
 */
export function roleHasPermission(role, permission) {
  const perms = ROLE_PERMISSIONS[role];
  if (!perms) return false;
  return perms.includes(permission);
}

export const hasPermission = roleHasPermission;

/**
 * Get all permissions for a role
 */
export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || [];
}

/**
 * Roles that are statutory approval authorities for mutations
 */
export const MUTATION_APPROVAL_ROLES = Object.freeze([
  Roles.TEHSILDAR,
  Roles.CRO,
  Roles.ULB_OFFICER,
]);

/**
 * Roles that require MFA step-up for critical actions
 */
export const MFA_REQUIRED_ROLES = Object.freeze([
  Roles.TEHSILDAR,
  Roles.CRO,
  Roles.COLLECTOR,
  Roles.ADMIN,
]);
