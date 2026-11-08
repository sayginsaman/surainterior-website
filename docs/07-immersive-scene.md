# 07 · Tam ekran, scroll ile ilerleyen sahne (2026-11-07)

Kullanıcı `06`'daki çözümü de beğenmedi:

> "Higgsfield videosu ile direkt immersive bir 3D scroll animasyonlarıyla bir
> sahne oluşturup o şekilde bir experience sunmak; sadece hero'nun sağ
> tarafında scroll ile farklı sahneler arasında geçiş yapan değil."

Yani istenen: ekranın tamamı tek bir sahne olsun, scroll kamerayı o sahnenin
içinde ilerletsin, yazılar sahnenin üstünde derinlikle belirsin. Tiny Villa
hissi korunsun ama render yerine gerçek mekan kullanılsın.

## Güncelleme (aynı gün): dört projelik tur

Kullanıcı yönü onayladı ama iki şey istedi: açılış Pembroke Pines yerine daha
lüks ve modern bir projeyle başlasın, sahneye daha fazla video eklensin.

Yeni sıra (her proje kendi gerçek fotoğrafından başlıyor, projeler arası
scroll altında dissolve):

| Sıra | Proje | Segment | Kaynak |
|---|---|---|---|
| 1 (hero) | Fort Lauderdale Residence | `f`, 8 sn (varyant 1) | 2-1 (LED tavan ışığı, kavisli ada), sadece start; adaya ve taş tezgaha kesintisiz push |
| 2 | Boca Raton Residence | `m`, 3.2 sn (varyant 1, 0–76. kare) | 1-1 → 1-2; ortada hızlı bir savrulma vardı (iki varyantta da), sadece yumuşak ilk kısım alındı ve scroll'da 5 sn ağırlıkla yavaşlatıldı |
| 3 | Biscayne Boulevard Residence | `s`, 6.58 sn (varyant 1) | 9-1, sadece start, adaya doğru push; iki varyant da temizdi |
| 4 | Pembroke Pines Residence | `b` + `c` + `d` | Önceki sürümden: ada etrafında dönüş, tezgah, pencere ışığı |

Pembroke Pines'ın açılış dolly'si (`a`) çıkarıldı. Bu turda 6 klip daha
üretildi (~80 kredi). Parkland daha klasik
durduğu için tura alınmadı. Final cümlesi "Beyond design. Into detail."
artık stüdyonun imzası olarak pencere ışığında, "Book a consultation" linkiyle.
(Alt şeritteki proje adı ve ilerleme çubuğu kullanıcı isteğiyle kaldırıldı.)

### Her projede daha uzun kalmak (aynı gün, ikinci geri bildirim)

Kullanıcı: "Her sahne biraz daha uzun olsun, şu an çok kısa hissettiriyor,
direkt farklı bir eve geçiyor."

- Her projeye ikinci bir klip eklendi (`f2`, `m2`, `s2`). İkinci klip,
  birincinin **gerçek son karesinden** başlıyor (o kare çıkarılıp start image
  olarak verildi). Bu yüzden aynı ev içindeki birleşim görünmüyor; dissolve
  sadece projeler arasında var.
  - Fort Lauderdale: tezgah boyunca sola, LED'li dolapların altına doğru kayma
  - Boca Raton: media wall boyunca sağdaki ışıklı nişe doğru kayma
  - Biscayne: adanın yanından sağdaki camlı vitrin dolaba doğru dönüş
- Sahne 1500vh → 2400vh (telefonda 1300 → 2000svh). Hero başlığı daha kısa
  bir scroll aralığında (P 0–0.055) kayboluyor, metinler her projede daha uzun
  ekranda kalıyor ve aralarda yazısız, sadece kameranın aktığı anlar var.
- Boyut için masaüstü encode CRF 22 → 24, mobil 25 → 26.
- Seçilen devam klipleri: `f2` (varyant 1, tezgah boyunca kayma), `m2`
  (varyant 1, nişteki seramiğe kadar yaklaşma; son saniyeler hızlı olduğu için
  9 sn scroll payı), `s2` (varyant 1, sakin; diğeri sonda uydurma bir kapı
  gösteriyordu). 6 klip, ~96 kredi.
- Ölçülen birleşim farkları (aynı ev içinde): f→f2 2.5, m→m2 2.6, s→s2 2.2,
  b→c 2.2 (/255). Gözle fark edilmiyor.
- Toplam boyut: masaüstü 37 MB, mobil 14 MB (9 segment). Sırayla yüklendiği
  için açılışta yalnızca `f` + `f2` iniyor (~10 MB masaüstü).

### Armani Casa turun ikinci durağı (2026-11-08)

Kullanıcı: "Armani Casa fotoğraflarını kullanmamışsın, work'e ve hero'ya
koy, öncekiler gibi videolu. Çok iyi bir proje."

- **Fotoğraflar:** 23 WhatsApp JPEG (1600×1066), 5'i kopya. Daha önce
  çözünürlük yüzünden dışarıda kalmıştı. Seçilen 10 kare Higgsfield
  `bytedance_image_upscale` ile 4K'ya (4096×2737) büyütüldü, 2 kredi/kare.
  Ayrıntı karşılaştırması temiz: nesne eklemiyor, sadece keskinleştiriyor.
  Büyütülmüş kaynaklar `assets/armani-casa-hd/` (gitignore'da).
- **Ad:** "Sunny Isles Residence", konum "Armani Casa Residences, Sunny
  Isles Beach, FL". Bina adı yalnızca konum olarak geçiyor (bkz. `02`).
  Kapsam "Interior design · Furnishings (FF&E) · Styling": portfolyoda bu
  proje FF&E ve styling olarak geçiyor; mutfak ve banyo bitişlerini
  sahiplenmiyoruz.
- **Sahnedeki yeri:** Fort Lauderdale açılışından hemen sonra, ikinci
  proje. Gece ışıklı ceviz mutfaktan gün ışığıyla dolu beyaz salona
  dissolve.
  - `ac` (8 sn, varyant 2): ac-02'nin 16:9 kırpımından (sağ kenardaki
    yürüteç kadraj dışında kalsın diye 3712 px genişlik) salonun içine
    doğru ilerleyip kanepenin üstünden yükselen, panoramik cam duvarda
    biten hareket. En büyük kare farkı 7.3/255, kesik yok.
  - `ac2` (8 sn, varyant 1): `ac`'nin gerçek son karesinden başlıyor, cam
    duvar boyunca sağa kayma. En büyük kare farkı 4.1/255; birleşim farkı
    (ac son kare → ac2 ilk kare) 1.8/255.
  - Maliyet: 10 büyütme + 4 klip, toplam 84 kredi.
- Toplam boyut (11 segment): masaüstü 44 MB, mobil 16 MB. Sırayla
  yüklendiği için açılış etkilenmiyor.
- Metin: "Furnished for the view." (sağ hizalı).
- Sahne 2400vh → 3000vh (telefonda 2000 → 2500svh). Metin aralıkları yeni
  süreye göre yeniden ölçeklendi; her proje ekranda eskisi kadar scroll
  mesafesi kaplıyor.

## İlk karar (Pembroke Pines tek sahne)

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

| Segment | Kaynak | Kullanılan kısım | Birleşim |
|---|---|---|---|
| a | K0 → K1 (varyant 1) | 0–111. kare (4.67 sn); model 112. karede bitiş karesine kesiyordu | → b dissolve |
| b | K1 → K2 (varyant 1) | tamamı (8 sn); adanın etrafında kesintisiz dönüş | → c aynı kare (K2) |
| c | K2 → K3 (varyant 1) | 0–88. kare (3.71 sn); 94. karede hızlı atlama vardı | → d dissolve |
| d | K3, sadece start (varyant 1) | tamamı (6.58 sn); pencereye yavaş push-in | son |

- **Model:** `minimax_h3`, 2K (2560×1440), 16:9. Toplam 9 klip üretildi (~120 kredi).
- **Ölçüm:** MiniMax'ın ilk ve son kareleri verilen fotoğrafla ortalama
  2.6/255 farkla örtüşüyor, bu yüzden segmentler paralel üretilebildi.
- **Öğrenilen:** İki fotoğraf çok farklı açılardaysa (1-1 → 1-3, 1-6 → 1-12)
  model önce akıcı gidiyor, sonra bitiş karesine kesiyor. Temiz kısım
  kırpılıp sonraki segmentle scroll altında dissolve ediliyor. Aynı odanın
  komşu açıları (1-3 → 1-6) kesintisiz dönüyor. Bu dönüşte model odanın
  görmediğimiz duvarını da (yuvarlak ayna, saat) uyduruyor.

## Sayfada

`components/Scene.tsx`, sahne verisi `app/page.tsx` (`SEGMENTS`, `BEATS`).

- `.scene` 1000vh (mobilde 900svh). İçinde yapışkan, tam ekran bir sahne var.
- Scroll ilerlemesinin 0–0.94 aralığı filmi oynatıyor. Segmentler süreye göre
  ağırlıklı, böylece kamera hızı sabit kalıyor. `blend: true` olan segment
  bir öncekiyle %4.5'lik bir aralıkta üst üste biniyor ve opaklıkla
  dissolve ediliyor. Aynı kareyi paylaşanlarda (b → c) video doğrudan değişiyor.
- Karartma (scrim) o an görünen metnin hizasını takip ediyor (sol, sağ, orta).
  Header'ın açık/koyu tonu için `data-tone` sahnenin medya katmanında; sahne
  küçülünce header tekrar koyu yazıya dönüyor.
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
- Alttaki not şeridi ("Camera motion created from photographs…") ve ilerleme
  çubuğu kullanıcı isteğiyle kaldırıldı. Proje adları yalnızca metinlerin
  üst etiketlerinde geçiyor.

## Encode

`scripts/encode-scene.sh <kaynak.mp4> <id> [son_iyi_kare]` → `public/media/scene/<id>-desktop.mp4`
(1920×1080, CRF 22, GOP 6, B-frame yok), `<id>-mobile.mp4` (9:16 orta kırpım,
720×1280, CRF 25, GOP 4), `<id>-poster.jpg`.

Boyutlar (dört projelik tur): masaüstünde toplam ~31 MB (f 6.6, m 2.7, s 5.3,
b 8.3, c 3.7, d 4.5), mobilde ~10 MB. Segmentler sırayla yükleniyor: açılışta
sadece `f` ve bir sonraki iniyor, poster anında görünüyor. Gerekirse masaüstü
CRF 24 ile ~%30 küçültülebilir.

`seconds` alanı scroll payını belirliyor, video süresini değil. Kısa ama
güzel bir parçaya daha büyük değer vermek, o parçayı scroll'da yavaşlatır (`m`).
