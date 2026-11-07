# SURA INTERIOR: proje dokümanları

Sura Interior LLC için 3D, scroll-animasyonlu, immersive bir web sitesi.
Referans: https://tinyvilla.peachworlds.com/. Asset üretimi: Higgsfield MCP.
Repo: https://github.com/sayginsaman/surainterior-website (**public**).

**Durum (2026-11-07):** Açılış artık tam ekran bir sahne: Pembroke Pines
mutfağında, gerçek fotoğraflar arasında üretilmiş kesintisiz bir kamera
hareketi, scroll ile ilerliyor (`07`). Kil maket (`05`) ve çerçeveli film
(`06`) kaldırıldı. Lokal çalışıyor, build temiz. Deploy ve push yok.

| Dosya | İçerik |
|---|---|
| [01-business-brief.md](01-business-brief.md) | İş modeli, marka, 5 hizmet sütunu, farklılaştırıcılar, süreç, hedef kitle, yasal uyarılar |
| [02-portfolio-inventory.md](02-portfolio-inventory.md) | 11 ABD projesi + kapak görseli, dosya listesi, kalite notları, video, malzeme renkleri |
| [03-reference-tinyvilla-analysis.md](03-reference-tinyvilla-analysis.md) | Referans sitenin tekniği, kamera koreografisi, görsel dili, zayıf noktaları |
| [04-concept-and-build-plan.md](04-concept-and-build-plan.md) | Konsept, 3D seçenekleri (A/B/C), Higgsfield, teknik yığın, contact formu, açık sorular |
| [05-build-notes.md](05-build-notes.md) | İlk sürüm (kil maket, artık kullanılmıyor), form, fotoğraf hattı, marka, eksikler |
| [06-real-film-redesign.md](06-real-film-redesign.md) | İkinci sürüm (çerçeveli film, kaldırıldı); tipografi ve fotoğraf kalite kuralı hâlâ geçerli |
| [07-immersive-scene.md](07-immersive-scene.md) | **Güncel açılış:** tam ekran sahne, segmentler, kırpma/dissolve kararları, encode |
| `private/business-internals.md` | Fiyatlar, gelir hedefleri, reklam bütçesi, adres. **Gitignore'da, sadece lokal.** |
| `reference/` | Tiny Villa ekran görüntüleri, video kare özeti |

## Kesin kararlar

- **Türkiye projelerinin görselleri kullanılmayacak.** Sadece ABD projeleri (kullanıcı, 2026-11-06).
- ~~3D yaklaşımı: C · Hibrit~~ → **Kaldırıldı** (kullanıcı, 2026-11-07: render görünümü "fake"). Yerine gerçek fotoğraflardan Higgsfield klipleri scroll ile oynatılıyor. Detay: `06`.
- **Düşük çözünürlüklü fotoğraf kullanılmaz** (kullanıcı, 2026-11-07). Sadece büyük PNG kaynaklı 7 proje sitede.
- Site kodu bu repoda yaşar. Higgsfield sadece asset üretimi için (görsel, video, 3D, upscale).
- Kaynak PDF'ler ve `docs/private/` public repoya gitmez.
- Fotoğraf yayın izni Sura Hanım'dan alındı (kullanıcı, 2026-11-07). Ham
  fotoğraf klasörleri müşteri adı taşıdığı için gitignore'da.
- Marka: kullanıcının gönderdiği logo, renkler ve "Beyond design. Into detail." (2026-11-07).
- Stack: Next.js (App Router) + Lenis, 3D kütüphanesi yok. Hosting kararı açık (Vercel önerisi).
- Tipografi: Cormorant Garamond + Jost (+ wordmark için Encode Sans Condensed).

## Assetler

- `assets/portfolio/<proje>/pNN-k.jpeg`: PDF'ten kayıpsız çıkarılmış 72 görsel + `manifest.json`
- `assets/video/kitchen-walkthrough-raw.mp4`: kullanıcının paylaştığı ham mutfak videosu
- `public/work/<slug>/NN.jpg`: sitede kullanılan işlenmiş proje fotoğrafları (98 adet)
- `public/media/scene/`: açılış sahnesinin segmentleri (desktop/mobile) ve posterleri
- `public/work/_bands/`: tam genişlik bant kırpımları
