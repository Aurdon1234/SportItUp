 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { store, } from "@/lib/store"

function requireOwnerId() {
  const c = cookies()
  const ownerId = _optionalChain([c, 'access', _ => _.get, 'call', _2 => _2("owner-auth"), 'optionalAccess', _3 => _3.value])
  if (!ownerId) throw new Error("Unauthorized")
  return ownerId
}

export async function GET() {
  try {
    const ownerId = requireOwnerId()
    const list = store.bookings.filter((b) => b.ownerId === ownerId)
    return NextResponse.json({ bookings: list })
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req) {
  try {
    const ownerId = requireOwnerId()
    const body = await req.json()
    const { date, time, sport, customer, amount } = body || {}
    if (!date || !time || !sport || !customer) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }
    const id = `b_${Date.now().toString(36)}`
    const booking = {
      id,
      ownerId,
      date,
      time,
      sport,
      customer,
      status: "active",
      amount: typeof amount === "number" ? amount : undefined,
      source: "admin", //
    }
    store.bookings.push(booking)
    return NextResponse.json({ ok: true, booking })
  } catch (e2) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
