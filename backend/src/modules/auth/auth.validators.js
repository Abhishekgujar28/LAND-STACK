/**
 * Land Stack — Auth Validators (Zod Schemas)
 */

import { z } from 'zod';

// Validate Indian mobile number (stripping formatting first)
const parseMobile = (val) => {
  if (typeof val !== 'string') return '';
  const digits = val.replace(/\D/g, '').replace(/^91/, '').slice(-10);
  return digits;
};

export const requestOtpSchema = z.object({
  mobile: z.string()
    .trim()
    .refine(val => {
      const digits = parseMobile(val);
      return digits.length === 10 && /^[6-9]/.test(digits);
    }, 'Please enter a valid 10-digit Indian mobile number.')
    .transform(parseMobile),
});

export const verifyOtpSchema = z.object({
  mobile: z.string()
    .trim()
    .refine(val => {
      const digits = parseMobile(val);
      return digits.length === 10 && /^[6-9]/.test(digits);
    }, 'Please enter a valid 10-digit Indian mobile number.')
    .transform(parseMobile),
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
