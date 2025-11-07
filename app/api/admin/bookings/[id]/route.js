 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { store } from "@/lib/store"

function requireOwnerId() {
  const c = cookies()
  const ownerId = _optionalChain([c, 'access', _ => _.get, 'call', _2 => _2("owner-auth"), 'optionalAccess', _3 => _3.value])
  if (!ownerId) throw new Error("Unauthorized")
  return ownerId
}

export async function PUT(req, { params }) {
  try {
    const ownerId = requireOwnerId()
    const idx = store.bookings.findIndex((b) => b.id === params.id && b.ownerId === ownerId)
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
    const body = await req.json().catch(() => ({}))
    const allowed = ["date", "time", "sport", "customer", "status", "amount"] 
    for (const key of allowed) {
      if (key in body && body[key ] !== undefined) {
        // @ts-expect-error index update on union type
        store.bookings[idx][key] = body[key]
      }
    }
    return NextResponse.json({ ok: true, booking: store.bookings[idx] })
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function DELETE(_req, { params }) {
  try {
    const ownerId = requireOwnerId()
    const idx = store.bookings.findIndex((b) => b.id === params.id && b.ownerId === ownerId)
    if (idx === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })
    store.bookings[idx].status = "canceled"
    return NextResponse.json({ ok: true })
  } catch (e2) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
