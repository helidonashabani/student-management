import { z } from 'zod';

export const paymentSchema = z.object({
  name: z.string().min(1, 'Name is required')
});
