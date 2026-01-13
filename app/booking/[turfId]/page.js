// app/booking/[turfId]/page.js  (server component)
import BookingClient from "./BookingClient";

function getBaseUrl() {
  // Prefer explicit public site URL (set this in .env.local and in Vercel Env)
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  // On Vercel, VERCEL_URL is like "your-app.vercel.app" (no protocol)
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  // Fallback to localhost for local dev
  const port = process.env.PORT || 3000;
  return `http://localhost:${port}`;
}

export default async function Page({ params, searchParams }) {
  const turfId = params.turfId;
  const date = searchParams?.date || new Date().toISOString().split("T")[0];

  const base = getBaseUrl();
  const url = `${base}/api/public/availability?turfId=${encodeURIComponent(turfId)}&date=${encodeURIComponent(date)}`;

  let initialBlockedHours = [];
  try {
    // server-side fetch to your own API (use no-store to always get fresh)
    const res = await fetch(url, { cache: "no-store", next: { revalidate: 0 } });
    if (res.ok) {
      const json = await res.json();
      if (json && Array.isArray(json.blockedHours)) initialBlockedHours = json.blockedHours;
      else if (json && Array.isArray(json?.blockedhours)) initialBlockedHours = json.blockedhours; // tolerant
    } else {
      console.error("Availability fetch failed:", res.status, await res.text().catch(() => "(no text)"));
    }
  } catch (err) {
    console.error("Availability fetch error", err);
    // If the fetch fails, we deliberately proceed with empty blockedHours to avoid crashing the page.
    // The client component will still call the API (SWR) to refresh availability.
  }

  return (
    <BookingClient
      turfId={turfId}
      initialDate={date}
      initialBlockedHours={initialBlockedHours}
    />
  );
}
