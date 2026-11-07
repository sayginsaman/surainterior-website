// Contact form schema, shared by the form (labels, options) and the API route
// (validation). Fields come from the Discovery Call questions (docs/04 §5).

export const LOCATIONS = [
  "Boca Raton",
  "Delray Beach",
  "Boynton Beach",
  "Other Palm Beach County",
  "Broward County",
  "Miami-Dade County",
  "Other",
] as const;

export const PROPERTY_TYPES = ["Condo", "Single-family home", "New construction", "Other"] as const;

export const SERVICE_OPTIONS = [
  "Full-service interior design",
  "Kitchen, bath & cabinetry",
  "Custom furniture & millwork",
  "Renovation coordination",
  "Furnishing & FF&E",
] as const;

export const STAGES = ["Just exploring", "Buying a home", "Planning a renovation", "Under construction"] as const;
export const TIMELINES = ["As soon as possible", "1–3 months", "3–6 months", "6+ months"] as const;
export const CONTACT_PREFS = ["Email", "Phone", "Text"] as const;
export const SOURCES = ["Google", "Instagram", "Referral", "Realtor", "Contractor", "Other"] as const;
export const CONSULT_FORMATS = ["At my home", "Online video call", "Not sure yet"] as const;
export const CONSULT_TIMES = ["Weekday mornings", "Weekday afternoons", "Weekday evenings", "Saturdays"] as const;

export type Inquiry = {
  kind: "inquiry" | "consultation";
  format: string;
  times: string[];
  name: string;
  email: string;
  phone: string;
  contactPref: string;
  location: string;
  propertyType: string;
  services: string[];
  stage: string;
  timeline: string;
  message: string;
  source: string;
  consent: boolean;
  utm: Record<string, string>;
  landing: string;
};

type Result = { ok: true; data: Inquiry } | { ok: false; errors: Record<string, string> };

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const oneOf = (v: string, list: readonly string[]) => (list.includes(v) ? v : "");
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

export function validateInquiry(body: unknown): Result {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const errors: Record<string, string> = {};

  const name = str(b.name, 120);
  const email = str(b.email, 254);
  const phone = str(b.phone, 40);
  const message = str(b.message, 4000);
  const location = oneOf(str(b.location, 60), LOCATIONS);
  const kind = b.kind === "consultation" ? "consultation" : "inquiry";
  const services = Array.isArray(b.services)
    ? b.services.map((s) => str(s, 60)).filter((s) => (SERVICE_OPTIONS as readonly string[]).includes(s))
    : [];
  const times = Array.isArray(b.times)
    ? b.times.map((s) => str(s, 40)).filter((s) => (CONSULT_TIMES as readonly string[]).includes(s))
    : [];

  if (name.length < 2) errors.name = "Please enter your name.";
  if (!EMAIL.test(email)) errors.email = "Please enter a valid email address.";
  if (phone && !/^[+()\-.\s\d]{7,}$/.test(phone)) errors.phone = "Please enter a valid phone number, or leave it blank.";
  if (!location) errors.location = "Please choose where the project is.";
  // a consultation request may come before the client knows which service fits
  if (kind === "inquiry" && services.length === 0) errors.services = "Please choose at least one service.";
  if (message.length < 10) errors.message = "A sentence or two about your space helps us prepare.";
  if (b.consent !== true) errors.consent = "Please confirm we may contact you about your inquiry.";

  if (Object.keys(errors).length) return { ok: false, errors };

  const utmIn = (b.utm && typeof b.utm === "object" ? b.utm : {}) as Record<string, unknown>;
  const utm: Record<string, string> = {};
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const v = str(utmIn[k], 120);
    if (v) utm[k] = v;
  }

  return {
    ok: true,
    data: {
      kind,
      format: oneOf(str(b.format, 40), CONSULT_FORMATS),
      times,
      name,
      email,
      phone,
      contactPref: oneOf(str(b.contactPref, 20), CONTACT_PREFS),
      location,
      propertyType: oneOf(str(b.propertyType, 40), PROPERTY_TYPES),
      services,
      stage: oneOf(str(b.stage, 40), STAGES),
      timeline: oneOf(str(b.timeline, 40), TIMELINES),
      message,
      source: oneOf(str(b.source, 40), SOURCES),
      consent: true,
      utm,
      landing: str(b.landing, 300),
    },
  };
}
