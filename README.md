# SURA INTERIOR · website

Immersive, scroll-driven site for Sura Interior LLC, a residential interior design studio in Boca Raton, Florida.
The opening is a full-screen scene: one camera move through a finished kitchen, generated with Higgsfield
(MiniMax H3) between real photographs of the room and driven by scroll. Services, selected work, process and a
contact form follow.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

- Content: `lib/content.ts` · opening scene: `components/Scene.tsx` (data in `app/page.tsx`) · clip encoding: `scripts/encode-scene.sh`
- Contact form delivery: copy `.env.example` to `.env.local` and set `RESEND_API_KEY`
- Project notes (Turkish): `docs/` — start with `docs/README.md` and `docs/07-immersive-scene.md`
