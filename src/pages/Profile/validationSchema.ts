import { z } from 'zod';

export const profileSchema = z.object({
  username: z.string()
    .min(3, { message: 'O nome de usuário precisa ter no mínimo 3 caracteres.' })
    .or(z.literal('')) // Permite que o campo seja enviado vazio
    .optional(),
    
  password: z.string()
    .min(6, { message: 'A nova senha precisa ter no mínimo 6 caracteres.' })
    .or(z.literal('')) // Permite que o campo seja enviado vazio
    .optional(),
});

// Extrai o tipo para usarmos no nosso componente
export type ProfileFormData = z.infer<typeof profileSchema>;