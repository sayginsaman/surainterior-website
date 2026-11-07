import type { Metadata } from "next";
import Image from "next/image";
import { consultationPrep, consultationSteps, site } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealObserver } from "@/components/RevealObserver";
import { SmoothScroll } from "@/components/SmoothScroll";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Design Consultation",
  description:
    "Book a design consultation with SURA INTERIOR: a focused conversation about your home, your plans and the right next steps, at your home in South Florida or online.",
  alternates: { canonical: "/consultation" },
};

export default function ConsultationPage() {
  return (
    <>
      <SmoothScroll />
      <RevealObserver />
      <Header />
      <main id="main" className="page consult">
        <section className="consult-hero" aria-labelledby="consult-title">
          <div className="consult-hero-copy">
            <p className="label">Design consultation</p>
            <h1 id="consult-title" className="display">
              A thoughtful <em>first step.</em>
            </h1>
            <p className="lede">A professional perspective can make all the difference.</p>
            <div className="cta-row">
              <a className="btn btn-dark" href="#request">
                Request a consultation
              </a>
              <a className="btn btn-line" href={site.phoneHref}>
                Call {site.phone}
              </a>
            </div>
          </div>
          <figure className="consult-hero-media">
            <Image
              src="/media/studio/consult-hero.jpg"
              alt="A design desk with floor plans, fabric swatches and wood and stone samples"
              width={2000}
              height={1116}
              priority
              sizes="(max-width: 900px) 100vw, 58vw"
            />
          </figure>
        </section>

        <section className="consult-intro">
          <p className="consult-intro-text" data-reveal>
            Whether you are planning a renovation, considering a new interior or looking for guidance on specific design decisions, a
            consultation is a focused conversation about your project with an experienced interior designer.
          </p>
          <p className="consult-intro-by" data-reveal>
            With Sura Kılıç, PhD in Interior Architecture, 20+ years of practice
          </p>
        </section>

        <section className="expect" aria-labelledby="expect-title">
          <div className="section-head">
            <p className="label" data-reveal>
              What to expect
            </p>
            <h2 id="expect-title" className="h2" data-reveal>
              One conversation, <em>four outcomes.</em>
            </h2>
          </div>
          <ol className="expect-list">
            {consultationSteps.map((s) => (
              <li key={s.n} data-reveal>
                <div className="expect-thumb">
                  <Image src={s.image} alt="" fill sizes="(max-width: 700px) 30vw, 180px" />
                </div>
                <div>
                  <span className="beat-n">{s.n}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="prepare">
          <div data-reveal>
            <p className="label">Good to have on hand</p>
            <ul className="ticks-list">
              {consultationPrep.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          <div data-reveal>
            <p className="label">Format</p>
            <p className="prepare-text">
              At your home in South Florida, or online by video. We&rsquo;ll confirm the time, length and any consultation fee when we reply to
              your request.
            </p>
          </div>
        </section>

        <section id="request" className="consult-request" aria-labelledby="request-title">
          <div className="consult-contact">
            <p className="label" data-reveal>
              Request a consultation
            </p>
            <h2 id="request-title" className="h2" data-reveal>
              Tell us about <em>your project.</em>
            </h2>
            <p data-reveal>Share a few details and we&rsquo;ll reply to arrange a time. Prefer to talk? Call or email us directly.</p>
            <ul className="contact-lines contact-lines-ink" data-reveal>
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
          <div className="contact-card consult-card">
            <ContactForm email={site.email} kind="consultation" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
