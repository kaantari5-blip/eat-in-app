/**
 * Auth validation schemas (Zod).
 * All error messages in Turkish so they can be displayed verbatim
 * by the form layer.
 */
import { z } from "zod";
import { tr } from "@/messages/tr/tr";

const emailSchema = z
  .string()
  .min(1, tr.errors.required)
  .email(tr.errors.invalidEmail);

const passwordSchema = z
  .string()
  .min(8, "Şifre en az 8 karakter olmalıdır");

const phoneSchema = z
  .string()
  .regex(/^\+?[0-9 ()-]{7,20}$/, tr.errors.invalidPhone)
  .optional()
  .or(z.literal(""));

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, tr.errors.required),
});

export const customerRegisterSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Ad soyad en az 2 karakter olmalıdır")
      .max(80),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
    termsAccept: z.literal(true),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: tr.errors.passwordsDontMatch,
    path: ["passwordConfirm"],
  });

export const hotelRegisterSchema = z
  .object({
    fullName: z.string().min(2).max(80),
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    passwordConfirm: z.string(),
    termsAccept: z.literal(true),
    hotelName: z.string().min(2, "Otel adı en az 2 karakter olmalıdır").max(120),
    city: z.string().min(2),
    addressLine: z.string().min(5, "Adres çok kısa"),
    taxNumber: z.string().optional().or(z.literal("")),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: tr.errors.passwordsDontMatch,
    path: ["passwordConfirm"],
  });

export const forgotPasswordSchema = z.object({ email: emailSchema });
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: tr.errors.passwordsDontMatch,
    path: ["passwordConfirm"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type CustomerRegisterInput = z.infer<typeof customerRegisterSchema>;
export type HotelRegisterInput = z.infer<typeof hotelRegisterSchema>;