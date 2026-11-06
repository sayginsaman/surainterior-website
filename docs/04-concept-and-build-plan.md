# 04 · Konsept ve yapım planı (henüz build yok)

Bu doküman `01` (iş), `02` (portfolyo) ve `03` (referans analizi) üzerine kurulu.
Burada yazanlar **öneri**. "Karar" diye işaretli olmayan her şey build
başlamadan kullanıcıyla netleştirilecek (sonda açık sorular var).

---

## 1 · Ana fikir: "Plandan mekana" (Render-to-Install'ın scroll hali)

Tiny Villa'nın gücü gri maket 3D ile tam renkli fotoğraf arasındaki kontrast.
Sura için bu kontrast zaten iş modelinin kendisi: **konsept → teknik geliştirme
→ bitmiş kurulum.** Ziyaretçi aşağı kaydırdıkça bir mekan **plandan hacme,
hacimden malzemeye, malzemeden gerçek fotoğrafa** dönüşür.

### Scroll yolculuğu (taslak)

| # | Bölüm | 3D / medya | Metin (taslak, İngilizce) |
|---|---|---|---|
| 0 | Loader | Siyah zemin, ince çizgi animasyonu | *Thoughtful Design. Exceptional Living.* |
| 1 | **Hero** | Beyaz kil maket bir mutfak/salon hacmi, göz hizası, yavaş push-in | **Thoughtful Design. Exceptional Living.** · [Book a Consultation] |
| 2 | **Studio** | Yavaş orbit | PDF'teki site girişi paragrafı (`01`) |
| 3 | **Plan** | Kamera tepeye çıkar, aşağı bakar, maket bir **kat planı** gibi okunur (çizgiler, ölçü okları) | *Every space starts with a plan.* Space planning, AutoCAD, elevations |
| 4 | **Built to be built** | Kamera iner, duvarlar yükselir, dolap modülleri yerine kayar (exploded assembly) | *Design that considers fabrication.* |
| 5 | **Materials** | Renk akar: ceviz, meşe, kuvars ve imza detay olan **sıcak LED şerit ışığı** | *Materials, light, detail.* |
| 6 | **Reveal → Render-to-Install** | Son kare bitmiş mekan, ardından gerçek fotoğraflar. 3'lü "Concept · Development · Installed" bandı | Gerçek proje adı ve yılı |
| 7 | **Services** | Beyaz dolu bölüm, 3D örtülü | 5 sütun kartı (`01`), her birinde "outcome" cümlesi |
| 8 | **Selected Work** | Proje grid'i veya yatay kaydırma (sadece ABD) | 11 proje (`02`) |
| 9 | **Process** | İnce çizgi timeline | 6 adım (`01`) |
| 10 | **Founder** | Portre (yok, istenecek) | PhD, 20+ yıl, yaklaşım |
| 11 | **Contact** | 3D sakin kapanış hali (akşam ışığı, LED parıltısı) | Form (§5) + hizmet bölgesi |
| 12 | Footer | — | Telefon, e-posta, Instagram, "Serving South Florida" |

Tiny Villa'dan farklı olarak ölü bölge yok: kamera hareket ederken her zaman
ekranda okunan bir cümle olacak.

---

## 2 · 3D yaklaşımı: üç seçenek (KARAR GEREKİYOR)

### A · Higgsfield "scroll-scrub" filmi
Higgsfield'ın kendi animated-website yöntemi: tek, kesintisiz, ~15 sn'lik bir
film üretilir, scroll ile ileri-geri oynatılır (bölüm 1–6).
- ✅ Fotogerçekçi. Video üretimi Higgsfield'ın en güçlü olduğu alan. Çalışma
  anı hafif (sadece MP4 decode), mobilde iyi çalışır, WebGL bağımlılığı yok.
- ❌ Etkileşim yok (sadece scroll). Ekrandaki "3D" aslında video. Plan →
  hacim → malzeme gibi çok aşamalı bir dönüşümü tek planda tutturmak zor.
  Üretilen mekan gerçek bir proje değil. Byte bütçesi var (≤32 MB desktop,
  ≤16 MB mobil).

### B · Gerçek zamanlı 3D (Three.js / React Three Fiber): Tiny Villa'nın birebir tekniği
Sabit canvas, kil maket bir mutfak sahnesi, anchor'lara kilitli kamera rig'i,
kuşbakışı plan anı.
- ✅ Gerçek 3D, gerçek kuşbakışı plan. Kamera koreografisi tamamen bizde.
  Maket estetiği (beyaz kil + SSAO + yumuşak gölge) gerçek zamanlıda zaten
  çok iyi görünür. Her çözünürlükte keskin.
- ❌ Modelleme işi var (mimari hacimler prosedürel kutu/extrude ile ya da Blender
  MCP ile yapılabilir). Malzeme aşamasında fotogerçekçilik sınırlı. GPU yükü
  ve WebGL fallback'i gerekir.

### C · Hibrit (önerim)
B omurga olur. Higgsfield'ı gerçek zamanlının zayıf kaldığı yerlerde kullanırız:
1. **Malzeme reveal anı (bölüm 5–6):** Gerçek zamanlı sahneden tam o kamera
   açısıyla bir kare render edilir, `start_image` olarak videoya verilir. Video
   kil maketten fotogerçekçi bitmiş mekana kısa bir dönüşüm yapar. Canvas
   videoya çapraz geçişle devreder ("seam-locked" geçiş).
2. **Aksesuar GLB'leri:** sarkıt lamba, sandalye, vazo gibi objeler
   (Meshy 7 / Tripo H3.1 / Hunyuan3D v3, image-to-3D).
3. **Fotoğraf upscale** (orijinaller gelmezse) ve **OG/kapak görseli.**

Neden C: Tiny Villa hissini (gerçek 3D, orbit, plan anı) birebir verir. Higgsfield
sadece en zor anda devreye girer. WebGL yoksa poster görselleriyle tam içerik
yine okunur.

---

## 3 · Higgsfield: elimizde ne var?

- **Hesap:** Plus plan, **840.29 kredi** (2026-11-06). Her üretimden önce
  maliyet sorgula.
- **Video (scrub için uygun, `models_explore` önerisi):**
  - `seedance_2_5`: 4–30 sn, 1080p, 21:9/16:9/9:16, `start_image` /
    `end_image` / `image_references` / **`video_references`**, `generate_audio: false` verilebilir.
  - `seedance_2_0`: 4–15 sn, **4K'ya kadar**, start/end frame.
  - `minimax_h3`: 4–15 sn, 2K, start/end frame.
- **3D (GLB):** `meshy_v7_image_to_3d`, `tripo_h3_1_image_to_3d` /
  `multiview_to_3d`, `hunyuan3d_v3_image_to_3d`, `meshy_v6_text_to_3d`,
  `hunyuan3d_v3_1_text_to_3d`, retexture ve remesh. Bunlar tek obje için
  iyi, **bütün bir oda için değil.**
- **Diğer:** `generate_image`, `upscale_image` / `upscale_video`, `reframe`
  (16:9 ↔ 9:16), `/3d-jutsu` (3D sahne ve kamera açıları preset'i, henüz incelenmedi).
- **Higgsfield'ın kendi site barındırması** (`create_website`, Cloudflare Worker)
  **kullanılmayacak.** Kod bizim GitHub repomuzda yaşayacak. Higgsfield sadece
  asset üretimi için kullanılacak.

### Scrub filmi kuralları (Higgsfield `scroll-scrub.md`'den)
- Tek kesintisiz kamera hareketi. Kesme yok (scrub'da sıçrama olarak görünür).
- Tek ana konu, merkezde. Kenarlar `cover` ile kırpılabilir. Metin için boş alan bırak.
- Yavaş, sabit hız. Sabit pozlama ve beyaz dengesi, titreme yok, az motion blur.
- Başlangıç ve bitiş kareleri farklı ve ikisi de "güzel kare" olmalı.
- Videoda yazı, logo veya watermark yok. Tüm metin HTML'de.
- Önce **6 panelli tek storyboard görseli**, sonra video. Storyboard
  `start_image` olarak değil, referans olarak verilir.
- Encode: desktop H.264 CRF~20, **GOP 8**, scene-cut kapalı, ses yok,
  `faststart`. Mobil: en fazla 720p yükseklik, CRF~23, **GOP 4**. Poster
  **encode edilmiş klibin** ilk karesinden alınır.
- `prefers-reduced-motion`: sıfır video isteği, poster ile tam hikaye.

### Dürüstlük kuralı (KARAR ÖNERİSİ)
AI ile üretilen mekanlar **"konsept / atmosfer"** olarak kullanılır. Portfolyo
bölümünde sadece gerçek proje fotoğrafları olur. Üretilmiş bir görüntü hiçbir
zaman gerçek bir müşteri projesi gibi etiketlenmez. Markanın bütün argümanı
"kanıt" üzerine kurulu (`01`).

---

## 4 · Teknik yığın (öneri)

| Katman | Öneri | Neden |
|---|---|---|
| Framework | Next.js (App Router), SSR/SSG | Metin server-rendered (SEO), form için route handler. Kullanıcının önceki projelerinde tanıdık. |
| 3D | React Three Fiber + drei + `@react-three/postprocessing` | Tiny Villa ile aynı Three.js + postprocessing zinciri (SSAO, Bloom, Noise, ACES). |
| Scroll | Lenis (desktop smooth) + GSAP ScrollTrigger | Anchor mantığı: her `<section>` timeline'da bir aralık. Mobilde native scroll. |
| Kamera keyframe'leri | Kod içinde keyframe tablosu (veya Theatre.js) | Tiny Villa Theatre.js kullanıyor. Basit bir tablo yeterli olabilir. |
| Modeller | GLB + Draco/Meshopt, KTX2 dokular | Tiny Villa villası 570 KB. Hedef sahne başına < 2 MB. |
| Form | Server-side doğrulama + e-posta servisi + Turnstile/honeypot | §5 |
| Hosting | Vercel (GitHub → otomatik deploy) | Kullanıcının PeekNote sitesindeki akışla aynı. **Karar gerekiyor.** |

Zorunlu kalite kuralları (Tiny Villa'nın hatalarından):
- İçerik WebGL'siz de tam okunur. Canvas başarısız olursa poster görselleri gösterilir.
- Semantik HTML (`h1` tek, `h2` bölümler), tüm görsellerde `alt`, klavye ile gezilebilir CTA'lar.
- Kaydırma çubuğu gizlenmez. Bunun yerine ince bir ilerleme göstergesi olur.
- `prefers-reduced-motion` desteklenir (orbit yok, statik kareler).
- Metin kontrastı WCAG AA. 3D üstündeki metnin arkasına gerekirse yumuşak scrim.
- Otomatik çözünürlük düşürme (FPS < 50 → DPR düşür), mobilde daha hafif efekt zinciri.
- Konsolda hata yok.

---

## 5 · Contact formu (gereksinim)

Form, iş planındaki **Discovery Call**'un ön hazırlığı. Alanlar oradaki sorulardan
türetildi (hedefler, mülk, zaman, öncelikler, yaklaşık bütçe).

| Alan | Tip | Zorunlu |
|---|---|---|
| Full name | text | ✔ |
| Email | email | ✔ |
| Phone | tel (US) | — |
| Preferred contact | email / phone / text | — |
| Project location | select: Boca Raton, Delray Beach, Boynton Beach, Other Palm Beach County, Broward, Miami-Dade, Other | ✔ |
| Property type | Condo / Single-family home / New construction / Other | — |
| Services of interest | çoklu seçim: 5 hizmet sütunu | ✔ |
| Project stage | Just exploring / Buying a home / Planning a renovation / Under construction | — |
| Timeline | ASAP / 1–3 months / 3–6 months / 6+ months | — |
| Approximate budget | aralıklar (**Sura onaylamalı**) | — |
| Tell us about your space | textarea | ✔ |
| How did you hear about us? | Google / Instagram / Referral / Realtor / Contractor / Other | — |
| Gizli: UTM source/medium/campaign, landing page | hidden | otomatik |
| Consent (privacy) | checkbox | ✔ |

UTM alanları önemli: iş planı reklam testinde inquiry → consultation → proposal →
signed oranlarını ölçmeyi istiyor.

Davranış:
- Sunucu tarafı doğrulama (istemci doğrulaması sadece kolaylık için).
- Spam koruması: honeypot + Cloudflare Turnstile + IP başına rate limit.
- Gönderim Sura'ya e-posta, müşteriye otomatik "we received your inquiry" yanıtı.
- Kişisel veri URL'ye asla yazılmaz. Başarı ve hata durumları erişilebilir (`aria-live`).
- Opsiyonel: proje fotoğrafı veya plan yükleme (sonraki aşama, boyut limiti ve
  virüs/uzantı kontrolü gerekir).
- **Açık:** gönderimler hangi adrese gidecek, veritabanına da kaydedilecek mi
  (ör. Supabase), hangi e-posta servisi.

---

## 6 · Tasarım tokenları (başlangıç önerisi)

Renkler gerçek proje fotoğraflarından örneklendi (`02`):

| Token | Hex | Kullanım |
|---|---|---|
| `--clay` | `#F2F0EC` | 3D maket ve sayfa zemini (sıcak beyaz) |
| `--stone` | `#CBC1BA` | Kuvars, ikincil yüzey |
| `--oak` | `#7E5D4A` | Vurgu |
| `--walnut` | `#3F2D26` | Koyu yüzey ve metin alternatifi |
| `--ink` | `#1A1714` | Ana metin, siyah butonlar (Tiny Villa'daki siyah CTA) |
| `--glow` | `#F0B46A` | LED şerit ışığı. Sadece ışık efekti ve odak halkasında, çok az |

Tipografi: Tiny Villa'daki gibi dev, sıkı satır aralıklı başlıklar (line-height
~0.85). Markanın "refined, thoughtful" kişiliği için başlıkta çağdaş bir serif,
metinde temiz bir grotesk. Font seçimi tasarım aşamasında yapılacak.

---

## 7 · Açık sorular (build öncesi)

**Kullanıcıya / Sura Hanım'a sorulacaklar:**
1. Logo veya marka dosyası var mı?
2. Fotoğrafların **orijinal yüksek çözünürlüklü** halleri gönderilebilir mi?
3. En az 2–3 proje için **render + teknik çizim** (Render-to-Install üçlüsü) var mı?
4. Kapaktaki **spiral merdiven** Sura Hanım'ın projesi mi?
5. Mutfak videosu hangi proje (Biscayne Boulevard mı)?
6. Her proje için müşterinin **yayın izni** var mı?
7. Türkiye deneyimi biyografide **yazı olarak** geçsin mi? (Görseller zaten kullanılmayacak.)
8. "Architect" / "Interior Architecture" ifadeleri: avukat teyidi alındı mı? (`01`)
9. Sokak adresi sitede yayınlanacak mı, yoksa sadece "Boca Raton, FL" mi? (Öneri: sadece şehir.)
10. Fiyat gösterilecek mi? (Öneri: hayır, en fazla "consultations from".)
11. Domain adı ve kurumsal e-posta? Form gönderimleri nereye gidecek?
12. Dil: sadece İngilizce mi? (Güney Florida için İspanyolca değerli olabilir.)
13. Instagram ve Google Business Profile linkleri, müşteri yorumları, kurucu portresi.

**Teknik kararlar (bizim):**
14. 3D yaklaşımı: A, B veya **C (öneri)**.
15. Hosting: Vercel mi?
16. Framework: Next.js mi?

---

## 8 · Sonraki adımlar (onaydan sonra)

1. Açık soruları kapat (özellikle 1–6 ve 14).
2. Moodboard ve stil karesi: kil maket görünümü + bir malzeme reveal karesi
   (Higgsfield `generate_image`, ucuz). Bunları onaylat.
3. Scroll yolculuğunun storyboard'u (6 panel). Kamera keyframe tablosunu bölümlere bağla.
4. Proje iskeleti, içerik ve SEO katmanı (3D'siz tam site).
5. 3D sahne ve kamera rig'i, sonra post-processing, sonra Higgsfield reveal klibi.
6. Contact formu ve e-posta akışı.
7. Performans, erişilebilirlik ve mobil turu. Ardından deploy.
