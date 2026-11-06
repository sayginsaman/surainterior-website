# 03 · Referans site analizi: tinyvilla.peachworlds.com

İnceleme tarihi: 2026-11-06. Yöntem: HTML, CSS, `ui-state.json`, `pageVs.json`
ve iki sahne JSON'u (desktop + mobile) indirilip ayrıştırıldı. Site gerçek GPU'lu
bir tarayıcıda (gstack `$B connect`, 1440×900 ve 390×844) her scroll
noktasında ekran görüntüsüyle gezildi.

Ekran görüntüleri:
- `docs/reference/tinyvilla/sheet_scroll_1.jpg`: %0, 5, 10, 15, 20, 30
- `docs/reference/tinyvilla/sheet_scroll_2.jpg`: %40, 44, 47, 55, 65, 72
- `docs/reference/tinyvilla/sheet_scroll_3.jpg`: %76, 80, 84, 92, 100
- `docs/reference/tinyvilla/sheet_mobile.jpg`: mobil %0, 30, 55, 80, 100
- `docs/reference/tinyvilla/og-image.webp`: sitenin paylaşım görseli

(Yüzdeler sayfanın kaydırılabilir yüksekliğine göre.)

---

## 1 · Ne bu site?

**PeachWeb Builder** (Peachworlds) adlı no-code 3D site aracının demo şablonu.
"Tiny Villa" adlı hayali bir prefabrik ev markası. 3D model Sketchfab'den
(RenderRite), içerideki fotoğraflar ChatGPT ile üretilmiş görseller
(`chatgpt-image-3-apr-2025-*.webp`). Son güncelleme 16 Mayıs 2025, Cloudflare
üzerinden servis ediliyor.

Yani taklit edeceğimiz şey bir **teknik ve görsel kalıp**: sabit 3D sahne +
üstünden akan HTML bölümleri + scroll'a bağlı kamera koreografisi. Fikir
kopyası değil.

## 2 · Mimari: nasıl çalışıyor?

```
<body>
 ├─ #i5yf  position:fixed; inset:0; z-index:-1      ← tek WebGL <canvas> (tam ekran, hep arkada)
 ├─ #i0u7oc position:fixed; z-index:999999          ← header: logo + "Contact Us"
 ├─ #izl83  position:fixed                           ← hero başlığı (scroll ile fade-out)
 ├─ section, pwb-anchor, section, pwb-anchor, ...    ← normal akışta HTML bölümleri
 └─ #pwb-loading-wrap                                ← siyah yükleme ekranı + slogan
```

- **Canvas tam ekran ve sabit.** HTML bölümleri normal belge akışında üstünden
  geçiyor. Bazı bölümler şeffaf (3D görünüyor), bazıları dolu beyaz (3D'yi örtüyor).
- **Animasyon motoru: Theatre.js.** Sahne JSON'unda
  `sheetsById → sequence { type: "PositionalSequence", unitType: "percentage" }`
  ve bezier handle'lı `BasicKeyframedTrack`'ler var. Timeline 0–100 aralığında.
- **Scroll ile timeline arasındaki bağ "anchor"lar.** DOM'a sıfır yükseklikli
  `div.pwb-anchor` elemanları serpiştirilmiş. Her biri timeline'da bir yüzdeye
  sabitlenmiş (`ui-state.json → anchors`). Scroll, iki anchor arasında doğrusal
  enterpolasyonla timeline'ı ilerletiyor. Sonuç: **kamera hareketi belirli
  içerik bölümlerine kilitli**, bölüm yükseklikleri değişse bile senkron bozulmuyor.
  Bizim için en önemli fikir bu.
- **Renderer: Three.js** (konsol hatası `THREE.WebGLRenderer` diyor) +
  `postprocessing` efekt zinciri. GLB **Draco** ile sıkıştırılmış
  (`draco_decoder.wasm`).
- **Cihaza göre ayrı sahne:** Desktop ve mobil için iki ayrı scene-state JSON'u
  var. Mobilde farklı kamera (`Mobile Cam2`, fov 20) ve ayrı keyframe'ler kullanılıyor.
- **Scroll tipi:** desktop `smooth` (1200 ms easing, Lenis benzeri), mobil `native`.
- **Görünmez kaydırma çubuğu:** `*{scrollbar-width:none}` ile tamamen gizlenmiş.

## 3 · Bölüm akışı ve kamera koreografisi (desktop)

Sayfa yüksekliği **11.821 px** (1440×900'de ~13 ekran). Mobilde 11.209 px.

Anchor tablosu (DOM sırasıyla). Sağ sütun o bölüm boyunca kameranın ne yaptığını
anlatıyor. Kamera bir **"Cam Group" rig'i** içinde. Rig modelin etrafında
dönüyor, yükseliyor ve alçalıyor; kamera rig'e göre sadece eğiliyor.

| Timeline % | Bölüm (HTML) | Ekranda | Kamera (Cam Group) |
|---|---|---|---|
| 0 (sabit) | **Hero** (110dvh, şeffaf, ilk anchor'dan önce) | "Modern Living in Tiny Villa®" + "Order Now", alt satır "Cute. Sustainable. Modular." | Yerden yan bakış (rotY −90°), hareketsiz |
| 0 → 9.9 | **About** (150dvh, şeffaf) | "About" + paragraf, sol üst | Hafif dönüş (−53°) ve geri çekilme, model sağa kayıyor |
| 9.9 → 11 | **Görsel bandı** (beyaz) | Full-bleed renkli fotoğraf + dev "Completely Modular and Customizable" | 3D örtülüyor, kamera neredeyse durağan |
| 9.9 → 11 | **Key Features** (beyaz) | Başlık + kısa metin + büyük görsel | — |
| 9.9 → 11 | **3'lü kart grid** (beyaz) | Yatak odası / banyo / mutfak görselleri + birer cümle | — |
| 11 → 20 | **Stats** (şeffaf) | "50% Less Water Use · 60-90 kWh · 90% Renewable" | Kamera uzaklaşıyor (z 6 → 15.7), rotY −35° |
| 20 → 39.5 | **Sustainable / Off Grid** (şeffaf, iki ekran) | Kısa başlık + paragraf | **Modelin öbür tarafına orbit** (x −10.7 → +9.1, rotY +45°) |
| 39.5 → 40 | **"Big Ideas in a Small Footprint"** | Full-bleed renkli fotoğraf (gece, havuz) | 3D örtülüyor |
| 40 → 47.5 | (boş "video" bölümü) | Sadece 3D | **Kamera dikine yükseliyor (y 0.6 → 54.5) ve aşağı bakıyor (rotX −90°)** |
| 47.5 → 64.7 | **Prices** (150vh) | "Prices from $59,999", siyah "25–50 m²" kartı, gri "6–8 weeks" kartı | **Kuşbakışı plan görünümü**, y 54 → 24'e alçalarak yakınlaşma |
| 64.7 → 76.4 | **Testimonial** | Ortalanmış alıntı | Yere iniyor, arka tarafa dönüyor (rotY ~200°) |
| 76.4 → 80 | **CTA** | "Where Tiny Meets Magical" + "Order Now" | Final yan açı |
| 80 → 84 | **Footer** (şeffaf) | "Discover the Beauty of Living Small!", telefon, e-posta, Insta / X / Contact | rotY 234°, toplam **~325° orbit** tamamlanıyor |

Kamera fov değeri desktop'ta **18°**. Bu dar açı, telefoto ve "maket fotoğrafı"
hissini veriyor. Perspektif az ve sakin.

## 4 · Görsel dil

- **Tek renkli "kil maket" 3D.** Sahne arka planı `#ffe5e5` ama post-processing'de
  **HueSaturation: saturation −1**. Yani tüm 3D sahne tamamen gri tonlu. Model,
  ağaçlar ve zemin beyaz/gri bir mimari maket gibi görünüyor.
- **Renk sadece fotoğraflarda.** Tam renkli fotoğraf bantları gri dünyanın
  içinden "patlıyor". Maket ile gerçek arasındaki kontrast tasarımın asıl gücü.
  Sura için bu kontrast doğrudan **"konsept (maket) → bitmiş iş (fotoğraf)"**
  hikayesi anlamına geliyor.
- **Post-processing zinciri** (desktop):
  - SSAO (intensity 8.89, radius 0.1): köşelerde yumuşak temas gölgesi, maket hissinin anahtarı
  - Bloom (intensity 0.5, threshold 0.77)
  - Noise (opacity 0.15): ince film grain
  - Tone mapping mode 7 (pmndrs `postprocessing` enum'unda ACES Filmic)
  - SMAA anti-aliasing
  - DOF, Vignette, Pixelation kapalı
- **Işık:** Spot light (intensity 5, gölge 512 px, penumbra 0.52) + directional
  (0.7) + HDRI ortam ışığı (`studio_small_08_2k.hdr`). Sis açık.
- **Malzemeler:** Cam için `transmission: 1` + düşük opaklık. Hafif metal.
  Yarı saydam çim. Alpha-test'li low-poly çam ağaçları.
- **Otomatik çözünürlük düşürme:** FPS 60'ın altına inince render çözünürlüğü
  azalıyor (`autoResolutionSettings`).
- **Tipografi:** "Inter Tight Light" ağırlıklı. Dev başlıklar (`8dvw`,
  line-height `0.8em`, desktop'ta letter-spacing `-3px`). Butonlar Inter 16px.
  Abhaya Libre ve Futura yükleniyor ama neredeyse hiç görünmüyor (gereksiz yük).
- **Butonlar:** Siyah dikdörtgen, beyaz metin ve sağda kare ok ikonu ("Order
  Now ↗"). Köşe radius'u 0.
- **Layout:** Desktop'ta başlıklar sol kenarda (`5dvw` padding), 3D sağda.
  Mobilde başlık alta iniyor, model üstte.
- **Mikro animasyonlar** (`ui-state.json → scrollAnimations`): Hero başlığı
  bölüm sonunda fade-out. About ±30 px kayarak fade in/out. Görsel kartları
  ekran ortasına gelirken `scale 0.9 → 1`. Stats fade.
- **Yükleme ekranı:** Siyah zemin, dönen noktalı daire loader, beyaz logo ve
  slogan ("Your perfect escape, made smarter.").

## 5 · Performans

| Kalem | Değer |
|---|---|
| Villa GLB (Draco) | 569.5 KB |
| Çam ağacı GLB | küçük, 2 kopya |
| HDRI | 2k `.hdr` |
| En büyük JS chunk (`240.script.js`, engine) | 372 KB (transfer) |
| Sahne JSON | ~58 KB (11 KB sıkıştırılmış) |
| `DOMContentLoaded` | ~0.3 s |
| `load` olayı | ~5.3 s (yükleme ekranı bu süre boyunca açık) |

Yük hafif. Asıl maliyet GPU tarafında (SSAO + bloom + gölgeler).

## 6 · Zayıf noktalar (bizim yapmayacaklarımız)

1. **WebGL yoksa site tamamen çöküyor.** Headless tarayıcıda WebGL açılamadığında
   sayfa yüksekliği 900 px'e düştü ve hiçbir içerik kaydırılamadı. Bizde içerik
   WebGL'den bağımsız render olmalı, 3D sadece ek katman olmalı.
2. **İletişim formu yok.** "Contact Us" ve iki "Order Now" butonu da `#intro`
   bölümüne kaydırıyor. Footer'da sadece sahte telefon ve e-posta var.
3. **Semantik HTML yok.** Her şey `div`. `h1` ve `h2` yok, görsellerde `alt` yok,
   linkler `div`. Erişilebilirlik ve SEO zayıf.
4. **Kaydırma çubuğu gizli.** Kullanıcı sayfanın ne kadar uzun olduğunu görmüyor.
   Bunun yerine bir ilerleme göstergesi koymak gerekir.
5. **Gri üstüne gri metin.** Bazı bölümlerde kontrast düşük (Stats alt
   başlıkları, testimonial).
6. **Ölü bölgeler.** "video" adlı bölüm boş. Testimonial ekranının çoğu boş gri.
   Kamera yükselirken anlatılan hiçbir şey yok.
7. **Tutarsız görseller.** AI fotoğraflarındaki ev siyah kaplamalı, 3D model
   beyaz. Bizde gerçek proje fotoğrafları var, bu tutarsızlık olmayacak.
8. **Konsol hataları:** 401, 404 ve "Node with label mouse_event does not exist"
   (görsel scripting modülü hatası).
9. **`prefers-reduced-motion` desteği görünmüyor.**

## 7 · Alacağımız fikirler (önem sırasıyla)

1. **Sabit canvas + üstünden akan HTML.** İçerik gerçek DOM'da, 3D arkada.
2. **Anchor tabanlı senkron.** Kamera keyframe'leri piksel değil bölüm sınırlarına
   bağlı. Bizde: her `<section>`'a `data-cam="..."` ve ScrollTrigger veya
   Theatre.js ile aynı mantık.
3. **Maket ile fotoğraf kontrastı.** Gri, kil gibi bir 3D sahne ve tam renkli
   gerçek proje fotoğrafları. Sura'nın "Render-to-Install" kanıtının görsel karşılığı.
4. **Kuşbakışı "plan" anı.** Kamera tepeye çıkıp aşağı bakıyor ve model bir kat
   planına dönüşüyor. İç mimar için birebir: AutoCAD planı → hacim.
5. **Dar fov (18–20°), yavaş orbit,** SSAO ile yumuşak gölge ve hafif grain.
6. **Dev, sıkı satır aralıklı başlıklar.** Az kelime, büyük tipografi. Minimal
   sabit header ve tek CTA.
7. **Cihaza özel kamera yolu.** Mobilde kadraj farklı (model üstte, metin altta).
8. **Yükleme ekranında slogan.** Bizde: "Thoughtful Design. Exceptional Living."

## 8 · Sura'ya çeviri: bölüm eşleştirmesi

| Tiny Villa | Sura Interior karşılığı |
|---|---|
| Hero: "Modern Living in Tiny Villa®" + Order Now | **"Thoughtful Design. Exceptional Living."** + "Book a Consultation" |
| About | Stüdyo tanıtımı + kurucu (PhD, 20+ yıl) |
| Full-bleed görsel bandı | En güçlü proje fotoğrafı (Pembroke Pines / Fort Lauderdale mutfak) |
| Key Features + 3'lü kart | **5 hizmet sütunu** (kart veya yatay kaydırma) |
| Stats (50% / 60–90 kWh / 90%) | "20+ years · PhD · 11 US projects · 5 disciplines" (rakamlar teyitli olmalı) |
| Sustainable / Off Grid | Farklılaştırıcılar ("Design that considers fabrication" vb.) |
| Kuşbakışı + Prices | **Plan → hacim dönüşümü** + Render-to-Install üçlüsü (fiyat yok) |
| Testimonial | Müşteri yorumu (henüz yok, Google review gelince) |
| CTA "Where Tiny Meets Magical" | "Let's design your space" + **gerçek contact formu** |
| Footer | Telefon, e-posta, hizmet bölgesi, Instagram |

Detaylı konsept ve teknik seçenekler: `04-concept-and-build-plan.md`.
