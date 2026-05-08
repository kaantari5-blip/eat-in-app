import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
});

export const customerRegisterSchema = z
  .object({
    fullName: z.string().min(2, "Ad Soyad en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    phone: z.string().optional(),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
    passwordConfirm: z.string().min(6, "Şifre tekrarı en az 6 karakter olmalıdır"),
    termsAccept: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.termsAccept) {
      ctx.addIssue({
        code: "custom",
        path: ["termsAccept"],
        message: "Kullanım koşullarını kabul etmelisiniz",
      });
    }

    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        path: ["passwordConfirm"],
        message: "Şifreler eşleşmiyor",
      });
    }
  });

export const hotelRegisterSchema = z
  .object({
    fullName: z.string().min(2, "Yetkili adı en az 2 karakter olmalıdır"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    phone: z.string().optional(),
    password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
    passwordConfirm: z.string().min(6, "Şifre tekrarı en az 6 karakter olmalıdır"),
    hotelName: z.string().min(2, "Otel adı en az 2 karakter olmalıdır"),
    city: z.string().min(2, "Şehir zorunludur"),
    addressLine: z.string().min(5, "Adres zorunludur"),
    taxNumber: z.string().optional(),
    termsAccept: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.termsAccept) {
      ctx.addIssue({
        code: "custom",
        path: ["termsAccept"],
        message: "Kullanım koşullarını kabul etmelisiniz",
      });
    }

    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        path: ["passwordConfirm"],
        message: "Şifreler eşleşmiyor",
      });
    }
  });