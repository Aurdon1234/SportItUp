 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { NextResponse } from "next/server"
import { store, turfOwners, } from "@/lib/store"
import { getSupabaseServerClient } from "@/lib/supabase/server"

function timeToRange(hourHHMM) {
  // "06:00" -> "06:00-07:00"
  const [h, m] = hourHHMM.split(":").map((n) => Number(n))
  const endH = String((h + 1) % 24).padStart(2, "0")
  return `${String(h).padStart(2, "0")}:${m.toString().padStart(2, "0")}-${endH}:${m.toString().padStart(2, "0")}`
}

export async function POST(req) {
  try {
    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

    const { turfId, date, time, sport, customer, amount } = body
    if (!turfId || !date || !time || !sport) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const ownerId = turfOwners[turfId] || "owner-1"
    const id = `b_${Date.now().toString(36)}`
    // normalize time to range so admin views are consistent
    const normalizedTime = time.includes("-") ? time : timeToRange(time)

    const booking = {
      id,
      ownerId,
      date,
      time: normalizedTime,
      sport,
      customer: customer || "Online Customer",
      status: "active",
      amount: typeof amount === "number" ? amount : undefined,
      source: "online",
    }
    store.bookings.push(booking)

    // also block the slot in availability
    store.blocks.push({ ownerId, date, slot: normalizedTime })

    return NextResponse.json({ ok: true, booking })
  } catch (e) {
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseServerClient({ useServiceRole: true })
    const { data, error } = await supabase
      .from("bookings")
      .select('id, created_at, name:Name, phone:Phone, email:Email, venue:Venue, sport:Sport, time_slot:"Time Slot"')
      .order("created_at", { ascending: false })
      .limit(200)

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, bookings: data })
  } catch (err) {
    return NextResponse.json({ ok: false, error: _optionalChain([err, 'optionalAccess', _ => _.message]) || "Failed to fetch bookings" }, { status: 500 })
  }
}
