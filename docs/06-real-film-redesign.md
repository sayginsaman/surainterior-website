# 06 · Gerçek fotoğraflardan film (yeniden tasarım, 2026-11-07)

Kullanıcı ilk sürümü inceledi: kil maket / 3D render görünümünü "fake" buldu.
İstekleri:
- Gerçek fotoğraflar kullanılsın, Higgsfield ile video üretilip scroll animasyonunda oynatılsın.
- Düşük çözünürlüklü fotoğraflar kullanılmasın.
- Tipografi ve fontlar daha profesyonel ve şık olsun.

`05`'teki Hibrit C mimarisi (R3F maket, seam-locked reveal) **kaldırıldı**.
`05` tarihsel not olarak duruyor.

## Yeni açılış: "Film"

`components/Film.tsx` · veri `lib/content.ts` → `film`

- Sayfanın başında yapışkan bir sahne var. Bölümde ilerledikçe sıradaki klip
  scroll ile kare kare oynatılıyor ve soldaki metin değişiyor. Önce hero metni
  (h1), sonra 4 bölüm geliyor.
- Masaüstünde editoryal bir bölünme var: metin solda, film karesi sağda
  (en fazla kare oranında, 3:4 klip `cover` ile kırpılıyor). Telefonda film tam
  ekran, metin gradyanın üstünde.
- Klipler sırayla yükleniyor: aktif klip ve bir sonraki. Poster = encode
  edilmiş klibin ilk karesi.
- `prefers-reduced-motion` açıksa video yerine posterler gösteriliyor.

| Bölüm | Klip | Kaynak fotoğraflar | Hareket |
|---|---|---|---|
| Kitchens | `pembroke` | Pembroke 1-1 → 1-3 (start + end) | Geniş açıdan adaya doğru dolly |
| Custom millwork | `boca` | Boca 1-1 → 1-2 (start + end) | Media wall boyunca kayma |
| Light | `ftl` | Fort Lauderdale 2-1 (LED'ler yanık, sadece start) | Çok yavaş push-in |
| Detail | `biscayne` | Biscayne 9-1 (sadece start) | Yavaş push-in |

### Higgsfield

- Model: **`minimax_h3`**, 2K, 3:4, 6 sn, klip başına **12 kredi**. Seedance 2.0
  1080p'de 72 kredi tutuyordu.
- Her sahne için 2 varyant üretildi, kare kare incelendi:
  - **Elendi:** pembroke-1 (ortada kesme), boca-1 (TV'ye ani zoom), ftl-1
    (başta kesme, vazolar değişiyor), ftl-2 (çift görüntülü dissolve), ftl-4
    (kavisli ada düz kutuya dönüşüyor). İki fotoğraf arasında obje farkı
    olunca MiniMax kesiyor ya da dissolve yapıyor. Tek start image + yavaş
    push-in en güvenli yol.
  - **Seçildi:** pembroke-2, boca-2, ftl-3, biscayne-1.
- Toplam harcama ~120 kredi (10 klip, bir kısmı rate limit nedeniyle yeniden
  gönderildi). İlk sürümdeki ~100 krediyle birlikte kalan ≈ 620.
- Dürüstlük: her klip gerçek bir proje fotoğrafıyla başlıyor (iki kliptekiyse
  bitiyor da). Ara kareler modelin kamera hareketi. Proje bilgisi gerçek.

### Encode (`public/media/film/`)

`scripts/encode-film.sh <kaynak.mp4> <isim>` (masaüstü 1200×1600 CRF 21 GOP 6, mobil 1080×1440
CRF 25 GOP 4, B-frame yok, faststart, poster = encode edilmiş ilk kare).

Boyutlar: masaüstünde klip başına 4.6–7 MB, mobilde 3–4.4 MB. Filmin tamamı
masaüstünde ~24 MB, mobilde ~14.5 MB. Klipler sırayla yüklendiği için ilk açılışta sadece biri iniyor.
Gerekirse CRF 23/27 ile ~%30 küçültülebilir.

## Fotoğraf kalitesi kuralı

- Sitede sadece büyük PNG kaynaklı projeler var: Pembroke Pines, Biscayne
  Boulevard, Parkland, Fort Lauderdale, Boca Raton, Crystal Tower, Miami Beach Nursery.
- **Çıkarılanlar:** Cape Coral (1284 px WhatsApp), Fort Lauderdale yatak odası
  (~1100 px WhatsApp), Armani Casa (1600 px WhatsApp), Gorhan çizimleri (PDF'ten,
  düşük çözünürlük). Orijinalleri gelirse `scripts/photo-sources.local.json`'a
  geri eklenebilir.
- Tam genişlik bantlar (`public/work/_bands/`): 3584 px kaynaklardan 2880×1620
  16:9 kırpımlar. `npm run photos` ile üretilir.

## Tipografi

- **Cormorant Garamond** 300/400 + italik: tüm başlıklar, sayılar (italik), alıntılar.
- **Jost** 300/400/500: metin, etiketler (500, büyük harf, 0.26em aralık),
  butonlar. Logodaki tagline'ın geometrik sans karakterine yakın.
- **Encode Sans Condensed** 300: sadece wordmark.
- Mono font ve "teknik etiket" dili kaldırıldı.
- Butonlar köşeli, büyük harf, geniş aralıklı. Header içerik üstüne gelince
  yarı saydam krem (koyu bölümlerde koyu) zemin alıyor.

## Sayfa akışı

Film (hero + 4 bölüm) → Stüdyo cümlesi → tam genişlik bant ("Drawn, specified,
installed.") → Hizmetler → Seçili işler (7 proje, asimetrik grid) → ikinci bant
→ Süreç (koyu) → Kurucu → İletişim (Boca fotoğrafı + form) → Footer.
