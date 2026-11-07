import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { bands, getProject, photo, serviceCards, type ServiceCard } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealObserver } from "@/components/RevealObserver";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full-service interior design, kitchen and bath design, custom millwork, space planning, renovation coordination and furnishing for homes across South Florida.",
  alternates: { canonical: "/services" },
};

function cardImage(card: ServiceCard) {
  if ("src" in card.image) return { ...card.image, blur: undefined, caption: undefined };
  const p = getProject(card.image.project)!;
  const img = p.images[card.image.index];
  return { ...img, caption: `${p.title} · ${p.location}` };
}

export default function ServicesPage() {
  const hero = bands.biscayne;
  const intro = photo("biscayne-boulevard-residence", 4);
  const cta = bands.light;

  return (
    <>
      <SmoothScroll />
      <RevealObserver />
      <Header />
      <main id="main" className="page">
        <section className="page-hero" data-tone="dark" aria-labelledby="services-title">
          <Image src={hero.src} alt="" fill priority sizes="100vw" quality={80} placeholder="blur" blurDataURL={hero.blur} />
          <div className="page-hero-copy">
            <p className="label">Services</p>
            <h1 id="services-title" className="display">
              Our services
            </h1>
            <p className="page-hero-sub">From concept to completion</p>
            <span className="page-hero-rule" aria-hidden />
          </div>
        </section>

        <section className="svc-intro">
          <div className="svc-intro-copy">
            <h2 className="h2" data-reveal>
              Thoughtful design solutions <em>for every space.</em>
            </h2>
            <p data-reveal>
              At SURA INTERIOR we offer a complete range of residential design services, tailored to your vision, your routines and your
              project goals. From the first concept to the final styling, we bring together creativity, technical knowledge and close attention
              to detail.
            </p>
            <p className="svc-verbs" data-reveal>
              Design <i>·</i> Plan <i>·</i> Specify <i>·</i> Coordinate
            </p>
          </div>
          <figure className="svc-intro-media" data-reveal>
            <Image src={intro.src} alt={intro.alt} fill sizes="(max-width: 900px) 100vw, 55vw" placeholder="blur" blurDataURL={intro.blur} />
          </figure>
        </section>

        <section className="svc-cards-section" aria-label="Services overview">
          <ul className="svc-cards">
            {serviceCards.map((c) => {
              const img = cardImage(c);
              return (
                <li key={c.slug} data-reveal>
                  <a href={`#${c.slug}`} className="svc-card">
                    <div className="svc-card-img">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
                        {...(img.blur ? { placeholder: "blur" as const, blurDataURL: img.blur } : {})}
                      />
                    </div>
                    <h3>{c.title}</h3>
                    <p>{c.blurb}</p>
                    <span className="text-link">
                      Learn more <span aria-hidden>→</span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="svc-details" aria-label="Service details">
          {serviceCards.map((c, i) => {
            const img = cardImage(c);
            return (
              <article key={c.slug} id={c.slug} className={`svc-detail${i % 2 ? " is-flipped" : ""}`}>
                <figure className="svc-detail-media" data-reveal>
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 45vw"
                    {...(img.blur ? { placeholder: "blur" as const, blurDataURL: img.blur } : {})}
                  />
                  {img.caption && <figcaption>{img.caption}</figcaption>}
                </figure>
                <div className="svc-detail-copy">
                  <p className="label" data-reveal>
                    <span className="beat-n">{String(i + 1).padStart(2, "0")}</span> Service
                  </p>
                  <h2 className="h2" data-reveal>
                    {c.title}
                  </h2>
                  <p className="svc-detail-lede" data-reveal>
                    {c.blurb}
                  </p>
                  <ul className="svc-detail-list" data-reveal>
                    {c.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                  <p className="svc-outcome" data-reveal>
                    <span>Outcome</span>
                    {c.outcome}
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <p className="svc-scope" data-reveal>
          We design, specify and coordinate. Construction, electrical, plumbing and other licensed work stay with licensed professionals, and we
          work closely alongside them.
        </p>

        <section className="cta-band" data-tone="dark" aria-labelledby="cta-title">
          <Image src={cta.src} alt="" fill sizes="100vw" quality={80} placeholder="blur" blurDataURL={cta.blur} />
          <div className="cta-band-copy">
            <h2 id="cta-title" className="display-2" data-reveal>
              Every great project begins <em>with a conversation.</em>
            </h2>
            <p data-reveal>Let&rsquo;s talk through your ideas and how we can bring them to life.</p>
            <div className="cta-row" data-reveal>
              <Link className="btn btn-light" href="/consultation">
                Book a consultation
              </Link>
              <Link className="btn btn-ghost-light" href="/#contact">
                Send an inquiry
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
