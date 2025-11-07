"use client"
import React from "react"
const _jsxFileName = "app\\bookings\\page.tsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

import useSWR from "swr"












const fetcher = (url) => fetch(url).then((r) => r.json())

export default function BookingsPage() {
  const { data, error, isLoading } = useSWR(
    "/api/public/bookings",
    fetcher,
    { refreshInterval: 5000 }, // auto-refresh every 5s
  )

  if (isLoading)
    return (
      React.createElement('main', { className: "p-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 27}}
        , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}, "Loading bookings..." )
      )
    )
  if (error || !_optionalChain([data, 'optionalAccess', _ => _.ok])) {
    return (
      React.createElement('main', { className: "p-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}
        , React.createElement('p', { className: "text-red-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}, "Failed to load bookings: "    , _optionalChain([data, 'optionalAccess', _2 => _2.error]) || _optionalChain([(error ), 'optionalAccess', _3 => _3.message]))
      )
    )
  }

  const bookings = data.bookings || []

  return (
    React.createElement('main', { className: "p-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}
      , React.createElement('h1', { className: "text-2xl font-semibold mb-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 43}}, "Recent Bookings" )
      , React.createElement('div', { className: "overflow-auto rounded border"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
        , React.createElement('table', { className: "min-w-[900px] w-full border-collapse"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}
          , React.createElement('thead', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
            , React.createElement('tr', { className: "bg-muted/50", __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}
              , React.createElement('th', { className: "text-left p-3 border-b"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}, "Created")
              , React.createElement('th', { className: "text-left p-3 border-b"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}, "Name")
              , React.createElement('th', { className: "text-left p-3 border-b"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}, "Phone")
              , React.createElement('th', { className: "text-left p-3 border-b"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}, "Email")
              , React.createElement('th', { className: "text-left p-3 border-b"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}, "Venue")
              , React.createElement('th', { className: "text-left p-3 border-b"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}, "Sport")
              , React.createElement('th', { className: "text-left p-3 border-b"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}, "Time Slot" )
            )
          )
          , React.createElement('tbody', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
            , bookings.map((b) => (
              React.createElement('tr', { key: b.id, className: "hover:bg-muted/30", __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
                , React.createElement('td', { className: "p-3 border-b" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}, new Date(b.created_at).toLocaleString())
                , React.createElement('td', { className: "p-3 border-b" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}, b.name || "-")
                , React.createElement('td', { className: "p-3 border-b" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}, _nullishCoalesce(b.phone, () => ( "-")))
                , React.createElement('td', { className: "p-3 border-b" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}, b.email || "-")
                , React.createElement('td', { className: "p-3 border-b" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}, b.venue || "-")
                , React.createElement('td', { className: "p-3 border-b" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}, b.sport || "-")
                , React.createElement('td', { className: "p-3 border-b" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}, b.time_slot || "-")
              )
            ))
            , bookings.length === 0 && (
              React.createElement('tr', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
                , React.createElement('td', { className: "p-6 text-center text-muted-foreground"  , colSpan: 7, __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}, "No bookings yet."

                )
              )
            )
          )
        )
      )
      , React.createElement('p', { className: "text-sm text-muted-foreground mt-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}, "This page lists the most recent 200 bookings saved in Supabase."

      )
    )
  )
}
