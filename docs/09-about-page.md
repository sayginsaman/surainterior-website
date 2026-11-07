# 09 · About sayfası (2026-11-07)

Kullanıcı bir referans görsel gönderdi: navbar'daki "About" ayrı ve güzel bir
sayfaya gitsin. Görseldeki düzen: büyük görselli hero ("Thoughtful Design.
Purposeful Spaces."), "About SURA INTERIOR" metni + görsel, "Our Philosophy"
(3 görselli kart), "The Founder" bölümü.

## `/about` (`app/about/page.tsx`)

| Bölüm | İçerik | Görsel |
|---|---|---|
| Hero | "Thoughtful design. Purposeful spaces." | Yeni gerçek bant `lounge`: Fort Lauderdale 3-5'ten 16:9 kırpım (kavisli koltuklar + yivli ceviz ada), 2880×1620 |
| About SURA INTERIOR | Görseldeki üç paragraf, Sura'nın gerçek bilgileriyle; "Our philosophy" butonu aşağı kaydırıyor | Boca Raton, ışıklı vitrin raflar (gerçek) |
| Our philosophy | Experience · Design vision · Execution (`lib/content.ts` → `philosophy`) | Üçü de gerçek proje detayı: Pembroke taş + ceviz, Biscayne zeytin dalı natürmort, Boca LED'li dolap |
| The founder | Sura Kılıç, PhD in Interior Architecture; kısa biyografi, Education / Practice / Studio listesi; "Meet Sura in a consultation" → `/consultation` | Higgsfield natürmort (vazo, traverten konsol, yivli meşe). İnsan yok, portre değil, `aria-hidden` |
| What sets the studio apart | Mevcut 5 farklılaştırıcı; başlık masaüstünde sabit kalıyor | — |
| CTA şeridi | "Every great project begins with a conversation." → `/consultation`, `/services` | Pembroke bandı |

- Navbar "About" artık `/about`'a gidiyor; footer'a About linki, sitemap'e
  `/about` eklendi. Ana sayfadaki kısa kurucu bölümü duruyor, altına
  "More about the studio →" linki eklendi.
- Görseldeki "Execution: from concept to completion, with uncompromising
  quality" ifadesi, stüdyonun inşaat yapmadığı için "Drawings, specifications
  and coordination that carry each design from concept to the finished room"
  olarak yazıldı.
- Hero bandı `scripts/photo-sources.local.json` → `_bands.lounge` (y 0.58).
  `node scripts/process-photos.mjs` bantları yeniden üretir.
- Higgsfield: 1 istek, 2 varyant (`nano_banana_pro` 4:3 2K). Birincisi seçildi:
  `public/media/studio/founder-still.jpg` (2000×1493).

## Sura Hanım'a teyit ettirilecekler

- Kurucu biyografisindeki "design research and project management" ifadesi
  referans görselden alındı. Doğru olup olmadığını teyit etmeli.
- Kurucu portresi gelirse natürmort yerine portre konabilir.
