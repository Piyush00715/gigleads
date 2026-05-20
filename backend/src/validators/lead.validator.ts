import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createLeadSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Lead name is required' }).min(2, 'Name must be at least 2 characters'),
    email: z.string({ required_error: 'Lead email is required' }).email('Please provide a valid email'),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).default('New'),
    source: z.enum(['Website', 'Instagram', 'Referral'], { required_error: 'Lead source is required' }),
    assignedTo: z.string().regex(objectIdRegex, 'Invalid User ID for assignment').optional(),
  }),
});

export const updateLeadSchema = z.object({
  params: z.object({
    id: z.string().regex(objectIdRegex, 'Invalid Lead ID'),
  }),
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    email: z.string().email('Please provide a valid email').optional(),
    status: z.enum(['New', 'Contacted', 'Qualified', 'Lost']).optional(),
    source: z.enum(['Website', 'Instagram', 'Referral']).optional(),
    assignedTo: z.string().regex(objectIdRegex, 'Invalid User ID for assignment').nullable().optional(),
  }),
});

export const leadQuerySchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
    status: z.string().optional(),
    source: z.string().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['createdAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
  }),
});
