/**
 * Land Stack — Auth Validators (Zod Schemas)
 */

import { z } from 'zod';

// Indian mobile number: 10 digits, optionally with +91 prefix
const mobileRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;

export const requestOtpSchema = z.object({
  mobile: z.string()
    .trim()
    .regex(mobileRegex, 'Please enter a valid Indian mobile number.')
    .transform(val => {
      // Normalize to plain 10-digit number
      return val.replace(/[\s\-+]/g, '').replace(/^91/, '').slice(-10);
    }),
});

export const verifyOtpSchema = z.object({
  mobile: z.string()
    .trim()
    .regex(mobileRegex, 'Please enter a valid Indian mobile number.')
    .transform(val => val.replace(/[\s\-+]/g, '').replace(/^91/, '').slice(-10)),
  otp: z.string()
    .trim()
    .length(6, 'OTP must be 6 digits.')
    .regex(/^\d{6}$/, 'OTP must contain only digits.'),
});

export const governmentLoginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

export const contextSwitchSchema = z.object({
  context: z.enum(['RURAL', 'URBAN', 'SHARED_GIS', 'STATE', 'NATIONAL'], {
    errorMap: () => ({ message: 'Invalid context. Must be one of: RURAL, URBAN, SHARED_GIS, STATE, NATIONAL.' }),
  }),
  assignmentId: z.string().trim().optional(),
});
