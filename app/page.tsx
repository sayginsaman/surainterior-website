import Image from "next/image";
import Link from "next/link";
import { differentiators, photo, process, projects, services, site } from "@/lib/content";
import { Experience } from "@/components/Experience";
import { RevealVideo } from "@/components/RevealVideo";
import { Header } from "@/components/Header";
import { Loader } from "@/components/Loader";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { RevealObserver } from "@/components/RevealObserver";
import { Services } from "@/components/Services";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

export default function Home() {
  const installed = photo("pembroke-pines-residence", 0);
  const trio = [
    { p: projects.find((x) => x.slug === "biscayne-boulevard-residence")!, i: 0 },
    { p: projects.find((x) => x.slug === "fort-lauderdale-kitchen")!, i: 0 },
    { p: projects.find((x) => x.slug === "boca-raton-residence")!, i: 0 },
  ];
  const drawing = photo("gorhan-design-studio-center", 0);
  const servicePics = services.map((s) => {
    const p = projects.find((x) => x.slug === s.image.project)!;
    return { ...p.images[s.image.index], project: `${p.title} · ${p.location}` };
  });
  const work = projects.filter((p) => p.slug !== "gorhan-design-studio-center");

  return (
    <>
      <Loader />
      <SmoothScroll />
      <ScrollProgress />
      <RevealObserver />
      <Experience />
      <RevealVideo />
      <Header />

      <main id="main">
        {/* 1 · HERO */}
        <section className="chapter hero" data-key="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow" data-reveal>
              Interior design studio · {site.city}
            </p>
            <h1 id="hero-title" className="display" data-reveal>
              <span>Thoughtful Design.</span>
              <span>
                <em>Exceptional</em> Living.
              </span>
            </h1>
            <p className="lede" data-reveal>
              Residential interiors, kitchens and custom millwork across South Florida. Designed to be built, made to be lived in.
            </p>
            <div className="cta-row" data-reveal>
              <a className="btn btn-dark" href="#contact">
                Book a consultation <span className="btn-arrow" aria-hidden />
              </a>
              <a className="btn btn-ghost" href="#work">
                See the work
              </a>
            </div>
          </div>
          <div className="hero-foot" aria-hidden>
            <span className="tagline hero-tagline">{site.tagline}</span>
            <span className="scroll-cue" />
          </div>
        </section>

        {/* 2 · STUDIO */}
        <section className="chapter chapter-right" data-key="studio" id="studio" aria-labelledby="studio-title">
          <div className="copy-block">
            <p className="eyebrow" data-reveal>
              The studio
            </p>
            <h2 id="studio-title" className="h2" data-reveal>
              We don&rsquo;t just design beautiful spaces. <em>We bring them to life.</em>
            </h2>
            <p data-reveal>{site.intro}</p>
            <dl className="facts" data-reveal>
              <div>
                <dt>Founder</dt>
                <dd>Sura Kılıç, PhD</dd>
              </div>
              <div>
                <dt>Experience</dt>
                <dd>20+ years</dd>
              </div>
              <div>
                <dt>Based in</dt>
                <dd>Boca Raton, FL</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* 3 · PLAN */}
        <section className="chapter chapter-left" data-key="plan" id="plan" aria-labelledby="plan-title">
          <div className="copy-block">
            <p className="eyebrow" data-reveal>
              <span className="mono">01</span> Plan
            </p>
            <h2 id="plan-title" className="h2" data-reveal>
              Every space starts <em>with a plan.</em>
            </h2>
            <p data-reveal>
              Before a single finish is chosen, the room is measured, zoned and drawn: furniture layouts, circulation, sight lines and the
              AutoCAD plans and elevations that everything after depends on.
            </p>
            <figure className="drawing-card" data-reveal>
              <Image src={drawing.src} alt={drawing.alt} width={drawing.w} height={drawing.h} sizes="320px" placeholder="blur" blurDataURL={drawing.blur} />
              <figcaption className="mono">From the drawing set · Gorhan Design Studio Center, Miami</figcaption>
            </figure>
          </div>
        </section>

        {/* 4 · BUILT TO BE BUILT */}
        <section className="chapter chapter-right chapter-build" data-key="build" id="build" aria-labelledby="build-title">
          <div className="key-anchor" data-key="assembled" aria-hidden />
          <div className="copy-block">
            <p className="eyebrow" data-reveal>
              <span className="mono">02</span> Built to be built
            </p>
            <h2 id="build-title" className="h2" data-reveal>
              Design that <em>considers fabrication.</em>
            </h2>
            <p data-reveal>
              Kitchens, closets, vanities and built-ins are drawn module by module, with sizes, reveals, hardware and lighting resolved,
              so fabricators and installers receive design information they can actually build from.
            </p>
            <ul className="ticks" data-reveal>
              <li>Plans, elevations &amp; sections</li>
              <li>Cabinet, hardware &amp; interior-organization details</li>
              <li>Finish and material specifications</li>
            </ul>
          </div>
        </section>

        {/* 5 · MATERIALS → reveal clip */}
        <section className="chapter reveal-chapter" data-key="materials" id="materials" aria-labelledby="materials-title" data-tone="dark">
          <div className="reveal-sticky">
            <div className="reveal-copy">
              <p className="eyebrow">
                <span className="mono">03</span> Materials, light, detail
              </p>
              <h2 id="materials-title" className="h2">
                Then the room <em>takes on its materials.</em>
              </h2>
            </div>
            <ol className="reveal-notes" aria-label="Material palette">
              <li>
                <span className="mono">Wood</span> Walnut and rift oak, fluted where the hand meets it
              </li>
              <li>
                <span className="mono">Stone</span> Quartz and quartzite, carried down as waterfall edges
              </li>
              <li>
                <span className="mono">Light</span> Warm LED built into shelves, niches and toe-kicks
              </li>
            </ol>
            <p className="reveal-caption mono">Concept visualization · not a client project</p>
          </div>
        </section>

        {/* 6 · INSTALLED (real photographs from here on) */}
        <section className="installed" data-key="proof" data-opaque id="installed" aria-labelledby="installed-title" data-tone="dark">
          <div className="installed-hero">
            <Image src={installed.src} alt={installed.alt} fill sizes="100vw" quality={80} placeholder="blur" blurDataURL={installed.blur} />
            <div className="installed-copy">
              <p className="eyebrow">
                <span className="mono">04</span> Installed
              </p>
              <h2 id="installed-title" className="display-2" data-reveal>
                Drawn, specified, <em>installed.</em>
              </h2>
              <p className="mono">Pembroke Pines Residence · 2023 · Photographed after installation</p>
            </div>
          </div>
          <div className="trio">
            {trio.map(({ p, i }) => (
              <Link key={p.slug} href={`/work/${p.slug}`} className="trio-card" data-reveal>
                <div className="trio-img">
                  <Image src={p.images[i].src} alt={p.images[i].alt} fill sizes="(max-width: 800px) 100vw, 33vw" placeholder="blur" blurDataURL={p.images[i].blur} />
                </div>
                <p>
                  <span>{p.title}</span>
                  <span className="mono">
                    {p.category} · {p.year}
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* 7 · SERVICES */}
        <section className="services" data-opaque id="services" aria-labelledby="services-title">
          <div className="section-head">
            <p className="eyebrow" data-reveal>
              Services
            </p>
            <h2 id="services-title" className="h2" data-reveal>
              Five ways we work, <em>one coordinated studio.</em>
            </h2>
            <p className="section-note" data-reveal>
              We design, specify and coordinate. Construction, electrical, plumbing and other licensed work stay with licensed professionals,
              and we work closely alongside them.
            </p>
          </div>
          <Services services={services} pics={servicePics} />
        </section>

        {/* 8 · WORK */}
        <section className="work" data-opaque id="work" aria-labelledby="work-title">
          <div className="section-head">
            <p className="eyebrow" data-reveal>
              Selected work
            </p>
            <h2 id="work-title" className="h2" data-reveal>
              Homes across <em>South Florida.</em>
            </h2>
          </div>
          <ul className="work-grid">
            {work.map((p, n) => {
              const img = p.images[0];
              return (
                <li key={p.slug} className={`work-card${p.feature && n < 2 ? " is-wide" : ""}`} data-reveal>
                  <Link href={`/work/${p.slug}`}>
                    <div className="work-img">
                      <Image src={img.src} alt={img.alt} fill sizes="(max-width: 700px) 100vw, (max-width: 1200px) 50vw, 33vw" placeholder="blur" blurDataURL={img.blur} />
                    </div>
                    <div className="work-meta">
                      <h3>{p.title}</h3>
                      <p className="mono">
                        {p.location} · {p.year}
                      </p>
                      <p className="work-cat">{p.category}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 9 · PROCESS */}
        <section className="process" data-opaque id="process" aria-labelledby="process-title" data-tone="dark">
          <div className="section-head">
            <p className="eyebrow" data-reveal>
              Our process
            </p>
            <h2 id="process-title" className="h2" data-reveal>
              Six steps, <em>one point of contact.</em>
            </h2>
          </div>
          <ol className="steps">
            {process.map((s) => (
              <li key={s.n} data-reveal>
                <span className="mono">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 10 · ABOUT */}
        <section className="about" data-opaque id="about" aria-labelledby="about-title">
          <div className="about-grid">
            <div>
              <p className="eyebrow" data-reveal>
                Founder
              </p>
              <h2 id="about-title" className="h2" data-reveal>
                Sura Kılıç, <em>PhD.</em>
              </h2>
              <p className="about-lede" data-reveal>
                Sura holds a PhD in Interior Architecture and brings more than twenty years of professional practice, in the United States and
                internationally, to every residential project the studio takes on.
              </p>
              <p data-reveal>
                Her work moves easily between the concept and the shop drawing: the mood of a room and the dimension of a drawer, the
                material palette and the way it will be fabricated and installed. The studio keeps a deliberately small number of projects so
                each one gets that attention.
              </p>
            </div>
            <ul className="diffs">
              {differentiators.map((d, i) => (
                <li key={d.title} data-reveal>
                  <span className="mono">0{i + 1}</span>
                  <h3>{d.title}</h3>
                  <p>{d.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 11 · CONTACT (the maquette returns, at dusk) */}
        <section className="contact" data-key="contact" id="contact" aria-labelledby="contact-title" data-tone="dark">
          <div className="contact-intro">
            <p className="eyebrow" data-reveal>
              Contact
            </p>
            <h2 id="contact-title" className="display-2" data-reveal>
              Let&rsquo;s talk about <em>your space.</em>
            </h2>
            <p data-reveal>Tell us a little about the project. We&rsquo;ll reply to set up a discovery call.</p>
            <ul className="contact-lines" data-reveal>
              <li>
                <span className="mono">Phone</span>
                <a href={site.phoneHref}>{site.phone}</a>
              </li>
              <li>
                <span className="mono">Email</span>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
              <li>
                <span className="mono">Studio</span>
                {site.city}
              </li>
              <li>
                <span className="mono">Serving</span>
                {site.serviceArea.join(" · ")}
              </li>
            </ul>
          </div>
          <div className="contact-card">
            <ContactForm email={site.email} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
