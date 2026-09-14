import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  supabase: {
    url: process.env.SUPABASE_URL,
    anonKey: process.env.SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },

  // Auth configuration
  auth: {
    accessTokenMaxAge: parseInt(process.env.ACCESS_TOKEN_MAX_AGE || '900', 10), // 15 min in seconds
    refreshTokenMaxAge: parseInt(process.env.REFRESH_TOKEN_MAX_AGE || '604800', 10), // 7 days
    otpMaxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10),
    otpWindowMinutes: parseInt(process.env.OTP_WINDOW_MINUTES || '15', 10),
    otpMaxPerDay: parseInt(process.env.OTP_MAX_PER_DAY || '10', 10),
    sessionMaxAge: parseInt(process.env.SESSION_MAX_AGE || '86400', 10), // 24 hours
    idleTimeout: parseInt(process.env.IDLE_TIMEOUT || '1800', 10), // 30 min
  },

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    otpWindowMs: parseInt(process.env.OTP_RATE_LIMIT_WINDOW || '900000', 10),
    otpMaxRequests: parseInt(process.env.OTP_RATE_LIMIT_MAX || '5', 10),
    loginWindowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW || '900000', 10),
    loginMaxRequests: parseInt(process.env.LOGIN_RATE_LIMIT_MAX || '10', 10),
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  },
};
