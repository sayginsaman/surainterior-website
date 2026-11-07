"use client";

import Image from "next/image";
import { useState } from "react";
import type { Service } from "@/lib/content";

type Pic = { src: string; w: number; h: number; blur: string; alt: string; project: string };

export function Services({ services, pics }: { services: Service[]; pics: Pic[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="svc">
      <div className="svc-media" aria-hidden>
        {pics.map((p, i) => (
          <figure key={p.src} className={i === active ? "is-active" : ""}>
            <Image src={p.src} alt="" fill sizes="(max-width: 900px) 100vw, 40vw" placeholder="blur" blurDataURL={p.blur} quality={80} />
            <figcaption>{p.project}</figcaption>
          </figure>
        ))}
      </div>
      <ol className="svc-list">
        {services.map((s, i) => (
          <li key={s.n} className={i === active ? "is-active" : ""}>
            <button
              className="svc-head"
              aria-expanded={i === active}
              aria-controls={`svc-${s.n}`}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="svc-n">{s.n}</span>
              <span className="svc-title">{s.title}</span>
              <span className="svc-plus" aria-hidden />
            </button>
            <div id={`svc-${s.n}`} className="svc-body" role="region" aria-label={s.title}>
              <div>
                <ul>
                  {s.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
                <p className="svc-outcome">
                  <span>Outcome</span>
                  {s.outcome}
                </p>
                <div className="svc-thumb">
                  <Image src={pics[i].src} alt={pics[i].alt} fill sizes="100vw" placeholder="blur" blurDataURL={pics[i].blur} />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
