 function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { store } from "@/lib/store"

function requireOwnerId() {
  const c = cookies()
  const ownerId = _optionalChain([c, 'access', _2 => _2.get, 'call', _3 => _3("owner-auth"), 'optionalAccess', _4 => _4.value])
  if (!ownerId) throw new Error("Unauthorized")
  return ownerId
}

const DEFAULT_SLOTS = Array.from({ length: 8 }, (_, i) => `slot-${i + 1}`)

export async function GET(req) {
  try {
    const ownerId = requireOwnerId()
    const { searchParams } = new URL(req.url)
    const date = searchParams.get("date")
    if (!date) return NextResponse.json({ error: "Missing date" }, { status: 400 })
    const blocked = store.blocks.filter((b) => b.ownerId === ownerId && b.date === date).map((b) => b.slot)
    return NextResponse.json({ date, slots: DEFAULT_SLOTS, blocked })
  } catch (e) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}

export async function POST(req) {
  try {
    const ownerId = requireOwnerId()
    const body = await req.json()
    const { date, slot, action } = body || {}
    if (!date || !slot) return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    if (action === "block") {
      const exists = store.blocks.find((b) => b.ownerId === ownerId && b.date === date && b.slot === slot)
      if (!exists) store.blocks.push({ ownerId, date, slot })
    } else if (action === "unblock") {
      const idx = store.blocks.findIndex((b) => b.ownerId === ownerId && b.date === date && b.slot === slot)
      if (idx > -1) store.blocks.splice(idx, 1)
    }
    return NextResponse.json({ ok: true })
  } catch (e2) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
