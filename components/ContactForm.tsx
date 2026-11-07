"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  CONSULT_FORMATS,
  CONSULT_TIMES,
  CONTACT_PREFS,
  LOCATIONS,
  PROPERTY_TYPES,
  SERVICE_OPTIONS,
  SOURCES,
  STAGES,
  TIMELINES,
} from "@/lib/inquiry";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string };

export function ContactForm({ email, kind = "inquiry" }: { email: string; kind?: "inquiry" | "consultation" }) {
  const consult = kind === "consultation";
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
      const v = params.get(k) ?? sessionStorageGet(k);
      if (v) utm[k] = v;
    }
    const body = {
      kind,
      format: fd.get("format"),
      times: fd.getAll("times"),
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      contactPref: fd.get("contactPref"),
      location: fd.get("location"),
      propertyType: fd.get("propertyType"),
      services: fd.getAll("services"),
      stage: fd.get("stage"),
      timeline: fd.get("timeline"),
      message: fd.get("message"),
      source: fd.get("source"),
      consent: fd.get("consent") === "on",
      website: fd.get("website"),
      startedAt: startedAt.current,
      utm,
      landing: sessionStorageGet("landing") ?? window.location.pathname,
    };
    setStatus({ kind: "sending" });
    setErrors({});
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.ok) {
        setStatus({ kind: "sent" });
        form.reset();
      } else if (json.errors) {
        setErrors(json.errors);
        setStatus({ kind: "error", message: "Please check the highlighted fields." });
        const first = Object.keys(json.errors)[0];
        formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      } else {
        setStatus({ kind: "error", message: json.error ?? `Something went wrong. Please email ${email}.` });
      }
    } catch {
      setStatus({ kind: "error", message: `We couldn't reach the server. Please email ${email}.` });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status.kind === "sent") {
    return (
      <div className="form-done" ref={statusRef} tabIndex={-1} role="status">
        <p className="label">{consult ? "Request received" : "Inquiry received"}</p>
        <h3>{consult ? "Thank you. We’ll be in touch to confirm a time for your consultation." : "Thank you. We’ll be in touch to arrange a discovery call."}</h3>
        <p>If it&rsquo;s easier, you can also reach us at <a href={`mailto:${email}`}>{email}</a>.</p>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <span className="field-error" id={`${k}-error`}>
        {errors[k]}
      </span>
    ) : null;
  const aria = (k: string) => (errors[k] ? { "aria-invalid": true, "aria-describedby": `${k}-error` } : {});

  return (
    <form ref={formRef} className="contact-form" onSubmit={onSubmit} noValidate>
      <div className="form-grid">
        <label className="field">
          <span>Full name *</span>
          <input name="name" autoComplete="name" required {...aria("name")} />
          {err("name")}
        </label>
        <label className="field">
          <span>Email *</span>
          <input name="email" type="email" autoComplete="email" required {...aria("email")} />
          {err("email")}
        </label>
        <label className="field">
          <span>Phone</span>
          <input name="phone" type="tel" autoComplete="tel" inputMode="tel" {...aria("phone")} />
          {err("phone")}
        </label>
        <label className="field">
          <span>Preferred contact</span>
          <select name="contactPref" defaultValue="">
            <option value="">No preference</option>
            {CONTACT_PREFS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Project location *</span>
          <select name="location" defaultValue="" required {...aria("location")}>
            <option value="" disabled>
              Choose…
            </option>
            {LOCATIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          {err("location")}
        </label>
        <label className="field">
          <span>Property type</span>
          <select name="propertyType" defaultValue="">
            <option value="">Choose…</option>
            {PROPERTY_TYPES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>

      {consult && (
        <>
          <fieldset className="field chips">
            <legend>How would you like to meet?</legend>
            <div>
              {CONSULT_FORMATS.map((o, i) => (
                <label key={o} className="chip">
                  <input type="radio" name="format" value={o} defaultChecked={i === 0} />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <fieldset className="field chips">
            <legend>Times that usually suit you</legend>
            <div>
              {CONSULT_TIMES.map((o) => (
                <label key={o} className="chip">
                  <input type="checkbox" name="times" value={o} />
                  <span>{o}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </>
      )}

      <fieldset className="field chips" {...aria("services")}>
        <legend>{consult ? "What would you like to discuss?" : "Services of interest *"}</legend>
        <div>
          {SERVICE_OPTIONS.map((o) => (
            <label key={o} className="chip">
              <input type="checkbox" name="services" value={o} />
              <span>{o}</span>
            </label>
          ))}
        </div>
        {err("services")}
      </fieldset>

      <div className="form-grid">
        <label className="field">
          <span>Project stage</span>
          <select name="stage" defaultValue="">
            <option value="">Choose…</option>
            {STAGES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className="field">
          <span>Timeline</span>
          <select name="timeline" defaultValue="">
            <option value="">Choose…</option>
            {TIMELINES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>

      <label className="field">
        <span>{consult ? "Tell us about your project *" : "Tell us about your space *"}</span>
        <textarea name="message" rows={4} placeholder="The rooms, what isn't working today, what you'd love it to feel like." required {...aria("message")} />
        {err("message")}
      </label>

      <label className="field">
        <span>How did you hear about us?</span>
        <select name="source" defaultValue="">
          <option value="">Choose…</option>
          {SOURCES.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>

      {/* honeypot */}
      <div className="hp" aria-hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="consent">
        <input type="checkbox" name="consent" required {...aria("consent")} />
        <span>I agree that SURA INTERIOR may contact me about this inquiry. We never share your details.</span>
      </label>
      {err("consent")}

      <div className="form-foot">
        <button className="btn btn-dark" type="submit" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Sending…" : consult ? "Request a consultation" : "Send inquiry"}
          <span className="btn-arrow" aria-hidden />
        </button>
        <div className="form-status" ref={statusRef} tabIndex={-1} aria-live="polite">
          {status.kind === "error" ? status.message : ""}
        </div>
      </div>
    </form>
  );
}

function sessionStorageGet(k: string) {
  try {
    return window.sessionStorage.getItem(k);
  } catch {
    return null;
  }
}
