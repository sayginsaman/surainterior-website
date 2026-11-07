# 05 · Build notları (site yapıldı, 2026-11-07)

Kullanıcı fotoğrafları ve logoyu gönderdi, Sura Hanım'dan yayın izni alındı ve
"başla" dedi. Site `04`'teki plana (Hibrit C) göre kuruldu.

## Çalıştırma

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
npm run photos         # ham fotoğraflardan public/work/ ve lib/work-manifest.json üretir
node scripts/make-og.mjs   # public/og.jpg
```

Form e-postası için `.env.example` dosyasına bak (`RESEND_API_KEY`,
`CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`). Key yoksa dev ortamı başvuruyu
konsola yazar, production 503 döner ve stüdyonun e-posta adresini gösterir.

## Mimari

| Parça | Dosya | Not |
|---|---|---|
| İçerik (hizmetler, süreç, projeler, iletişim) | `lib/content.ts` | Tek kaynak. Proje görselleri `lib/work-manifest.json`'dan gelir. |
| Kamera / sahne keyframe'leri | `lib/timeline.ts` | Her `<section data-key>` bir anchor. Değer, bölümün üstü ekranın üstüne geldiğinde tam olur. |
| Kil maket | `components/scene/Maquette.tsx` | Prosedürel geometri, metre cinsinden. Oda x ∈ [-6, 6], z ∈ [-4, 4]. |
| Kamera rig'i | `components/scene/Rig.tsx` | Hedef etrafında küresel koordinatla interpolasyon, timeline'ı damp eder (kamerayı değil). Dikey ekranda otomatik geri çekilir. `?pose=<id>` kamerayı bir keyframe'e kilitler. |
| Canvas, ışık, efektler | `components/scene/Stage.tsx` | N8AO + Bloom + SMAA + AgX + Vignette + Noise. Opak bölüm veya video ekranı kaplayınca render durur. |
| Reveal klibi | `components/RevealVideo.tsx` | `materials` → `proof` arasında scroll ile scrub edilir. |
| WebGL yok / reduced motion | `components/Experience.tsx` | `public/media/posters/<id>.jpg` statik kareleri bölüme göre değişir. `?poster` ile zorla test edilir. |
| Form | `components/ContactForm.tsx`, `app/api/contact/route.ts`, `lib/inquiry.ts` | Sunucu doğrulaması, honeypot, en az 2.5 sn süre kontrolü, IP başına rate limit, UTM ve landing page kaydı, Resend ile e-posta + müşteriye otomatik yanıt. |
| Proje sayfaları | `app/work/[slug]/page.tsx` | 11 sayfa statik üretilir. |

## Fotoğraflar

- Ham klasörler (`assets/<müşteri adı>/`) **gitignore'da**. Klasör adları müşteri
  isimleri ve repo public. Eşleme `scripts/photo-sources.local.json` içinde
  (o da gitignore'da).
- Büyük PNG'ler (3584×4800) PDF görsellerinin **4× upscale edilmiş** halleri
  (896×1200 × 4). Detay temiz, yine de gerçek orijinal değil.
- Web kopyaları: uzun kenar 2200 px, mozjpeg q82, siyah letterbox kenarları
  otomatik kırpıldı. Toplam ~17 MB. `next/image` AVIF/WebP üretir.
- Spiral merdiven kapak görseli kullanılmadı (sahipliği belli değil).

## Higgsfield üretimleri (toplam ~100 kredi)

| Ne | Model | Sonuç |
|---|---|---|
| Kil karesi (P pozu, 1920×1080) | Kendi canvas'ımız, `?pose=materials` | Videonun ilk karesi |
| Bitiş karesi (2 varyant) | `nano_banana_pro`, 2k, 16:9, kil karesi referans | 4 kredi. B seçildi: A sağ duvara olmayan bir pencere eklemişti. |
| Geçiş klibi | `seedance_2_0`, 8 sn, 1080p, start + end image, ses yok, sabit kamera | 96 kredi. Malzemeler sırayla akıyor, kamera kıpırdamıyor. |

Encode (`public/media/`):
- `reveal-desktop.mp4`: 1920×1080, CRF 20, GOP 8, B-frame yok, faststart, 4.4 MB
- `reveal-mobile.mp4`: 608×1080 orta kırpım (9:16), CRF 23, GOP 4, 1.6 MB
- `reveal-poster.jpg`: encode edilmiş klibin ilk karesi
- `reveal-end.jpg`: bitiş karesi (reduced motion için)

Kil karesi ile videonun ilk karesi arasındaki ortalama fark 8/255. 300 ms'lik
geçiş bunu gizliyor. Karartma (scrim) ve metin, scroll ilerlemesine göre açılır,
böylece devir anında video karesi dokunulmamış görünür.

**Önemli:** Maketin malzemesini, ışığını veya P pozunu değiştirirsen dikiş
kayar. O zaman `?pose=materials` ile kil karesini yeniden render et ve klibi
yeniden üret (veya en azından ilk kareyi kontrol et).

Mobil neden aynı klip: Three.js dikey FOV'u sabit tutar. Dikey ekranda canvas,
16:9 karenin orta şeridini gösterir. `object-fit: cover` video da aynı şeridi
gösterir. 16:9'dan geniş ekranlarda Rig FOV'u daraltarak aynı kırpımı yapar.

## Marka

- Kullanıcı 2026-11-07'de logo görselini gönderdi: halka işareti (siyah +
  taupe), "SURA INTERIOR LLC", tagline **"Beyond design. Into detail."**,
  descriptor "Interior Architecture · Custom Millwork · Kitchen & Bath ·
  Renovation Coordination".
- İşaret görselden **SVG olarak yeniden çizildi** (`components/Logo.tsx`,
  `app/icon.svg`). Orijinal vektör (AI/SVG/PDF) gelirse değiştirilmeli.
- Palet: krem `#F9F5EF`, ink `#141210`, taupe `#C9B9A7` (metin vurgusu için
  koyu taupe `#85725F`), LED `#F0B46A`. Renkler görselden göz kararı alındı.
- Fontlar: Instrument Serif (başlık), Inter Tight (metin), IBM Plex Mono
  (teknik etiketler), Encode Sans Condensed Light (wordmark, logodaki harflere yakın).

## Bilinen eksikler / sıradakiler

1. **Form e-posta servisi:** Resend hesabı + domain doğrulaması gerekli. Domain belli değil.
2. **Hosting / domain:** Vercel önerilir. Henüz deploy yok, GitHub'a push yok.
3. **Logo vektörü:** SVG yeniden çizim. Orijinal dosya istenmeli.
4. **Kurucu portresi:** Yok. About bölümü şu an tipografik.
5. **"Interior Architecture" ifadesi:** Logodaki descriptor'da ve PhD derecesinde
   geçiyor. Florida'da "architect" unvanı korumalı (`01`). Unvan olarak
   kullanılmıyor ama yayından önce avukata sorulmalı.
6. **Bütçe alanı formda yok.** Aralıkları Sura Hanım onaylarsa eklenebilir.
7. **Turnstile:** Spam artarsa eklenebilir (şu an honeypot + süre + rate limit).
8. **Video projesi:** Ham mutfak videosu kullanılmadı (titrek, dikey, 720p).
9. **Testimonial, Instagram, Google Business linkleri:** Yok.
10. `THREE.Clock deprecated` uyarısı R3F'in içinden geliyor, bizim koddan değil.
