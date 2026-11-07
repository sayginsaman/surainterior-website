import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { bands, differentiators, getProject, philosophy, site } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealObserver } from "@/components/RevealObserver";
import { SmoothScroll } from "@/components/SmoothScroll";

export const metadata: Metadata = {
  title: "About",
  description:
    "SURA INTERIOR is a residential interior design studio in Boca Raton, founded by Sura Kılıç, PhD in Interior Architecture, with more than twenty years of practice.",
  alternates: { canonical: "/about" },
};

function projectImage(slug: string, index: number) {
  const p = getProject(slug)!;
  return { ...p.images[index], caption: `${p.title} · ${p.location}` };
}

export default function AboutPage() {
  const hero = bands.lounge;
  const studio = projectImage("boca-raton-residence", 2);
  const cta = bands.pembroke;

  return (
    <>
      <SmoothScroll />
      <RevealObserver />
      <Header />
      <main id="main" className="page">
        <section className="page-hero" data-tone="dark" aria-labelledby="about-title">
          <Image
            src={hero.src}
            alt="Curved lounge chairs beside a fluted walnut island, Fort Lauderdale Residence"
            fill
            priority
            sizes="100vw"
            quality={80}
            placeholder="blur"
            blurDataURL={hero.blur}
          />
          <div className="page-hero-copy">
            <p className="label">About</p>
            <h1 id="about-title" className="display">
              Thoughtful design.
              <br /> <em>Purposeful spaces.</em>
            </h1>
            <span className="page-hero-rule" aria-hidden />
          </div>
        </section>

        <section className="studio-intro" aria-labelledby="studio-title">
          <div className="studio-intro-copy">
            <p className="label label-rule" data-reveal>
              About SURA INTERIOR
            </p>
            <h2 id="studio-title" className="h2" data-reveal>
              A design studio rooted in experience, creativity <em>and precision.</em>
            </h2>
            <p data-reveal>
              SURA INTERIOR is a full-service residential interior design studio in Boca Raton, founded by Sura Kılıç, PhD in Interior
              Architecture.
            </p>
            <p data-reveal>
              With more than twenty years of practice in the United States and internationally, we bring together architectural insight, creative
              vision and technical knowledge to shape homes that are both beautiful and easy to live in.
            </p>
            <p data-reveal>
              Our approach goes beyond aesthetics. Thoughtful design starts with people: how a household moves through the day, what it needs close
              at hand, what makes a room feel calm. We design for that, then carry it through drawings, specifications and coordination to the
              finished room.
            </p>
            <a className="btn btn-line" href="#philosophy" data-reveal>
              Our philosophy <span aria-hidden>→</span>
            </a>
          </div>
          <figure className="studio-intro-media" data-reveal>
            <Image src={studio.src} alt={studio.alt} fill sizes="(max-width: 1100px) 100vw, 50vw" placeholder="blur" blurDataURL={studio.blur} />
            <figcaption>{studio.caption}</figcaption>
          </figure>
        </section>

        <section id="philosophy" className="philosophy" aria-labelledby="philosophy-title">
          <h2 id="philosophy-title" className="label label-center" data-reveal>
            Our philosophy
          </h2>
          <ul className="philosophy-list">
            {philosophy.map((item) => {
              const img = projectImage(item.image.project, item.image.index);
              return (
                <li key={item.title} data-reveal>
                  <div className="philosophy-img">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      placeholder="blur"
                      blurDataURL={img.blur}
                      style={{ objectPosition: item.image.position }}
                    />
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="founder" aria-labelledby="founder-title">
          <div className="founder-copy">
            <p className="label label-rule" data-reveal>
              The founder
            </p>
            <h2 id="founder-title" className="h2" data-reveal>
              Sura Kılıç, <em>PhD in Interior Architecture</em>
            </h2>
            <p className="founder-lede" data-reveal>
              An academic and a practitioner, with a multidisciplinary background in interior architecture, design research and project management,
              Sura brings a thoughtful and informed perspective to every project.
            </p>
            <p data-reveal>
              Her work moves easily between the concept and the shop drawing: the mood of a room and the dimension of a drawer, the material palette
              and the way it will be fabricated and installed. The studio keeps a deliberately small number of projects so each one gets that
              attention.
            </p>
            <dl className="facts founder-facts" data-reveal>
              <div>
                <dt>Education</dt>
                <dd>PhD, Interior Architecture</dd>
              </div>
              <div>
                <dt>Practice</dt>
                <dd>20+ years, US and international</dd>
              </div>
              <div>
                <dt>Studio</dt>
                <dd>{site.city}</dd>
              </div>
            </dl>
            <Link className="btn btn-line" href="/consultation" data-reveal>
              Meet Sura in a consultation <span aria-hidden>→</span>
            </Link>
          </div>
          <div className="founder-media" aria-hidden>
            <Image src="/media/studio/founder-still.jpg" alt="" fill sizes="(max-width: 1100px) 100vw, 50vw" />
          </div>
        </section>

        <section className="apart" aria-labelledby="apart-title">
          <div className="apart-head">
            <p className="label" data-reveal>
              Working with the studio
            </p>
            <h2 id="apart-title" className="h2" data-reveal>
              What sets <em>the studio apart.</em>
            </h2>
          </div>
          <ul className="diffs">
            {differentiators.map((d, i) => (
              <li key={d.title} data-reveal>
                <span className="step-n">{String(i + 1).padStart(2, "0")}</span>
                <h3>{d.title}</h3>
                <p>{d.text}</p>
              </li>
            ))}
          </ul>
        </section>

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
              <Link className="btn btn-ghost-light" href="/services">
                Explore services
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
