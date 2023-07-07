import { z } from 'zod';

export const createSchema = z.object({
    fullName: z.string().nonempty("Enter a valid name"),
    password: z.string().nonempty("Enter a valid password"),
    email: z.string().email("Provide a valid email").nonempty().trim(),
}).strict();

export const loginSchema = z.object({
    password: z.string().nonempty(),
    email: z.string().email("Provide a valid email").nonempty(),
}).strict();

