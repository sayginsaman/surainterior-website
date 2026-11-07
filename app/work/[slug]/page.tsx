import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/content";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { RevealObserver } from "@/components/RevealObserver";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  const cover = p.images[0];
  return {
    title: `${p.title}, ${p.location}`,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: `${p.title} · SURA INTERIOR`, description: p.summary, images: [{ url: cover.src, width: cover.w, height: cover.h, alt: cover.alt }] },
  };
}

export default async function ProjectPage({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const i = projects.indexOf(p);
  const next = projects[(i + 1) % projects.length];
  const [cover, ...rest] = p.images;

  return (
    <>
      <RevealObserver />
      <Header />
      <main id="main" className="project">
        <section className="project-hero" data-tone="dark">
          <Image src={cover.src} alt={cover.alt} fill priority sizes="100vw" quality={80} placeholder="blur" blurDataURL={cover.blur} />
          <div className="project-title">
            <p className="label">
              {p.category} · {p.year}
            </p>
            <h1 className="display-2">{p.title}</h1>
          </div>
        </section>

        <section className="project-body">
          <dl className="project-meta">
            <div>
              <dt>Location</dt>
              <dd>{p.location}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{p.year}</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>{p.scope.join(" · ")}</dd>
            </div>
          </dl>
          <div>
            <p className="project-summary" data-reveal>
              {p.summary}
            </p>
            <p className="cta-row" style={{ marginTop: "2.4rem" }} data-reveal>
              <Link className="btn btn-dark" href="/#contact">
                Start a project like this <span className="btn-arrow" aria-hidden />
              </Link>
              <Link className="btn btn-ghost" href="/#work">
                All work
              </Link>
            </p>
          </div>
        </section>

        <section className="gallery" aria-label={`${p.title} photographs`}>
          {rest.map((img) => (
            <figure key={img.src} data-reveal>
              <Image src={img.src} alt={img.alt} width={img.w} height={img.h} sizes="(max-width: 760px) 100vw, 50vw" placeholder="blur" blurDataURL={img.blur} />
              <figcaption>{img.alt}</figcaption>
            </figure>
          ))}
        </section>

        <Link href={`/work/${next.slug}`} className="project-next">
          <div>
            <p className="label">Next project</p>
            <p className="display-2">{next.title}</p>
          </div>
          <span className="btn btn-ghost">
            View <span className="btn-arrow" aria-hidden />
          </span>
        </Link>
      </main>
      <Footer />
    </>
  );
}
