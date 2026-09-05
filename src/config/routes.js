/**
 * Central route path constants for Land Stack
 */
export const ROUTES = {
  // Public
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  HELP: '/help',
  CONTACT: '/contact',

  // Authentication
  LOGIN: '/login',
  LOGIN_CITIZEN: '/login/citizen',
  LOGIN_GOVERNMENT: '/login/government',
  LOGIN_OTP: '/login/otp',
  LOGIN_ROLE: '/login/role',
  FORGOT_PASSWORD: '/login/forgot-password',

  // Citizen Portal
  CITIZEN_DASHBOARD: '/citizen/dashboard',
  CITIZEN_SEARCH: '/citizen/search',
  CITIZEN_PARCELS: '/citizen/parcels',
  CITIZEN_PARCEL_DETAIL: '/citizen/parcels/:id',
  CITIZEN_MUTATIONS: '/citizen/mutations',
  CITIZEN_APPLICATIONS: '/citizen/applications',
  CITIZEN_DOCUMENTS: '/citizen/documents',
  CITIZEN_WATCHLIST: '/citizen/watchlist',
  CITIZEN_NOTIFICATIONS: '/citizen/notifications',
  CITIZEN_GRIEVANCES: '/citizen/grievances',
  CITIZEN_DUE_DILIGENCE: '/citizen/due-diligence',
  CITIZEN_PROFILE: '/citizen/profile',

  // Government Portal — Core & Workspaces
  GOVERNMENT_DASHBOARD: '/government/dashboard',
  GOVERNMENT_TALATHI: '/government/talathi',
  GOVERNMENT_TEHSILDAR: '/government/tehsildar',
  GOVERNMENT_REVENUE: '/government/revenue',
  GOVERNMENT_REGISTRATION: '/government/registration',
  GOVERNMENT_DISTRICT: '/government/district',
  GOVERNMENT_STATE: '/government/state',
  GOVERNMENT_NATIONAL: '/government/national',
  GOVERNMENT_ADMIN: '/government/admin',

  // Government Shared Pages
  GOVERNMENT_WORK_QUEUE: '/government/work-queue',
  GOVERNMENT_PARCELS: '/government/parcels',
  GOVERNMENT_MUTATIONS: '/government/mutations',
  GOVERNMENT_CASES: '/government/cases',
  GOVERNMENT_MAP: '/government/map',
  GOVERNMENT_ANALYTICS: '/government/analytics',
  GOVERNMENT_DATA_QUALITY: '/government/data-quality',
  GOVERNMENT_INTEGRATIONS: '/government/integrations',
  GOVERNMENT_AUDIT: '/government/audit',
};

export default ROUTES;
