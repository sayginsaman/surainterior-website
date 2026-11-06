# SURA INTERIOR: proje dokümanları

Sura Interior LLC için 3D, scroll-animasyonlu, immersive bir web sitesi.
Referans: https://tinyvilla.peachworlds.com/. Asset üretimi: Higgsfield MCP.
Repo: https://github.com/sayginsaman/surainterior-website (**public**).

**Durum (2026-11-06):** Araştırma ve doküman aşaması bitti. Site henüz
yapılmadı (kullanıcı talimatı).

| Dosya | İçerik |
|---|---|
| [01-business-brief.md](01-business-brief.md) | İş modeli, marka, 5 hizmet sütunu, farklılaştırıcılar, süreç, hedef kitle, yasal uyarılar |
| [02-portfolio-inventory.md](02-portfolio-inventory.md) | 11 ABD projesi + kapak görseli, dosya listesi, kalite notları, video, malzeme renkleri |
| [03-reference-tinyvilla-analysis.md](03-reference-tinyvilla-analysis.md) | Referans sitenin tekniği, kamera koreografisi, görsel dili, zayıf noktaları |
| [04-concept-and-build-plan.md](04-concept-and-build-plan.md) | Konsept, 3D seçenekleri (A/B/C), Higgsfield, teknik yığın, contact formu, açık sorular |
| `private/business-internals.md` | Fiyatlar, gelir hedefleri, reklam bütçesi, adres. **Gitignore'da, sadece lokal.** |
| `reference/` | Tiny Villa ekran görüntüleri, video kare özeti |

## Kesin kararlar

- **Türkiye projelerinin görselleri kullanılmayacak.** Sadece ABD projeleri (kullanıcı, 2026-11-06).
- Site kodu bu repoda yaşar. Higgsfield sadece asset üretimi için (görsel, video, 3D, upscale).
- Kaynak PDF'ler ve `docs/private/` public repoya gitmez.

## Assetler

- `assets/portfolio/<proje>/pNN-k.jpeg`: PDF'ten kayıpsız çıkarılmış 72 görsel + `manifest.json`
- `assets/video/kitchen-walkthrough-raw.mp4`: kullanıcının paylaştığı ham mutfak videosu
