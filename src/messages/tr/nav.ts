/**
 * Top-level navigation labels.
 * Section-specific nav (hotel sidebar, admin sidebar) lives in
 * its own module file under tr.hotel.nav / tr.admin.nav.
 */
export const nav = {
  // Public / customer
  home: "Anasayfa",
  explore: "Keşfet",
  orders: "Siparişlerim",
  favorites: "Favorilerim",
  profile: "Hesabım",
  notifications: "Bildirimler",
  cart: "Sepet",

  // Auth
  login: "Giriş Yap",
  register: "Kayıt Ol",
  logout: "Çıkış Yap",

  // Cross-section entry points
  hotelPanel: "Otel Paneli",
  adminPanel: "Yönetim",

  // Help
  help: "Yardım",
  support: "Destek",
} as const;