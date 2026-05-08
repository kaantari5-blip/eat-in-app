/**
 * Hotel dashboard screens.
 */
export const hotel = {
  nav: {
    dashboard: "Panel",
    listings: "Paketler",
    orders: "Siparişler",
    revenue: "Gelir",
    scanner: "Kod Okut",
    settings: "Ayarlar",
    staff: "Personel",
    analytics: "İstatistikler",
  },

  dashboard: {
    title: "Otel Paneli",
    welcome: "Merhaba, {name}",
    subtitle: "Bugünün özeti",
    stats: {
      todaySales: "Bugünkü Satış",
      weekSales: "Bu Haftaki Satış",
      monthSales: "Bu Ayki Satış",
      activeListings: "Aktif Paket",
      pendingOrders: "Bekleyen Sipariş",
      readyForPickup: "Teslime Hazır",
      completedToday: "Bugün Teslim Edilen",
      avgRating: "Ortalama Puan",
      totalReviews: "{n} değerlendirme",
    },
    quickActions: "Hızlı İşlemler",
    action: {
      newListing: "Yeni Paket Oluştur",
      viewOrders: "Siparişleri Yönet",
      scanCode: "Teslim Kodu Okut",
    },
    recentOrders: "Son Siparişler",
    recentOrdersEmpty: "Henüz siparişin yok",
    viewAllOrders: "Tüm siparişleri gör",
    lowStock: {
      title: "Az Stok",
      itemLine: "{title} — {remaining} adet kaldı",
    },
    expiringSoon: {
      title: "Teslim Saati Yaklaşan Paketler",
      empty: "Yakın saatte teslim edilecek paket yok",
    },
  },

  listings: {
    title: "Paketlerim",
    createNew: "Yeni Paket",
    search: "Paket ara",
    empty: {
      title: "Henüz paket eklemedin",
      body: "İlk paketini oluştur, müşterilerin görsün.",
      cta: "Yeni Paket Oluştur",
    },
    tabs: {
      active: "Aktif",
      draft: "Taslak",
      soldOut: "Tükenenler",
      archived: "Arşivde",
    },
    card: {
      remainingPieces: "{remaining}/{total} kaldı",
      pickupRange: "Teslim: {start} - {end}",
    },
    form: {
      sectionBasics: "Temel Bilgiler",
      sectionPricing: "Fiyat ve Adet",
      sectionPickup: "Teslim Zamanı",
      sectionImage: "Görsel",
      sectionExtras: "Ek Bilgiler",

      title: "Paket Adı",
      titlePlaceholder: "Örn: Sürpriz Kahvaltı Paketi",
      titleHint: "Müşteriler bu isimle görecek",
      description: "Açıklama",
      descriptionPlaceholder: "Pakette neler olabilir, kısa tanıt",
      category: "Kategori",
      categoryPlaceholder: "Kategori seç",

      originalPrice: "Liste Fiyatı (₺)",
      originalPriceHint: "İndirimsiz değer",
      discountedPrice: "Satış Fiyatı (₺)",
      discountedPriceHint: "Müşteri bu fiyatı öder",
      discountPreview: "%{percent} indirim uygulanacak",
      totalQuantity: "Toplam Adet",
      quantityHint: "Bu paketten kaç adet satacaksın?",

      pickupStart: "Teslim Başlangıç",
      pickupEnd: "Teslim Bitiş",
      pickupHint:
        "Müşteri bu aralıkta otele uğrayıp teslim alacak",

      image: "Paket Görseli",
      imageHint: "Önerilen: 1200×800, en fazla 5 MB. JPG veya PNG.",
      uploadImage: "Görsel Yükle",
      changeImage: "Görseli Değiştir",
      removeImage: "Görseli Kaldır",

      allergens: "Alerjen Bilgisi",
      allergensPlaceholder: "Örn: Gluten, süt, fındık içerir",

      publish: "Yayına Al",
      saveDraft: "Taslak Olarak Kaydet",
      update: "Değişiklikleri Kaydet",
      discardChanges: "Değişiklikleri İptal Et",
    },
    status: {
      draft: "Taslak",
      active: "Aktif",
      sold_out: "Tükendi",
      expired: "Süresi Doldu",
      archived: "Arşivde",
    },
    actions: {
      edit: "Düzenle",
      duplicate: "Kopyala",
      archive: "Arşivle",
      unarchive: "Arşivden Çıkar",
      delete: "Sil",
      deleteConfirm:
        "Bu paketi silmek istediğine emin misin? Geri alınamaz.",
    },
  },

  orders: {
    title: "Siparişler",
    tabs: {
      incoming: "Gelen",
      readyForPickup: "Teslime Hazır",
      completed: "Teslim Edilen",
      cancelled: "İptal",
    },
    search: "Sipariş no, müşteri veya kod ara",
    empty: "Bu kategoride sipariş yok",
    row: {
      orderNumber: "Sipariş No",
      customer: "Müşteri",
      items: "Paket",
      total: "Tutar",
      code: "Kod",
      pickupTime: "Teslim Saati",
      status: "Durum",
    },
    action: {
      markReady: "Teslime Hazır",
      markDelivered: "Teslim Edildi",
      scanCode: "Kodu Okut",
      contactCustomer: "Müşteriyle İletişime Geç",
      cancelOrder: "Siparişi İptal Et",
    },
    cancelModal: {
      title: "Siparişi iptal et",
      body:
        "Bu siparişi iptal etmek müşteriye tam iade yapılmasına yol açar.",
      reasonLabel: "İptal nedeni",
      reasonPlaceholder: "Örn: Paket hazırlanamadı",
      confirm: "Evet, İptal Et",
      cancel: "Vazgeç",
    },
  },

  scanner: {
    title: "Teslim Kodu Okut",
    subtitle: "Müşteriden aldığın 6 haneli kodu gir.",
    codeLabel: "Teslim Kodu",
    codePlaceholder: "Örn: A3X9K7",
    verify: "Doğrula",
    success: {
      title: "Teslim onaylandı",
      body: "Sipariş başarıyla müşteriye teslim edildi.",
      another: "Yeni Kod Okut",
    },
    invalid: "Kod geçersiz. Lütfen kontrol edip tekrar dene.",
    expired: "Bu teslim kodunun süresi dolmuş.",
    alreadyUsed: "Bu kod daha önce kullanılmış.",
    orderInfo: {
      customer: "Müşteri",
      items: "Paketler",
      total: "Tutar",
    },
  },

  settings: {
    title: "Ayarlar",
    tabs: {
      profile: "Otel Bilgileri",
      hours: "Çalışma Saatleri",
      staff: "Personel",
      payout: "Tahsilat",
    },
    profile: {
      logo: "Logo",
      logoHint: "Önerilen: 512×512 kare",
      cover: "Kapak Görseli",
      coverHint: "Önerilen: 1600×900",
      name: "Otel Adı",
      description: "Otel Açıklaması",
      descriptionPlaceholder: "Otelini kısaca tanıt",
      phone: "İletişim Telefonu",
      email: "İletişim E-postası",
      addressLine: "Açık Adres",
      city: "Şehir",
      district: "İlçe",
      postalCode: "Posta Kodu",
      map: "Haritada Konum",
      save: "Kaydet",
    },
    hours: {
      description: "Müşterilerin göreceği çalışma saatleri.",
      day: "Gün",
      open: "Açılış",
      close: "Kapanış",
      closed: "Kapalı",
    },
    staff: {
      title: "Personel",
      description:
        "Otelinin yönetimine yardımcı olacak personeli buradan ekleyebilirsin.",
      empty: "Henüz personel eklemedin",
      addMember: "Personel Ekle",
      invite: {
        title: "Personel Davet Et",
        email: "Kullanıcının e-postası",
        role: "Rol",
        roleOptions: {
          manager: "Yönetici",
          staff: "Personel",
        },
        submit: "Davet Gönder",
      },
      row: {
        role: "Rol",
        addedOn: "Eklenme tarihi",
        remove: "Kaldır",
        removeConfirm:
          "Bu kişiyi personelden çıkarmak istediğine emin misin?",
      },
    },
    payout: {
      title: "Tahsilat Bilgileri",
      description:
        "Satışlarından yapılacak ödemeler bu hesaba gönderilir.",
      iban: "IBAN",
      ibanPlaceholder: "TR.. .... .... .... .... .... ..",
      accountHolder: "Hesap Sahibi",
      taxNumber: "Vergi / TCKN",
      commission: "Komisyon Oranı",
      commissionNote:
        "Bu oran her siparişten alınır. Anlaşmalı oran için destek ile iletişime geç.",
      upcoming: "Bekleyen Ödeme",
      history: "Ödeme Geçmişi",
      save: "Kaydet",
    },
  },

  onboarding: {
    welcomeTitle: "Hoş geldin, {name}",
    welcomeBody:
      "Eat In paneline hoş geldin. Birkaç adımda ilk paketini yayınlamaya hazır olacaksın.",
    steps: {
      profile: {
        title: "Otel bilgilerini tamamla",
        body: "Logo, adres ve açıklama ekleyerek profili tamamla.",
      },
      hours: {
        title: "Çalışma saatlerini belirle",
        body: "Müşterilerin sana ne zaman ulaşabileceğini gör.",
      },
      listing: {
        title: "İlk paketini oluştur",
        body: "Satmak istediğin ilk paketi yayınla.",
      },
    },
    completeStep: "Adımı tamamla",
    completed: "Tebrikler, kurulum tamamlandı!",
  },
} as const;