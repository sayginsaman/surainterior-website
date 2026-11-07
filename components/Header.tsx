"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { LogoMark, Wordmark } from "./Logo";

const NAV = [
  { href: "/#studio", label: "Studio" },
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#about", label: "About" },
];

export function Header({ solid = false }: { solid?: boolean }) {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Switch to light text while the header sits over a dark section.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const probe = 36;
      let isDark = false;
      // the opening film is a dark, full-screen video on narrow screens only
      const filmDark = window.innerWidth <= 900;
      for (const el of document.querySelectorAll<HTMLElement>("[data-tone]")) {
        const tone = el.dataset.tone;
        if (tone !== "dark" && !(tone === "film" && filmDark)) continue;
        const r = el.getBoundingClientRect();
        if (r.top <= probe && r.bottom >= probe) {
          isDark = true;
          break;
        }
      }
      setDark(isDark);
      // over the opening film the page itself is the header's backdrop
      const film = document.querySelector<HTMLElement>(".film");
      const inFilm = film ? film.getBoundingClientRect().bottom > probe : false;
      setScrolled(window.scrollY > 24 && !inFilm);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
    };
  }, []);

  return (
    <header className={`site-header${dark ? " is-dark" : ""}${scrolled || solid ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <Link href="/" className="wordmark" aria-label="SURA INTERIOR, home" onClick={() => setOpen(false)}>
        <LogoMark />
        <Wordmark />
      </Link>
      <nav className="nav" aria-label="Primary">
        {NAV.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label}
          </a>
        ))}
      </nav>
      <a className="btn btn-dark btn-sm header-cta" href="/#contact">
        Book a consultation
      </a>
      <button className="menu-btn" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        <i />
        <i />
      </button>
      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Mobile">
          {NAV.map((n, i) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} style={{ transitionDelay: `${60 + i * 40}ms` }}>
              <small>0{i + 1}</small>
              {n.label}
            </a>
          ))}
          <a href="/#contact" onClick={() => setOpen(false)}>
            <small>06</small>Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
