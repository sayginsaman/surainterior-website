import Image from "next/image";
import Link from "next/link";
import { bands, differentiators, getProject, photo, process, projects, services, site } from "@/lib/content";
import { Header } from "@/components/Header";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ScrollProgress } from "@/components/ScrollProgress";
import { RevealObserver } from "@/components/RevealObserver";
import { Scene, type SceneBeat, type SceneSegment } from "@/components/Scene";
import { Services } from "@/components/Services";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";

// The opening scene: a walk through four finished projects, full screen,
// driven by scroll. Every segment starts on a real photograph of the room
// (16:9 crops of the project photos); b→c share a frame, the rest dissolve.
// See docs/07.
const SEGMENTS: SceneSegment[] = [
  { id: "f", seconds: 8, project: "Fort Lauderdale Residence · 2025" },
  // the media-wall glide is 3.2 s long; give it more scroll so it plays slower
  { id: "m", seconds: 5, blend: true, project: "Boca Raton Residence · 2025" },
  { id: "s", seconds: 6.58, blend: true, project: "Biscayne Boulevard Residence · 2025" },
  { id: "b", seconds: 8, blend: true, project: "Pembroke Pines Residence · 2023" },
  { id: "c", seconds: 3.71, project: "Pembroke Pines Residence · 2023" },
  { id: "d", seconds: 6.58, blend: true, project: "Pembroke Pines Residence · 2023" },
];

const BEATS: SceneBeat[] = [
  {
    id: "light",
    from: 0.08,
    to: 0.19,
    align: "left",
    kicker: "Fort Lauderdale Residence",
    title: (
      <>
        Light, treated <em>as a material.</em>
      </>
    ),
    text: "A curved island in fluted walnut under a warm ceiling cove: the evening version of the room was designed with the joinery.",
    link: { href: "/work/fort-lauderdale-kitchen", label: "View the project" },
  },
  {
    id: "millwork",
    from: 0.215,
    to: 0.315,
    align: "right",
    kicker: "Boca Raton Residence",
    title: (
      <>
        Made for the wall <em>it lives on.</em>
      </>
    ),
    text: "Walnut slats, lit display niches and floating cabinets, drawn piece by piece with the fabricator in mind.",
    link: { href: "/work/boca-raton-residence", label: "View the project" },
  },
  {
    id: "detail",
    from: 0.34,
    to: 0.47,
    align: "left",
    kicker: "Biscayne Boulevard Residence",
    title: (
      <>
        Detail you feel <em>before you notice it.</em>
      </>
    ),
    text: "Oak tall cabinets, a waterfall quartz island and a table that grows out of it on a single cylinder base.",
    link: { href: "/work/biscayne-boulevard-residence", label: "View the project" },
  },
  {
    id: "kitchens",
    from: 0.51,
    to: 0.66,
    align: "right",
    kicker: "Pembroke Pines Residence",
    title: (
      <>
        Built around the way <em>you live.</em>
      </>
    ),
    text: "Walnut, quartzite and light resolved down to the last reveal, so the room that is drawn is the room that gets built.",
    link: { href: "/work/pembroke-pines-residence", label: "View the project" },
  },
  {
    id: "finale",
    from: 0.71,
    to: 0.95,
    align: "center",
    kicker: "SURA INTERIOR · South Florida",
    title: (
      <>
        Beyond design. <em>Into detail.</em>
      </>
    ),
    link: { href: "#contact", label: "Book a consultation" },
  },
];

export default function Home() {
  const servicePics = services.map((s) => {
    const p = getProject(s.image.project)!;
    return { ...p.images[s.image.index], project: `${p.title} · ${p.location}` };
  });
  const light = bands.light;
  const pembroke = bands.pembroke;
  const contactImg = photo("boca-raton-residence", 0);

  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <RevealObserver />
      <Header />

      <main id="main">
        {/* 1 · Opening scene: a continuous walk through a real room, driven by scroll */}
        <Scene
          segments={SEGMENTS}
          beats={BEATS}
          credit="Camera motion created from photographs of the finished rooms"
          hero={
            <>
              <p className="label">Interior design studio · {site.city}</p>
              <h1 className="display">
                Thoughtful design.
                <br />
                <em>Exceptional</em> living.
              </h1>
              <p className="lede">
                Residential interiors, kitchens and custom millwork across South Florida. Designed to be built, made to be lived in.
              </p>
              <div className="cta-row">
                <a className="btn btn-light" href="#contact">
                  Book a consultation
                </a>
                <a className="btn btn-ghost-light" href="#work">
                  View the work
                </a>
              </div>
            </>
          }
        />

        {/* 2 · Studio statement */}
        <section className="statement" id="studio" aria-labelledby="studio-title">
          <p className="label" data-reveal>
            The studio
          </p>
          <h2 id="studio-title" className="statement-text" data-reveal>
            We don&rsquo;t just design beautiful spaces. <em>We bring them to life,</em> from the first plan to the final styling.
          </h2>
          <div className="statement-cols">
            <p data-reveal>{site.intro}</p>
            <dl className="facts" data-reveal>
              <div>
                <dt>Founder</dt>
                <dd>Sura Kılıç, PhD</dd>
              </div>
              <div>
                <dt>Practice</dt>
                <dd>20+ years</dd>
              </div>
              <div>
                <dt>Studio</dt>
                <dd>Boca Raton, Florida</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* 3 · Full-bleed band */}
        <section className="band" aria-label="Fort Lauderdale Residence">
          <div className="band-media">
            <Image src={light.src} alt="Curved walnut island under a warm ceiling cove, Fort Lauderdale Residence" fill sizes="100vw" quality={80} placeholder="blur" blurDataURL={light.blur} />
          </div>
          <div className="band-copy">
            <p className="band-quote" data-reveal>
              Drawn, specified, <em>installed.</em>
            </p>
            <p className="label" data-reveal>
              Fort Lauderdale Residence · 2025
            </p>
          </div>
        </section>

        {/* 4 · Services */}
        <section className="services" id="services" aria-labelledby="services-title">
          <div className="section-head">
            <p className="label" data-reveal>
              Services
            </p>
            <h2 id="services-title" className="h2" data-reveal>
              Five disciplines, <em>one studio.</em>
            </h2>
            <p className="section-note" data-reveal>
              We design, specify and coordinate. Construction, electrical, plumbing and other licensed work stay with licensed professionals, and we
              work closely alongside them.
            </p>
          </div>
          <Services services={services} pics={servicePics} />
        </section>

        {/* 5 · Selected work */}
        <section className="work" id="work" aria-labelledby="work-title">
          <div className="section-head section-head-row">
            <div>
              <p className="label" data-reveal>
                Selected work
              </p>
              <h2 id="work-title" className="h2" data-reveal>
                Homes across <em>South Florida.</em>
              </h2>
            </div>
            <p className="section-note" data-reveal>
              Every photograph on this site shows a finished project after installation.
            </p>
          </div>
          <ul className="work-grid">
            {projects.map((p, n) => {
              const img = p.images[0];
              return (
                <li key={p.slug} className="work-card" data-reveal>
                  <Link href={`/work/${p.slug}`}>
                    <div className="work-img">
                      <Image src={img.src} alt={img.alt} fill sizes="(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 34vw" placeholder="blur" blurDataURL={img.blur} />
                    </div>
                    <div className="work-meta">
                      <span className="work-n">{String(n + 1).padStart(2, "0")}</span>
                      <h3>{p.title}</h3>
                      <p>
                        {p.category} · {p.location} · {p.year}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* 6 · Second band */}
        <section className="band band-short" aria-label="Pembroke Pines Residence">
          <div className="band-media">
            <Image src={pembroke.src} alt="Walnut kitchen facing garden windows, Pembroke Pines Residence" fill sizes="100vw" quality={80} placeholder="blur" blurDataURL={pembroke.blur} />
          </div>
        </section>

        {/* 7 · Process */}
        <section className="process" id="process" aria-labelledby="process-title" data-tone="dark">
          <div className="section-head">
            <p className="label" data-reveal>
              Our process
            </p>
            <h2 id="process-title" className="h2" data-reveal>
              Six steps, <em>one point of contact.</em>
            </h2>
          </div>
          <ol className="steps">
            {process.map((s) => (
              <li key={s.n} data-reveal>
                <span className="step-n">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* 8 · Founder */}
        <section className="about" id="about" aria-labelledby="about-title">
          <div className="about-grid">
            <div>
              <p className="label" data-reveal>
                Founder
              </p>
              <h2 id="about-title" className="h2" data-reveal>
                Sura Kılıç, <em>PhD</em>
              </h2>
              <p className="about-lede" data-reveal>
                Sura holds a PhD in Interior Architecture and brings more than twenty years of professional practice, in the United States and
                internationally, to every residential project the studio takes on.
              </p>
              <p data-reveal>
                Her work moves easily between the concept and the shop drawing: the mood of a room and the dimension of a drawer, the material palette
                and the way it will be fabricated and installed. The studio keeps a deliberately small number of projects so each one gets that attention.
              </p>
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
          </div>
        </section>

        {/* 9 · Contact */}
        <section className="contact" id="contact" aria-labelledby="contact-title" data-tone="dark">
          <div className="contact-media" aria-hidden>
            <Image src={contactImg.src} alt="" fill sizes="(max-width: 1100px) 100vw, 45vw" placeholder="blur" blurDataURL={contactImg.blur} />
          </div>
          <div className="contact-inner">
            <div className="contact-intro">
              <p className="label" data-reveal>
                Contact
              </p>
              <h2 id="contact-title" className="display-2" data-reveal>
                Let&rsquo;s talk about <em>your space.</em>
              </h2>
              <p data-reveal>Tell us a little about the project. We&rsquo;ll reply to set up a discovery call.</p>
              <ul className="contact-lines" data-reveal>
                <li>
                  <span className="label">Phone</span>
                  <a href={site.phoneHref}>{site.phone}</a>
                </li>
                <li>
                  <span className="label">Email</span>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </li>
                <li>
                  <span className="label">Studio</span>
                  {site.city}
                </li>
                <li>
                  <span className="label">Serving</span>
                  {site.serviceArea.join(" · ")}
                </li>
              </ul>
            </div>
            <div className="contact-card">
              <ContactForm email={site.email} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
