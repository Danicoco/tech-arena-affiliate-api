import { z } from 'zod';

export const createSchema = z.object({
    fullName: z.string().nonempty("Enter a valid name"),
    type: z.string().nonempty("Enter a valid type"),
    email: z.string().email("Provide a valid email").nonempty().trim(),
}).strict();

export const fetchSchema = z.object({
    fullName: z.string().optional(),
    email: z.string().email("Provide a valid email").optional(),
    isActive: z.boolean().optional(),
}).strict();

