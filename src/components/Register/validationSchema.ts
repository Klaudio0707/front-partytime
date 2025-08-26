import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(3, { message: 'O nome de usuário precisa ter no mínimo 3 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha precisa ter no mínimo 6 caracteres.' }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"], // Aplica o erro ao campo de confirmação de senha
});

export type RegisterFormData = z.infer<typeof registerSchema>;