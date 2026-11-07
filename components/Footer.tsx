import Link from "next/link";
import { site } from "@/lib/content";
import { LogoMark, Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer className="site-footer" data-opaque data-tone="dark">
      <div className="footer-top">
        <div className="footer-mark">
          <LogoMark />
          <div>
            <Wordmark llc />
            <span className="tagline">{site.tagline}</span>
          </div>
        </div>
        <p className="footer-line">{site.headline}</p>
      </div>
      <p className="footer-descriptor">{site.descriptor.join(" · ")}</p>
      <div className="footer-cols">
        <div>
          <p className="mono">Studio</p>
          <p>{site.city}</p>
          <p>Serving South Florida</p>
        </div>
        <div>
          <p className="mono">Contact</p>
          <p>
            <a href={site.phoneHref}>{site.phone}</a>
          </p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
        </div>
        <div>
          <p className="mono">Explore</p>
          <p>
            <Link href="/#services">Services</Link>
          </p>
          <p>
            <Link href="/#work">Selected work</Link>
          </p>
          <p>
            <Link href="/#contact">Book a consultation</Link>
          </p>
        </div>
      </div>
      <div className="footer-base mono">
        <span>© {new Date().getFullYear()} {site.legalName}</span>
        <span>Interior design, specification and coordination. Licensed trades by licensed professionals.</span>
      </div>
    </footer>
  );
}
