/**
 * Turkish content dictionary for Eat In.
 *
 * Strategy:
 * - Single source of truth for all user-facing text.
 * - Namespaced by audience (common, auth, customer, hotel, admin).
 * - Keys are English, values are Turkish (so code/search stays easy).
 * - Placeholders use {name} syntax, replaced by a small `t()` helper.
 * - Later we can swap this for next-intl / react-i18next without touching callers.
 */

export const tr = {
  common: {
    appName: "Eat In",
    tagline: "İsraf yok, lezzet bol",
    loading: "Yükleniyor...",
    save: "Kaydet",
    cancel: "Vazgeç",
    delete: "Sil",
    edit: "Düzenle",
    confirm: "Onayla",
    back: "Geri",
    next: "Devam",
    close: "Kapat",
    search: "Ara",
    filter: "Filtrele",
    all: "Tümü",
    yes: "Evet",
    no: "Hayır",
    currency: "₺",
    minutesAgo: "{n} dk önce",
    hoursAgo: "{n} sa önce",
  },

  nav: {
    home: "Anasayfa",
    explore: "Keşfet",
    orders: "Siparişlerim",
    favorites: "Favoriler",
    profile: "Hesabım",
    logout: "Çıkış Yap",
  },

  auth: {
    login: {
      title: "Giriş Yap",
      subtitle: "Hesabına giriş yaparak devam et",
      email: "E-posta",
      password: "Şifre",
      submit: "Giriş Yap",
      forgotPassword: "Şifremi unuttum",
      noAccount: "Hesabın yok mu?",
      register: "Kayıt Ol",
      orContinueWith: "veya şununla devam et",
    },
    register: {
      title: "Hesap Oluştur",
      subtitle: "Aramıza katıl, lezzetli fırsatları kaçırma",
      fullName: "Ad Soyad",
      email: "E-posta",
      phone: "Telefon",
      password: "Şifre",
      passwordConfirm: "Şifre (tekrar)",
      asCustomer: "Müşteri Olarak Kaydol",
      asHotel: "Otel Olarak Başvur",
      termsAccept: "Kullanım koşullarını ve gizlilik politikasını kabul ediyorum",
      submit: "Hesap Oluştur",
      hasAccount: "Zaten hesabın var mı?",
      login: "Giriş Yap",
    },
    forgot: {
      title: "Şifreni mi unuttun?",
      description: "E-posta adresini gir, sana sıfırlama bağlantısı gönderelim.",
      submit: "Sıfırlama Bağlantısı Gönder",
      backToLogin: "Giriş sayfasına dön",
    },
    reset: {
      title: "Yeni Şifre Belirle",
      submit: "Şifreyi Güncelle",
    },
  },

  customer: {
    home: {
      heroTitle: "Lezzeti kurtar, israfı önle",
      heroSubtitle: "Otellerin kalan açık büfe yemeklerini indirimli fiyatlarla keşfet.",
      nearby: "Yakındaki Oteller",
      popular: "Öne Çıkan Paketler",
      categories: "Kategoriler",
      viewAll: "Tümünü Gör",
    },
    listing: {
      pickupWindow: "Teslim Saati",
      remaining: "Kalan",
      pieces: "adet",
      soldOut: "Tükendi",
      addToCart: "Sepete Ekle",
      buyNow: "Hemen Al",
      originalPrice: "Liste Fiyatı",
      youSave: "Kazancınız",
      allergens: "Alerjen Bilgisi",
      details: "Paket Detayları",
      aboutHotel: "Otel Hakkında",
    },
    cart: {
      title: "Sepetim",
      empty: "Sepetin boş görünüyor",
      subtotal: "Ara Toplam",
      serviceFee: "Hizmet Bedeli",
      total: "Toplam",
      checkout: "Siparişi Tamamla",
    },
    checkout: {
      title: "Ödeme",
      summary: "Sipariş Özeti",
      paymentMethod: "Ödeme Yöntemi",
      payWithCard: "Kartla Öde",
      placeOrder: "Siparişi Onayla",
      secureNotice: "Ödemeler SSL şifreli ve güvenlidir.",
    },
    orders: {
      empty: "Henüz siparişin yok",
      active: "Aktif Siparişler",
      past: "Geçmiş Siparişler",
      pickupCode: "Teslim Kodu",
      pickupCodeInfo: "Bu kodu otelde göstererek siparişini teslim alabilirsin.",
      orderNumber: "Sipariş No",
      status: {
        pending_payment: "Ödeme bekleniyor",
        paid: "Ödendi",
        ready_for_pickup: "Teslime hazır",
        completed: "Tamamlandı",
        cancelled: "İptal edildi",
        refunded: "İade edildi",
        expired: "Süresi doldu",
      },
      rate: "Değerlendir",
    },
    favorites: {
      empty: "Henüz favori otelin yok",
    },
  },

  hotel: {
    nav: {
      dashboard: "Panel",
      listings: "Paketler",
      orders: "Siparişler",
      revenue: "Gelir",
      scanner: "Kod Okut",
      settings: "Ayarlar",
    },
    dashboard: {
      title: "Otel Paneli",
      todaySales: "Bugünkü Satış",
      activeListings: "Aktif Paket",
      pendingOrders: "Bekleyen Sipariş",
      avgRating: "Ortalama Puan",
      quickActions: "Hızlı İşlemler",
      newListing: "Yeni Paket Oluştur",
    },
    listings: {
      title: "Paketlerim",
      empty: "Henüz paket eklemedin",
      createNew: "Yeni Paket",
      form: {
        title: "Paket Adı",
        description: "Açıklama",
        category: "Kategori",
        originalPrice: "Liste Fiyatı (₺)",
        discountedPrice: "İndirimli Fiyat (₺)",
        quantity: "Adet",
        pickupStart: "Teslim Başlangıç",
        pickupEnd: "Teslim Bitiş",
        allergens: "Alerjen Bilgisi",
        image: "Görsel",
        publish: "Yayına Al",
        saveDraft: "Taslak Olarak Kaydet",
      },
    },
    orders: {
      title: "Siparişler",
      incoming: "Gelen Siparişler",
      readyForPickup: "Teslime Hazır",
      completed: "Teslim Edildi",
      markReady: "Teslime Hazır İşaretle",
      markDelivered: "Teslim Edildi",
      scanCode: "Teslim Kodunu Okut",
      codePrompt: "Müşterinin kodunu gir",
      verify: "Doğrula",
    },
    settings: {
      profile: "Otel Bilgileri",
      staff: "Personel",
      payout: "Tahsilat & IBAN",
      hours: "Çalışma Saatleri",
    },
  },

  admin: {
    nav: {
      overview: "Genel Bakış",
      hotels: "Oteller",
      users: "Kullanıcılar",
      orders: "Siparişler",
      payments: "Ödemeler",
      categories: "Kategoriler",
      logs: "Denetim Kayıtları",
    },
    hotels: {
      pending: "Onay Bekleyen",
      approve: "Onayla",
      reject: "Reddet",
      suspend: "Askıya Al",
    },
  },

  errors: {
    required: "Bu alan zorunludur",
    invalidEmail: "Geçerli bir e-posta adresi giriniz",
    invalidPhone: "Geçerli bir telefon numarası giriniz",
    minLength: "En az {min} karakter olmalıdır",
    maxLength: "En fazla {max} karakter olabilir",
    passwordsDontMatch: "Şifreler eşleşmiyor",
    wrongCredentials: "E-posta veya şifre hatalı",
    serverError: "Sunucu hatası, lütfen tekrar dene",
    unauthorized: "Bu işlem için yetkin yok",
    notFound: "Aradığın içerik bulunamadı",
    outOfStock: "Üzgünüz, bu paket tükendi",
    pickupWindowPassed: "Teslim saati geçti",
  },

  success: {
    saved: "Kaydedildi",
    orderPlaced: "Siparişin başarıyla oluşturuldu",
    listingPublished: "Paket yayına alındı",
    pickupVerified: "Teslim başarıyla doğrulandı",
  },

  empty: {
    noOrders: "Henüz siparişin yok",
    noListings: "Henüz paket eklenmedi",
    noFavorites: "Henüz favorin yok",
    noResults: "Sonuç bulunamadı",
  },
} as const;

export type Messages = typeof tr;

/**
 * Tiny interpolation helper.
 * t(tr.common.minutesAgo, { n: 3 })  =>  "3 dk önce"
 */
export function t(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}