import { z } from 'zod';

export const sendMailSchema = z.object({
    subject: z.string().nonempty("Enter a valid name"),
    content: z.string().nonempty("Enter a valid password"),
    cycle: z.number(),
    subscriptionType: z.string().nonempty().trim(),
    date: z.date().optional()
}).strict();
