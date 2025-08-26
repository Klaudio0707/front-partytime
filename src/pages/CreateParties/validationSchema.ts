import { z } from 'zod';

export const partySchema = z.object({
  title: z.string().min(3, { message: 'O título precisa ter no mínimo 3 caracteres.' }),
  description: z.string().min(10, { message: 'A descrição precisa ter no mínimo 10 caracteres.' }),
  date: z.string().refine((date) => new Date(date) >= new Date(), {
    message: 'A data da festa não pode ser no passado.',
  }),
  budget: z.coerce.number().positive({ message: 'O orçamento deve ser maior que zero.' }),
  image: z.string().url({ message: 'Por favor, insira uma URL válida.' }).or(z.literal('')),
  
  // 👇 LÓGICA DE VALIDAÇÃO CORRIGIDA AQUI 👇
  password: z.string().refine((val) => val.length === 0 || val.length >= 4, {
    message: 'A senha precisa ter no mínimo 4 caracteres.',
  }),
});

export type PartyFormData = z.infer<typeof partySchema>;