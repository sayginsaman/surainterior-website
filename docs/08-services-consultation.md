# 08 · Services ve Design Consultation sayfaları (2026-11-07)

Kullanıcı iki referans görsel gönderdi:
1. Navbar'daki "Services" ayrı bir sayfaya gitsin, görseldeki düzende: büyük
   görselli hero ("Our Services / From concept to completion"), tanıtım
   metni + görsel, 6 hizmet kartı ("Learn more"), "Every great project begins
   with a conversation" CTA şeridi.
2. Bir "Design Consultation" sayfası: danışmanlığın ne olduğu, "What to
   expect" (4 madde, küçük görselli), iletişim bilgileri ve talep formu.

## `/services` (`app/services/page.tsx`)

- Hero: Biscayne 9-1'den 16:9 gerçek bant (`public/work/_bands/biscayne.jpg`).
- Tanıtım görseli: Biscayne kuvars + yivli meşe detayı (gerçek).
- 6 kart (`lib/content.ts` → `serviceCards`). Görseldeki başlıklar Sura'nın
  gerçek hizmetlerine uyarlandı. "Commercial/hospitality", "Remodeling" ve
  "Installation" gibi iddialar kullanılmadı, çünkü PDF'e göre stüdyo
  tasarlıyor, spesifiye ediyor ve koordine ediyor; inşaatı ve kurulumu
  lisanslı profesyoneller yapıyor:
  Full-Service Interior Design · Kitchen, Bath & Custom Cabinetry · Custom
  Furniture & Millwork · Space Planning & Design Development · Renovation Design
  & Coordination · Furnishing, Lighting & FF&E.
- "Learn more" aynı sayfadaki detay bölümüne gidiyor. Her bölümde görsel, PDF'teki
  hizmet maddeleri ve "Outcome" cümlesi var.
- Space Planning kartı, gerçek karşılığı olmadığı için Higgsfield ile üretilmiş
  bir stüdyo görseli kullanıyor (plan, rulo çizim, numune; insan yok).
- CTA şeridi: Fort Lauderdale bandı. "Book a consultation" `/consultation`'a,
  "Send an inquiry" ana sayfadaki forma gidiyor.

## `/consultation` (`app/consultation/page.tsx`)

- Hero: "A thoughtful first step." + Higgsfield stüdyo masası görseli (insan
  yok; referanstaki gibi bir kişi kullanılmadı, Sura Hanım'mış gibi
  algılanmasın diye).
- Tanıtım metni + "With Sura Kilic, PhD in Interior Architecture, 20+ years".
- What to expect: 4 adım, Higgsfield ile üretilmiş kare görseller
  (`public/media/studio/expect-*.jpg`).
- Good to have on hand + Format ("At your home in South Florida, or online by
  video. We'll confirm the time, length and any consultation fee…").
  **Sura Hanım'a teyit ettirilmeli:** yerinde ziyaret / online seçeneği,
  ücret, süre.
- Talep formu: `ContactForm kind="consultation"`. Ek alanlar: görüşme şekli
  (At my home / Online video call / Not sure yet), uygun zamanlar (Weekday
  mornings/afternoons/evenings, Saturdays). Hizmet seçimi bu formda zorunlu
  değil. API aynı (`/api/contact`), e-posta konusu "Consultation request: …".

## Bağlantılar

- Navbar "Services" → `/services` (aktif sayfa altı çizili). Header CTA "Book a
  consultation" → `/consultation`. Mobil menüye "Consultation" eklendi.
- Ana sayfa hero CTA'sı, sahne finali, proje sayfaları ve footer
  `/consultation`'a gidiyor. Ana sayfadaki hizmetler bölümünün altına
  "Explore all services" ve "Book a design consultation" linkleri eklendi.
- Sitemap'e iki sayfa eklendi.

## Higgsfield

`nano_banana_pro`, 6 görsel (danışmanlık hero 16:9, 4 adım 1:1, space planning
4:3), ~12 kredi. Hepsi insansız, atmosfer görseli. Hiçbiri proje olarak etiketlenmedi.
