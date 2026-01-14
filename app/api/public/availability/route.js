// app/api/public/availability/route.js
import { NextResponse } from "next/server";
import { getAllBookingRows } from "@/lib/google-sheets"; // adjust import if your helper name/path differs

// Column indexes (0-based) — you confirmed these:
// E = Venue (contains turfId), F = Date, G = Time slot
const VENUE_COL = 4;   // E
const COURT_COL = 5;   // F  NEW
const DATE_COL = 6;    // G
const TIMESLOT_COL = 7; // H

function normalizeSheetDate(cell) {
  if (!cell) return null;
  const s = String(cell).trim();

  // If already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // Try common spreadsheet formats
  // MM/DD/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const [m, d, y] = s.split("/").map(Number);
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  // DD/MM/YYYY or DD-MM-YYYY
  if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/.test(s)) {
    const sep = s.includes("/") ? "/" : "-";
    const [a, b, c] = s.split(sep).map(Number);
    // Heuristic: if a > 12 treat as DD/MM/YYYY else treat as MM/DD/YYYY
    if (a > 12) {
      const d = a, m = b, y = c;
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    } else {
      const m = a, d = b, y = c;
      return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }

  // Last fallback: Date.parse
  const parsed = Date.parse(s);
  if (!isNaN(parsed)) {
    return new Date(parsed).toISOString().split("T")[0];
  }

  return null;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const turfIdRaw = (searchParams.get("turfId") || "").trim();
    const dateReq = (searchParams.get("date") || "").trim();
    const courtReq = (searchParams.get("court") || "Court 1").trim();

    if (!turfIdRaw || !dateReq) {
      return NextResponse.json({ ok: false, error: "Missing turfId or date" }, { status: 400 });
    }

    const turfId = turfIdRaw.toLowerCase();
    const court = courtReq.toLowerCase();


    let rows = [];
    try {
      rows = await getAllBookingRows(); // expected: array of arrays (rows)
    } catch (err) {
      console.error("[availability] getAllBookingRows error:", err);
      return NextResponse.json({ ok: false, error: "Failed to read sheet", details: String(err) }, { status: 500 });
    }

    // console.log(`[availability] turfId=${turfId} date=${dateReq} rowsCount=${rows.length}`);
    console.log(
  `[availability] turfId=${turfId} court=${court} date=${dateReq} rows=${rows.length}`
);

    console.log("[availability] sample first rows:", rows.slice(0, 6));

    // Filter rows exactly by turfId in VENUE_COL and normalized date in DATE_COL
    // const bookedSlots = rows
    //   .filter((r) => {
    //     const venueCell = String(r[VENUE_COL] || "").toLowerCase().trim();
    //     const rawDateCell = r[DATE_COL];
    //     const bookingDate = normalizeSheetDate(rawDateCell);

    //     // exact match on turfId (case-insensitive, trimmed)
    //     if (!venueCell || venueCell !== turfId) return false;

    //     if (!bookingDate) return false;
    //     return bookingDate === dateReq;
    //   })
    const bookedSlots = rows
  .filter((r) => {
    const venueCell = String(r[VENUE_COL] || "").toLowerCase().trim();
    const courtCell = String(r[COURT_COL] || "court 1").toLowerCase().trim();
    const rawDateCell = r[DATE_COL];
    const bookingDate = normalizeSheetDate(rawDateCell);

    if (!venueCell || venueCell !== turfId) return false;
    if (!bookingDate || bookingDate !== dateReq) return false;

    // 🔥 COURT MATCH
    return courtCell === court;
  })

      .flatMap((r) => {
        const slotCell = String(r[TIMESLOT_COL] || "").trim();
        if (!slotCell) return [];
        return slotCell
          .split(/[,;\n]+/)
          .map((s) => s.trim())
          .filter(Boolean);
      });

    const blockedHours = [...new Set(bookedSlots)];

    console.log(`[availability] blockedHours (${blockedHours.length}):`, blockedHours);

    return NextResponse.json({ ok: true, blockedHours });
  } catch (err) {
    console.error("[availability] unexpected error:", err);
    return NextResponse.json({ ok: false, error: "Internal server error", details: String(err) }, { status: 500 });
  }
}
