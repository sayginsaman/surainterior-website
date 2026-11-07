# 07 · Tam ekran, scroll ile ilerleyen sahne (2026-11-07)

Kullanıcı `06`'daki çözümü de beğenmedi:

> "Higgsfield videosu ile direkt immersive bir 3D scroll animasyonlarıyla bir
> sahne oluşturup o şekilde bir experience sunmak; sadece hero'nun sağ
> tarafında scroll ile farklı sahneler arasında geçiş yapan değil."

Yani istenen: ekranın tamamı tek bir sahne olsun, scroll kamerayı o sahnenin
içinde ilerletsin, yazılar sahnenin üstünde derinlikle belirsin. Tiny Villa
hissi korunsun ama render yerine gerçek mekan kullanılsın.

## Karar

- **Sahne:** Pembroke Pines Residence mutfağı. Elimizde aynı odanın 12 gerçek
  fotoğrafı var, bu yüzden tutarlı bir kamera yolu kurulabiliyor.
- **Film:** Tek kesintisiz kamera hareketi, 4 segmentten oluşuyor. Her segment
  gerçek bir fotoğrafta başlıyor ve gerçek bir fotoğrafta bitiyor. Bir sonraki
  segment o fotoğraftan devam ettiği için birleşimler görünmüyor.
- **Anahtar kareler** (Pembroke Pines ham fotoğraflarından 16:9 kırpım,
  2560×1440, gerçek pikseller, outpaint yok):

| Kare | Fotoğraf | Kadraj |
|---|---|---|
| K0 | 1-1 | Geniş açı: cam sarkıtlar, ada, ceviz boy dolap duvarı |
| K1 | 1-3 | Adanın ışıklı raflı ucu, buzdolabı duvarı |
| K2 | 1-6 | Ocak duvarı, taş backsplash, bahçe pencereleri |
| K3 | 1-12 | Pencere köşesi: vazo, espresso makinesi, bahçe |

| Segment | Hareket | Süre |
|---|---|---|
| a | K0 → K1, ileri ve hafif sağa dolly | 6 sn |
| b | K1 → K2, adanın ucunun etrafında sağa dönüş | 8 sn |
| c | K2 → K3, tezgah boyunca pencereye kayma | 6 sn |
| d | K3'ten bahçe ışığına yavaş push-in (sadece start) | 6 sn |

- **Model:** `minimax_h3`, 2K, 16:9, klip başına ~12–16 kredi, her segmentten 2 varyant.
- **Ölçüm:** MiniMax'ın ilk ve son kareleri verilen fotoğrafla ortalama
  2.6/255 farkla örtüşüyor (pembroke-2 ile ölçüldü). Segmentler bu yüzden paralel
  üretilebildi. Son kareyi çıkarıp bir sonrakine vermeye gerek kalmadı.

## Sayfada

`components/Scene.tsx`, sahne verisi `app/page.tsx` (`SEGMENTS`, `BEATS`).

- `.scene` 1000vh (mobilde 900svh). İçinde yapışkan, tam ekran bir sahne var.
- Scroll ilerlemesinin 0–0.94 aralığı filmi oynatıyor. Segmentler süreye göre
  ağırlıklı, böylece kamera hızı sabit kalıyor. Birleşim noktasında aktif
  `<video>` değişiyor: iki taraf da aynı fotoğraf olduğu için geçiş görünmüyor.
- **Hero:** Başlık scroll ile büyüyüp bulanıklaşarak kayboluyor; kamera
  yazının içinden odaya girer gibi.
- **Beats:** 4 metin bloğu, her biri kendi ilerleme aralığında. Derinlikten
  geliyor (perspective + translateZ + blur), yukarı doğru çıkıyor. Hizalamalar
  sol, sağ, sol, orta. Sonuncusu marka cümlesi "Beyond design. Into detail."
- **Çıkış:** Son %6'da sahne %88'e küçülüyor ve köşeleri yuvarlanıyor; krem
  sayfa çevresinden görünüyor, ardından stüdyo bölümü geliyor.
- Klipler sırayla yükleniyor: aktif segment ve bir sonraki. Poster = encode
  edilmiş ilk kare (K0'ın kendisi).
- `prefers-reduced-motion`: video yerine poster kareler gösteriliyor, metinler aynı.
- Telefon: aynı film 9:16 orta kırpım (`-mobile.mp4`, 720×1280), metin altta.
- Alt şeritte küçük bir not var: "Camera motion created from photographs of
  the finished room". Proje gerçek, hareket modelin.

## Encode

`scripts/encode-scene.sh <kaynak.mp4> <id>` → `public/media/scene/<id>-desktop.mp4`
(1920×1080, CRF 22, GOP 6, B-frame yok), `<id>-mobile.mp4` (9:16 orta kırpım,
720×1280, CRF 25, GOP 4), `<id>-poster.jpg`.
