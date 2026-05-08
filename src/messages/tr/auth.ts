/**
 * Auth screens: login, register, forgot password, reset, verify email.
 */
export const auth = {
  login: {
    title: "Giriş Yap",
    subtitle: "Hesabına giriş yaparak devam et",
    email: "E-posta",
    password: "Şifre",
    rememberMe: "Beni hatırla",
    submit: "Giriş Yap",
    forgotPassword: "Şifremi unuttum",
    noAccount: "Hesabın yok mu?",
    register: "Kayıt Ol",
    orContinueWith: "veya şununla devam et",
    continueWithGoogle: "Google ile devam et",
    continueWithApple: "Apple ile devam et",
    justRegistered: "Kaydın tamamlandı. Şimdi giriş yapabilirsin.",
  },

  register: {
    title: "Hesap Oluştur",
    subtitle: "Aramıza katıl, lezzetli fırsatları kaçırma",
    fullName: "Ad Soyad",
    email: "E-posta",
    phone: "Telefon",
    phoneOptional: "Telefon (opsiyonel)",
    password: "Şifre",
    passwordConfirm: "Şifre (tekrar)",
    passwordHint: "En az 8 karakter",
    termsAccept:
      "Kullanım koşullarını ve gizlilik politikasını okudum, kabul ediyorum",
    marketingOptIn:
      "Kampanya ve fırsatlardan e-posta ile haberdar olmak istiyorum",
    submit: "Hesap Oluştur",
    hasAccount: "Zaten hesabın var mı?",
    login: "Giriş Yap",
  },

  registerChoice: {
    title: "Nasıl başlamak istersin?",
    subtitle: "Kullanacağın role göre kayıt ol",
    asCustomer: {
      title: "Müşteri olarak kaydol",
      description:
        "Çevrendeki otellerin büfe fazlalarını indirimli fiyatla satın al.",
      cta: "Müşteri Olarak Başla",
    },
    asHotel: {
      title: "Otel olarak başvur",
      description:
        "Kalan yemeklerini satışa sun, israfı azalt, gelir elde et.",
      cta: "Otel Başvurusu Yap",
    },
  },

  hotelApply: {
    title: "Otel Başvurusu",
    subtitle:
      "Başvurun onaylandığında hemen satışa başlayabilirsin. Onay süresi genelde 1-2 iş günü.",
    hotelName: "Otel Adı",
    city: "Şehir",
    district: "İlçe",
    addressLine: "Açık Adres",
    taxNumber: "Vergi Numarası",
    contactName: "Yetkili Adı",
    contactPhone: "Yetkili Telefonu",
    submit: "Başvuruyu Gönder",
    success: {
      title: "Başvurun alındı",
      body: "Başvurun incelendikten sonra sana e-posta ile dönüş yapacağız.",
      cta: "Anasayfaya dön",
    },
  },

  forgot: {
    title: "Şifreni mi unuttun?",
    description:
      "E-posta adresini gir, sana sıfırlama bağlantısı gönderelim.",
    email: "E-posta",
    submit: "Sıfırlama Bağlantısı Gönder",
    backToLogin: "Giriş sayfasına dön",
    sent: {
      title: "Bağlantıyı gönderdik",
      body: "E-postanı kontrol et. Bağlantı 1 saat geçerli.",
    },
  },

  reset: {
    title: "Yeni şifre belirle",
    description: "Güçlü bir şifre seç.",
    password: "Yeni şifre",
    passwordConfirm: "Şifreyi doğrula",
    submit: "Şifreyi Güncelle",
    success: "Şifren güncellendi. Yeni şifrenle giriş yapabilirsin.",
  },

  verifyEmail: {
    title: "E-postanı doğrula",
    body: "{email} adresine bir doğrulama bağlantısı gönderdik. Gelen kutunu kontrol et.",
    resend: "Tekrar gönder",
    resendSuccess: "Doğrulama e-postası tekrar gönderildi.",
    wrongEmail: "Farklı e-posta ile kayıt ol",
  },
} as const;