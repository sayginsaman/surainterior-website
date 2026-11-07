import { NextResponse } from "next/server";
import { validateInquiry, type Inquiry } from "@/lib/inquiry";
import { site } from "@/lib/content";

export const runtime = "nodejs";

// Best-effort per-instance rate limit: 5 submissions per IP per 10 minutes.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function render(i: Inquiry) {
  const rows: [string, string][] = [
    ["Name", i.name],
    ["Email", i.email],
    ["Phone", i.phone || "—"],
    ["Preferred contact", i.contactPref || "—"],
    ["Project location", i.location],
    ["Property type", i.propertyType || "—"],
    ["Services", i.services.join(", ")],
    ["Project stage", i.stage || "—"],
    ["Timeline", i.timeline || "—"],
    ["Heard about us", i.source || "—"],
    ["Landing page", i.landing || "—"],
    ["UTM", Object.entries(i.utm).map(([k, v]) => `${k}=${v}`).join(" ") || "—"],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${i.message}`;
  const html = `<table cellpadding="6" style="font:14px/1.5 system-ui,sans-serif;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#6b635b">${esc(k)}</td><td>${esc(v)}</td></tr>`)
    .join("")}</table><p style="font:15px/1.6 system-ui,sans-serif;white-space:pre-wrap">${esc(i.message)}</p>`;
  return { text, html };
}

async function sendEmail(payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Spam: a hidden field people never fill, and a minimum time on the form.
  const startedAt = Number(body.startedAt);
  if (typeof body.website === "string" && body.website.length > 0) return NextResponse.json({ ok: true });
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 2500) {
    return NextResponse.json({ ok: false, error: "Please take a moment and try again." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many messages from this connection. Please email us directly." }, { status: 429 });
  }

  const result = validateInquiry(body);
  if (!result.ok) return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
  const inquiry = result.data;
  const { text, html } = render(inquiry);

  if (!process.env.RESEND_API_KEY) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY not set; inquiry logged instead of emailed:\n" + text);
      return NextResponse.json({ ok: true, delivered: false });
    }
    console.error("[contact] RESEND_API_KEY missing in production");
    return NextResponse.json({ ok: false, error: `Our form is offline. Please email ${site.email}.` }, { status: 503 });
  }

  const from = process.env.CONTACT_FROM_EMAIL ?? "SURA INTERIOR <onboarding@resend.dev>";
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  try {
    await sendEmail({ from, to: [to], reply_to: inquiry.email, subject: `New inquiry: ${inquiry.name} · ${inquiry.location}`, text, html });
    // Acknowledgement to the client. Failure here must not fail the inquiry.
    await sendEmail({
      from,
      to: [inquiry.email],
      reply_to: to,
      subject: "We received your inquiry · SURA INTERIOR",
      text: `Dear ${inquiry.name},\n\nThank you for reaching out. We have received your inquiry and will be in touch shortly to arrange a discovery call.\n\nSURA INTERIOR\n${site.phone}\n${site.email}`,
    }).catch((e) => console.error("[contact] acknowledgement failed", e));
  } catch (e) {
    console.error("[contact] delivery failed", e);
    return NextResponse.json({ ok: false, error: `We couldn't send your message. Please email ${site.email}.` }, { status: 502 });
  }
  return NextResponse.json({ ok: true, delivered: true });
}
