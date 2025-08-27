
import { z } from "zod";

export const serviceSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome do serviço precisa ter no mínimo 3 caracteres." }),
  price: z
    .number({ message: "O preço deve ser um número." })
    .positive({ message: "O preço deve ser maior que zero." }),
});

export type ServiceFormData = z.infer<typeof serviceSchema>; // ✅ tipagem direta
