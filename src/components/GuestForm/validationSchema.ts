import { z } from 'zod';

export const guestSchema = z.object({
  name: z.string().min(3, { message: 'O nome precisa ter no mínimo 3 caracteres.' }),
  phone: z.string().min(10, { message: 'Insira um telefone válido com DDD.' }),
});

export type GuestFormData = z.infer<typeof guestSchema>;