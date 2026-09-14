/**
 * Land Stack — Mutation Validators
 */

import { z } from 'zod';

export const createMutationSchema = z.object({
  parcelUlpin: z.string().trim().min(1, 'Parcel ULPIN is required.'),
  type: z.enum([
    'Sale Deed Mutation',
    'Succession / Heirship',
    'Partition',
    'Gift Deed',
    'Exchange',
    'Court Order',
    'Government Order',
  ]),
  buyerName: z.string().trim().min(1).max(150).optional(),
  sellerName: z.string().trim().min(1).max(150).optional(),
  remarks: z.string().trim().max(1000).optional(),
  formData: z.record(z.unknown()).optional(),
});

export const mutationActionSchema = z.object({
  remarks: z.string().trim().max(2000).optional(),
  reason: z.string().trim().max(2000).optional(),
});

export const mutationApproveSchema = z.object({
  remarks: z.string().trim().min(1, 'Decision reason is required for approval.').max(2000),
  _mfaToken: z.string().trim().min(1, 'MFA token is required for approval.').optional(),
});

export const mutationRejectSchema = z.object({
  reason: z.string().trim().min(1, 'Rejection reason is required.').max(2000),
  _mfaToken: z.string().trim().min(1, 'MFA token is required for rejection.').optional(),
});

export const mutationIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Mutation ID is required.'),
});

export const objectionSchema = z.object({
  objectorName: z.string().trim().min(1).max(150),
  objectionType: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(5000),
  evidenceDocIds: z.array(z.string()).optional(),
});

export const hearingSchema = z.object({
  scheduledDate: z.string().datetime({ message: 'Valid datetime required for hearing date.' }),
  venue: z.string().trim().min(1).max(200),
  notes: z.string().trim().max(2000).optional(),
});
