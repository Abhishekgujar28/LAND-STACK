/**
 * Land Stack — Parcel Validators (Zod Schemas)
 */

import { z } from 'zod';

export const parcelSearchSchema = z.object({
  search: z.string().trim().max(100).optional(),
  village: z.string().trim().max(20).optional(),
  tehsil: z.string().trim().max(20).optional(),
  district: z.string().trim().max(20).optional(),
  state: z.string().trim().max(10).optional(),
  status: z.enum(['CLEAR', 'DISPUTED', 'RESTRICTED', 'ENCUMBERED']).optional(),
  cursor: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

export const ulpinParamSchema = z.object({
  ulpin: z.string().trim().min(1, 'ULPIN is required.').max(50),
});

export const nearbySearchSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().min(10).max(50000).default(1000), // meters
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
