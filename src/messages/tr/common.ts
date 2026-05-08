/**
 * Common UI strings: buttons, labels, generic states.
 * Tone: informal ("sen"), startup-native Turkish.
 */
export const common = {
  appName: "Eat In",
  tagline: "İsraf yok, lezzet bol",
  appDescription: "Otellerin açık büfe fazlalarını indirimli fiyatla keşfet.",

  // --- Actions (Title Case — these go on buttons) ---
  save: "Kaydet",
  cancel: "Vazgeç",
  delete: "Sil",
  edit: "Düzenle",
  confirm: "Onayla",
  submit: "Gönder",
  back: "Geri",
  next: "Devam",
  previous: "Önceki",
  close: "Kapat",
  done: "Tamam",
  continue: "Devam Et",
  retry: "Tekrar Dene",
  apply: "Uygula",
  reset: "Sıfırla",
  create: "Oluştur",
  add: "Ekle",
  remove: "Kaldır",
  update: "Güncelle",
  upload: "Yükle",
  download: "İndir",
  share: "Paylaş",
  copy: "Kopyala",
  send: "Gönder",
  approve: "Onayla",
  reject: "Reddet",
  duplicate: "Kopyala",
  archive: "Arşivle",
  restore: "Geri Getir",

  // --- States (sentence case — inline) ---
  loading: "Yükleniyor...",
  saving: "Kaydediliyor...",
  deleting: "Siliniyor...",
  uploading: "Yükleniyor...",
  processing: "İşleniyor...",
  searching: "Aranıyor...",
  sending: "Gönderiliyor...",

  // --- Generic words ---
  yes: "Evet",
  no: "Hayır",
  all: "Tümü",
  none: "Yok",
  more: "Daha fazla",
  less: "Daha az",
  showMore: "Daha fazla göster",
  showLess: "Daha az göster",
  viewAll: "Tümünü gör",
  seeMore: "Devamını gör",
  optional: "opsiyonel",
  required: "zorunlu",

  // --- Search / filter / sort ---
  search: "Ara",
  searchPlaceholder: "Ara...",
  filter: "Filtrele",
  filters: "Filtreler",
  sort: "Sırala",
  sortBy: "Sırala",
  clear: "Temizle",
  clearAll: "Tümünü Temizle",
  clearFilters: "Filtreleri Temizle",

  // --- Time labels ---
  today: "Bugün",
  yesterday: "Dün",
  tomorrow: "Yarın",
  now: "Az önce",
  thisWeek: "Bu hafta",
  thisMonth: "Bu ay",
  // interpolation templates — use t()
  minutesAgo: "{n} dk önce",
  hoursAgo: "{n} sa önce",
  daysAgo: "{n} gün önce",
  inMinutes: "{n} dakika içinde",
  inHours: "{n} saat içinde",
  minutesLeft: "{n} dk kaldı",
  hoursLeft: "{n} sa kaldı",
  hoursMinutesLeft: "{h} sa {m} dk kaldı",
  timeRange: "{start} - {end}",

  // --- Money ---
  currency: "₺",
  currencyName: "TL",
  free: "Ücretsiz",
  priceFrom: "{price} üzeri",

  // --- Legal / footer ---
  termsOfService: "Kullanım Koşulları",
  privacyPolicy: "Gizlilik Politikası",
  cookiePolicy: "Çerez Politikası",
  contact: "İletişim",
  about: "Hakkımızda",
  help: "Yardım",
  faq: "Sıkça Sorulanlar",

  // --- Misc ---
  copied: "Kopyalandı",
  moreOptions: "Diğer seçenekler",
  viewDetails: "Detayları Gör",
  learnMore: "Daha fazla bilgi",
  selectPlaceholder: "Seç",
  pickOne: "Birini seç",
  selected: "seçili",

  // --- Pagination ---
  page: "Sayfa",
  of: "/",
  perPage: "Sayfa başına",
  goToPage: "Sayfaya git",
} as const;