/**
 * Customer-facing screens: home, explore, listing detail, cart,
 * checkout, orders, favorites, profile, reviews, hotel page.
 */
export const customer = {
  home: {
    heroTitle: "Lezzeti kurtar, israfı önle",
    heroSubtitle:
      "Otellerin açık büfe fazlalarını yarı yarıya indirimli fiyatlarla keşfet.",
    heroCTA: "Yakındakileri Gör",
    nearbyHotels: "Yakındaki Oteller",
    popularPackages: "Öne Çıkan Paketler",
    newListings: "Yeni Eklenenler",
    categories: "Kategoriler",
    lastChance: "Son Şans",
    todaysPickups: "Bugün Teslim Alabileceklerin",
  },

  explore: {
    title: "Keşfet",
    searchPlaceholder: "Otel veya paket ara...",
    filters: "Filtreler",
    sortBy: "Sırala",
    sortOptions: {
      pickupTime: "En yakın teslim",
      discount: "En yüksek indirim",
      priceAsc: "En düşük fiyat",
      priceDesc: "En yüksek fiyat",
      rating: "En yüksek puan",
    },
    filterOptions: {
      priceRange: "Fiyat aralığı",
      distance: "Mesafe",
      category: "Kategori",
      availableNow: "Sadece şu an mevcut olanlar",
      veganOnly: "Sadece vegan",
    },
    resultsCount: "{n} sonuç bulundu",
    applyFilters: "Filtreleri Uygula",
  },

  listing: {
    pickupWindow: "Teslim Saati",
    remaining: "Kalan",
    pieces: "adet",
    soldOut: "Tükendi",
    addToCart: "Sepete Ekle",
    buyNow: "Hemen Al",
    originalPrice: "Liste Fiyatı",
    discountedPrice: "İndirimli",
    youSave: "Kazancın",
    discountBadge: "%{percent} indirim",
    allergens: "Alerjen Bilgisi",
    noAllergenInfo: "Alerjen bilgisi belirtilmedi",
    details: "Paket Detayları",
    aboutHotel: "Otel Hakkında",
    viewHotel: "Oteli Gör",
    viewOnMap: "Haritada Gör",
    addToFavorites: "Favorilere Ekle",
    removeFromFavorites: "Favorilerden Çıkar",
    share: "Paylaş",
    reportListing: "Bu ilanı bildir",
    pickupIn: "{time} içinde teslim",
    pickupExpired: "Teslim saati geçti",
  },

  cart: {
    title: "Sepetim",
    empty: {
      title: "Sepetin boş",
      body: "Keşfet sayfasından lezzetli paketler ekleyebilirsin.",
      cta: "Keşfete Git",
    },
    subtotal: "Ara Toplam",
    serviceFee: "Hizmet Bedeli",
    discount: "İndirim",
    total: "Toplam",
    checkout: "Siparişi Tamamla",
    continueShopping: "Alışverişe Devam Et",
    itemCount: "{n} ürün",
    quantity: "Adet",
    remove: "Kaldır",
    removeConfirm: "Bu paketi sepetten çıkarmak istiyor musun?",
    differentHotelWarning:
      "Farklı bir otelden paket eklediğinde mevcut sepetin temizlenir.",
    differentHotelConfirm:
      "Sepetini temizleyip bu paketi eklemek istiyor musun?",
  },

  checkout: {
    title: "Ödeme",
    orderSummary: "Sipariş Özeti",
    pickup: {
      title: "Teslim Bilgileri",
      hotel: "Otel",
      address: "Adres",
      time: "Teslim Saati",
    },
    paymentMethod: "Ödeme Yöntemi",
    card: "Kredi / Banka Kartı",
    note: "Otele not (opsiyonel)",
    notePlaceholder: "Örn: 19:00'da teslim alabilirim",
    terms: {
      accept:
        "Ön bilgilendirme formunu ve mesafeli satış sözleşmesini okudum, kabul ediyorum",
      linkPreInfo: "Ön bilgilendirme formu",
      linkDistance: "Mesafeli satış sözleşmesi",
    },
    placeOrder: "Siparişi Onayla ve Öde",
    secureNotice: "Tüm ödemeler SSL şifreli ve güvenlidir.",
    processing: "Ödeme işleniyor...",
    successTitle: "Siparişin oluşturuldu",
    successBody:
      "Teslim kodunu siparişlerim sayfasından görebilir, otele giderek ürününü teslim alabilirsin.",
    successCta: "Siparişlerime Git",
  },

  orders: {
    title: "Siparişlerim",
    empty: {
      title: "Henüz siparişin yok",
      body: "İlk siparişini ver, lezzetleri keşfet.",
      cta: "Keşfete Git",
    },
    tabs: {
      active: "Aktif",
      past: "Geçmiş",
    },
    orderNumber: "Sipariş No",
    orderDate: "Sipariş Tarihi",
    orderTotal: "Toplam",
    pickupCode: "Teslim Kodu",
    pickupCodeInfo:
      "Bu kodu otelde göstererek siparişini teslim alabilirsin.",
    pickupCountdown: "Teslim süresi bitimine {time}",
    pickupExpired: "Teslim süresi doldu",
    showCode: "Kodu Göster",
    viewDetails: "Detayları Gör",
    cancel: "Siparişi İptal Et",
    cancelConfirm: "Siparişini iptal etmek istediğine emin misin?",
    cancelReason: "İptal nedeni (opsiyonel)",
    reorder: "Tekrar Sipariş Ver",
    rate: "Değerlendir",
    reportIssue: "Sorun Bildir",
    help: "Siparişle ilgili yardım",
  },

  orderStatus: {
    pending_payment: "Ödeme bekleniyor",
    paid: "Ödendi",
    ready_for_pickup: "Teslime hazır",
    completed: "Teslim edildi",
    cancelled: "İptal edildi",
    refunded: "İade edildi",
    expired: "Süresi doldu",
  },

  favorites: {
    title: "Favorilerim",
    empty: {
      title: "Henüz favori otelin yok",
      body:
        "Beğendiğin otelleri favorilerine ekle, yeni paketler çıktığında haberdar ol.",
      cta: "Otelleri Keşfet",
    },
    removeConfirm: "Bu oteli favorilerden çıkarmak istiyor musun?",
  },

  profile: {
    title: "Hesabım",
    sections: {
      personal: "Kişisel Bilgiler",
      security: "Güvenlik",
      preferences: "Tercihler",
      notifications: "Bildirim Ayarları",
      help: "Yardım ve Destek",
      account: "Hesap",
    },
    personal: {
      fullName: "Ad Soyad",
      email: "E-posta",
      phone: "Telefon",
      birthDate: "Doğum tarihi",
      save: "Değişiklikleri Kaydet",
    },
    security: {
      changePassword: "Şifreyi Değiştir",
      currentPassword: "Mevcut şifre",
      newPassword: "Yeni şifre",
      newPasswordConfirm: "Yeni şifre (tekrar)",
    },
    notifications: {
      orderUpdates: "Sipariş güncellemeleri",
      promotions: "Kampanya ve fırsatlar",
      newListings: "Favori otellerden yeni paketler",
      email: "E-posta",
      push: "Anlık bildirim",
      sms: "SMS",
    },
    danger: {
      deleteAccount: "Hesabı sil",
      deleteDescription:
        "Bu işlem geri alınamaz. Sipariş geçmişin ve favoriyelerin silinir.",
      deleteConfirm: "Hesabını kalıcı olarak silmek istediğine emin misin?",
      deleteCta: "Evet, hesabımı sil",
    },
  },

  review: {
    writeTitle: "Deneyimini Puanla",
    ratingLabel: "Puanın",
    commentLabel: "Yorumun (opsiyonel)",
    commentPlaceholder:
      "Paketin lezzeti, teslim deneyimi, otel hakkında...",
    submit: "Değerlendirmeyi Gönder",
    thanks: "Değerlendirmen için teşekkürler!",
    edit: "Değerlendirmeyi Düzenle",
    starLabel: "{n} yıldız",
  },

  hotelPage: {
    aboutTab: "Hakkında",
    listingsTab: "Aktif Paketler",
    reviewsTab: "Değerlendirmeler",
    noActiveListings: "Bu otelde şu an aktif paket yok",
    reviewsCount: "{n} değerlendirme",
    averageRating: "Ortalama puan",
    follow: "Takip Et",
    following: "Takip Ediliyor",
    openingHours: "Çalışma Saatleri",
    closedToday: "Bugün kapalı",
  },
} as const;