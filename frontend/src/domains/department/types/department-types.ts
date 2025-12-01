import { z } from 'zod';
import { paymentSchema } from './payment-schema';

export type paymentForm = z.infer<typeof paymentSchema>;
export type paymentFormWithId = paymentForm & { id: number };
export type paymentData = {
  payments: paymentFormWithId[];
};
