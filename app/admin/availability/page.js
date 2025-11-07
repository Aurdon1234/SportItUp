"use client"
import React from "react"
const _jsxFileName = "app\\admin\\availability\\page.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

import { AdminShell } from "@/components/admin/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import useSWR, { mutate as globalMutate } from "swr"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"

const fetcher = (url) => fetch(url).then((r) => r.json())

const DEFAULT_SLOTS = [
  "06:00-07:00",
  "07:00-08:00",
  "08:00-09:00",
  "09:00-10:00",
  "16:00-17:00",
  "17:00-18:00",
  "18:00-19:00",
  "19:00-20:00",
]

export default function AdminAvailabilityPage() {
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [date, setDate] = useState(today)
  const { data, mutate, isLoading } = useSWR(
    date ? `/api/admin/availability?date=${date}` : null,
    fetcher,
    { refreshInterval: 4000 },
  )

  const slots = useMemo(
    () => (Array.isArray(_optionalChain([data, 'optionalAccess', _2 => _2.slots])) && _optionalChain([data, 'optionalAccess', _3 => _3.slots, 'access', _4 => _4.length]) ? (_optionalChain([data, 'optionalAccess', _5 => _5.slots]) ) : DEFAULT_SLOTS),
    [data],
  )

  async function toggle(slot) {
    const action = _optionalChain([data, 'optionalAccess', _6 => _6.blocked, 'optionalAccess', _7 => _7.includes, 'call', _8 => _8(slot)]) ? "unblock" : "block"
    await fetch("/api/admin/availability", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, slot, action }),
    })
    mutate()
  }

  async function refresh() {
    await globalMutate(`/api/admin/availability?date=${date}`)
  }

  const blocked = new Set(_optionalChain([data, 'optionalAccess', _9 => _9.blocked]) || [])
  const booked = new Set(_optionalChain([data, 'optionalAccess', _10 => _10.booked]) || [])

  return (
    React.createElement(AdminShell, { title: "Availability", __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
      , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
        , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
          , React.createElement(CardTitle, { className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}, "Real-time Availability" )
        )
        , React.createElement(CardContent, { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
          , React.createElement('div', { className: "flex items-end gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
            , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
              , React.createElement('label', { htmlFor: "date", className: "text-sm text-gray-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}, "Date"

              )
              , React.createElement(Input, { id: "date", type: "date", value: date, onChange: (e) => setDate(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}} )
            )
            , React.createElement(Button, { variant: "outline", className: "border-gray-200 text-black bg-transparent"  , onClick: refresh, __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}, "Refresh"

            )
          )

          , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-4 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}
            , isLoading || !data
              ? Array.from({ length: 8 }).map((_, i) => (
                  React.createElement('div', { key: i, className: "h-16 rounded-md border border-gray-200 animate-pulse"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 77}} )
                ))
              : slots.map((s) => {
                  const isBlocked = blocked.has(s)
                  const isBooked = booked.has(s)
                  const classes = isBlocked
                    ? "border-gray-300 bg-gray-100 text-gray-600"
                    : isBooked
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                  const label = isBlocked ? "Blocked" : isBooked ? "Booked" : "Available"
                  return (
                    React.createElement('button', {
                      key: s,
                      onClick: () => (!isBooked ? toggle(s) : undefined),
                      className: `h-16 rounded-md border flex items-center justify-center text-sm transition-colors ${classes} ${
                        isBooked ? "cursor-not-allowed" : ""
                      }`,
                      'aria-disabled': isBooked, __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}

                      , label, " (" , s, ")"
                    )
                  )
                })
          )

          , React.createElement('div', { className: "mt-1 flex items-center gap-2 flex-wrap"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}
            , React.createElement(Badge, { className: "bg-green-100 text-green-700 border-green-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 104}}, "Available")
            , React.createElement(Badge, { className: "bg-red-100 text-red-700 border-red-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}, "Booked")
            , React.createElement(Badge, { variant: "secondary", className: "bg-gray-100 text-gray-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 106}}, "Blocked"

            )
          )
        )
      )
    )
  )
}
