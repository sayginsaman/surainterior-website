"use client";

import { useEffect, useState } from "react";
import { LogoMark, Wordmark } from "./Logo";

/** Short intro over the page while the maquette compiles. CSS hides it after 3s no matter what. */
export function Loader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const finish = () => setTimeout(() => setDone(true), 350);
    if (document.documentElement.dataset.stage === "ready") finish();
    window.addEventListener("stage-ready", finish, { once: true });
    const t = setTimeout(() => setDone(true), 3200);
    return () => {
      window.removeEventListener("stage-ready", finish);
      clearTimeout(t);
    };
  }, []);
  return (
    <div className={`loader${done ? " is-done" : ""}`} aria-hidden>
      <LogoMark />
      <Wordmark />
      <p className="tagline">Beyond design. Into detail.</p>
    </div>
  );
}
