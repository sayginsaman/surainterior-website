# 10 · Telefon ve tablet geçişi (2026-11-08)

Kullanıcı: "Çok iyi bir mobil responsive tasarım yap ve doğrudan prod'a gönder."

Tüm sayfalar 360, 390, 768 genişlikte ve yatay telefonda (844×390) puppeteer
ile denetlendi: yatay taşma, 44 px altı dokunma alanları, 10.5 px altı yazı.
Taşma hiçbir sayfada yoktu; sorunlar dokunma alanı, küçük yazı ve uzunluktu.

## Değişenler

- **Menü:** Altta boş kalan yarıya "Book a consultation" (tam genişlik),
  telefon ve e-posta (46 px yükseklik) ve şehir geldi. Kısa ekranlarda
  (≤720 px yükseklik) menü yazıları küçülüyor, menü kendi içinde kayıyor.
  Telefon/e-posta için `site` nesnesi `lib/site.ts`'e taşındı; header client
  bileşeni proje verisini paketine almadan kullanabiliyor.
- **Dokunma alanları:** Text link'ler ve iletişim satırları görünüşü
  değişmeden `::after` ile ~50 px'e büyüdü; footer linkleri 45 px; onay
  kutusu 17 → 22 px.
- **Küçük yazılar:** Form etiketleri, fact etiketleri, kart alt yazıları,
  görsel altyazıları ≥ 10.5 px.
- **Uzun serif paragraflar:** Proje özeti, danışmanlık girişi ve kurucu
  girişi telefonda 1.3–1.5rem (önce 1.8–2.9rem, 9–10 satır).
- **"Design · Plan · Specify · Coordinate":** tek satır, nokta satır sonunda
  asılı kalmıyor.
- **Swipe rail'ler:** Ana sayfadaki 8 proje ve services sayfasındaki 6 kart
  telefonda yatay, scroll-snap'li rail. Bir sonraki kart %20 görünüyor.
  Ana sayfa 16.3k → 12.1k px, services 13.9k → 11.7k px.
- **Butonlar:** ≤560 px'de `cta-row` butonları tam genişlik, alt alta.
- **Tablet (761–1100 px):** Selected work iki eşit sütun, hafif kaydırmalı
  (önceden masaüstünün 12 sütunlu düzeni dar kartlar ve boşluk bırakıyordu).
- **Açılış sahnesi:** Telefonda film-saniyesi başına 30svh → 24svh; sahne
  ~40 → ~32 ekran. Yatay telefonda hero ve metinler kısa ekrana sığıyor
  (lede ve beat metni gizli, başlıklar küçük, butonlar yan yana).
