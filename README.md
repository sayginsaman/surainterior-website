# SURA INTERIOR · website

Immersive, scroll-driven site for Sura Interior LLC, a residential interior design studio in Boca Raton, Florida.
The opening is a scroll-scrubbed film made from Sura's own project photographs (Higgsfield MiniMax H3 clips
that start, and some end, on real photos), followed by services, selected work, process and a contact form.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
```

- Content: `lib/content.ts` · opening film: `components/Film.tsx` · clip encoding: `scripts/encode-film.sh`
- Contact form delivery: copy `.env.example` to `.env.local` and set `RESEND_API_KEY`
- Project notes (Turkish): `docs/` — start with `docs/README.md` and `docs/06-real-film-redesign.md`
