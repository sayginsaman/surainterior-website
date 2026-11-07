# SURA INTERIOR · website

Immersive, scroll-driven site for Sura Interior LLC, a residential interior design studio in Boca Raton, Florida.
A real-time clay maquette (React Three Fiber) is choreographed by scroll, hands off to a seam-locked
Higgsfield clip where the room takes on its materials, and then real project photography takes over.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

- Content: `lib/content.ts` · camera keyframes: `lib/timeline.ts` · scene: `components/scene/`
- Contact form delivery: copy `.env.example` to `.env.local` and set `RESEND_API_KEY`
- Project notes (Turkish): `docs/` — start with `docs/README.md` and `docs/05-build-notes.md`
