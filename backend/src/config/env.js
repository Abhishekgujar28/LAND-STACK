import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  ACCESS_TOKEN_MAX_AGE: z.string().default('900'),
  REFRESH_TOKEN_MAX_AGE: z.string().default('604800'),
  OTP_MAX_ATTEMPTS: z.string().default('5'),
  OTP_WINDOW_MINUTES: z.string().default('15'),
  OTP_MAX_PER_DAY: z.string().default('10'),
  SESSION_MAX_AGE: z.string().default('86400'),
  IDLE_TIMEOUT: z.string().default('1800'),

  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX: z.string().default('100'),
  OTP_RATE_LIMIT_WINDOW: z.string().default('900000'),
  OTP_RATE_LIMIT_MAX: z.string().default('5'),
  LOGIN_RATE_LIMIT_WINDOW: z.string().default('900000'),
  LOGIN_RATE_LIMIT_MAX: z.string().default('10'),
  CORS_ORIGIN: z.string().optional(),
  STORAGE_BASE_URL: z.string().url().default('https://storage.landstack.gov.in'),
});

const _env = envSchema.parse(process.env);

export const config = {
  port: parseInt(_env.PORT, 10),
  nodeEnv: _env.NODE_ENV,
  frontendUrl: _env.FRONTEND_URL,

  supabase: {
    url: _env.SUPABASE_URL,
    anonKey: _env.SUPABASE_ANON_KEY,
    serviceRoleKey: _env.SUPABASE_SERVICE_ROLE_KEY,
  },

  auth: {
    accessTokenMaxAge: parseInt(_env.ACCESS_TOKEN_MAX_AGE, 10),
    refreshTokenMaxAge: parseInt(_env.REFRESH_TOKEN_MAX_AGE, 10),
    otpMaxAttempts: parseInt(_env.OTP_MAX_ATTEMPTS, 10),
    otpWindowMinutes: parseInt(_env.OTP_WINDOW_MINUTES, 10),
    otpMaxPerDay: parseInt(_env.OTP_MAX_PER_DAY, 10),
    sessionMaxAge: parseInt(_env.SESSION_MAX_AGE, 10),
    idleTimeout: parseInt(_env.IDLE_TIMEOUT, 10),
  },

  rateLimit: {
    windowMs: parseInt(_env.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(_env.RATE_LIMIT_MAX, 10),
    otpWindowMs: parseInt(_env.OTP_RATE_LIMIT_WINDOW, 10),
    otpMaxRequests: parseInt(_env.OTP_RATE_LIMIT_MAX, 10),
    loginWindowMs: parseInt(_env.LOGIN_RATE_LIMIT_WINDOW, 10),
    loginMaxRequests: parseInt(_env.LOGIN_RATE_LIMIT_MAX, 10),
  },

  cors: {
    origin: _env.CORS_ORIGIN || _env.FRONTEND_URL,
    credentials: true,
  },
  
  storage: {
    baseUrl: _env.STORAGE_BASE_URL,
  },
};
