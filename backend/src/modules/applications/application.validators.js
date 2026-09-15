/**
 * Land Stack — Application Validators
 */

import { z } from 'zod';

export const createApplicationSchema = z.object({
  typeCode: z.string().trim().min(1, 'Application type code is required.'),
  parcelUlpin: z.string().trim().min(1, 'Parcel ULPIN is required.').optional(),
  parcelId: z.string().trim().optional(),
  feeAmount: z.number().nonnegative().optional(),
  formData: z.record(z.unknown()).default({}),
  documents: z.array(z.string()).optional(),
  remarks: z.string().trim().max(1000).optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    'SUBMITTED',
    'IN_REVIEW',
    'UNDER_REVIEW',
    'IN_PROGRESS',
    'DOCUMENTS_REQUESTED',
    'APPROVED',
    'REJECTED',
    'COMPLETED',
    'ISSUED',
  ]),
  remarks: z.string().trim().max(2000).optional(),
  rejectionReason: z.string().trim().max(2000).optional(),
});

export const applicationIdParamSchema = z.object({
  id: z.string().trim().min(1, 'Application ID is required.'),
});
