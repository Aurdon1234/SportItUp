"use client"
import React from "react"
const _jsxFileName = "app\\admin\\stats\\page.tsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

import { useMemo, useState } from "react"
import { AdminShell } from "@/components/admin/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts"















const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const err = new Error("Failed to load") 
    err.status = res.status
    err.info = data
    throw err
  }
  return data
}

function toDate(d) {
  const [y, m, day] = d.split("-").map(Number)
  return new Date(y, (m || 1) - 1, day || 1)
}

function fmtINR(n) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)
}

function startOfDay(dt) {
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
}

function addDays(dt, days) {
  const d = new Date(dt)
  d.setDate(d.getDate() + days)
  return d
}

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function getISOWeek(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  const dayNum = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function monthKey(d) {
  return d.toLocaleString("en-US", { month: "short" }) + " " + d.getFullYear()
}

function weekdayIndex(d) {
  return d.getDay() // 0..6
}

function parseStartHour(time) {
  const m = _optionalChain([time, 'optionalAccess', _ => _.match, 'call', _2 => _2(/^(\d{2}):/)])
  return m ? Number(m[1]) : null
}

export default function AdminStatsPage() {
  // Pull raw bookings so we can filter and aggregate client-side safely
  const {
    data: bookingsData,
    isLoading,
    error,
  } = useSWR("/api/admin/bookings", fetcher, { refreshInterval: 4000 })

  const bookings = _nullishCoalesce(_optionalChain([bookingsData, 'optionalAccess', _3 => _3.bookings]), () => ( []))

  // Filters
  const [sport, setSport] = useState("all")
  const turfOptions = useMemo(() => {
    const s = new Set()
    for (const b of bookings) if (b.turf) s.add(b.turf)
    return Array.from(s)
  }, [bookings])
  const [turf, setTurf] = useState("all")
  const [range, setRange] = useState("7d")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")

  const now = startOfDay(new Date())

  const [rangeStart, rangeEnd] = useMemo(() => {
    if (range === "today") return [now, now]
    if (range === "7d") return [addDays(now, -6), now]
    if (range === "30d") return [addDays(now, -29), now]
    if (range === "custom" && start && end) {
      const s = startOfDay(toDate(start))
      const e = startOfDay(toDate(end))
      return [s, e]
    }
    return [addDays(now, -6), now]
  }, [range, start, end, now])

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      if (sport !== "all" && b.sport !== sport) return false
      if (turf !== "all" && b.turf !== turf) return false
      const d = toDate(b.date)
      return d >= rangeStart && d <= rangeEnd
    })
  }, [bookings, sport, turf, rangeStart, rangeEnd])

  // Today summary
  const todayBookings = useMemo(
    () => filtered.filter((b) => sameDay(toDate(b.date), now) && b.status === "active").length,
    [filtered, now],
  )
  const todayEarnings = useMemo(
    () =>
      filtered
        .filter((b) => sameDay(toDate(b.date), now) && b.status === "active")
        .reduce((sum, b) => sum + (_nullishCoalesce(b.amount, () => ( 0))), 0),
    [filtered, now],
  )

  // Build Daily (Last 7 days)
  const daily = useMemo(() => {
    const out = []
    for (let i = 6; i >= 0; i--) {
      const day = addDays(now, -i)
      const key = `${day.getDate()}/${day.getMonth() + 1}`
      const dayBookings = filtered.filter((b) => sameDay(toDate(b.date), day) && b.status === "active")
      out.push({
        key,
        bookings: dayBookings.length,
        earnings: dayBookings.reduce((sum, b) => sum + (_nullishCoalesce(b.amount, () => ( 0))), 0),
      })
    }
    return out
  }, [filtered, now])

  // Weekly (Last 8 weeks) - bookings only
  const weekly = useMemo(() => {
    const out = []
    for (let i = 7; i >= 0; i--) {
      const weekRef = addDays(now, -i * 7)
      const wk = getISOWeek(weekRef)
      const yr = weekRef.getFullYear()
      const key = `Wk ${wk}`
      const weekStart = addDays(weekRef, -((weekRef.getDay() + 6) % 7)) // Monday
      const weekEnd = addDays(weekStart, 6)
      const wkBookings = filtered.filter((b) => {
        const d = toDate(b.date)
        return d >= weekStart && d <= weekEnd && b.status === "active"
      })
      out.push({
        key,
        bookings: wkBookings.length,
        earnings: wkBookings.reduce((sum, b) => sum + (_nullishCoalesce(b.amount, () => ( 0))), 0),
      })
    }
    return out
  }, [filtered, now])

  // Monthly (Last 6 months) - combined
  const monthly = useMemo(() => {
    const out = []
    const cur = new Date(now.getFullYear(), now.getMonth(), 1)
    for (let i = 5; i >= 0; i--) {
      const mRef = new Date(cur.getFullYear(), cur.getMonth() - i, 1)
      const mStart = new Date(mRef.getFullYear(), mRef.getMonth(), 1)
      const mEnd = new Date(mRef.getFullYear(), mRef.getMonth() + 1, 0)
      const key = monthKey(mRef)
      const mBookings = filtered.filter((b) => {
        const d = toDate(b.date)
        return d >= mStart && d <= mEnd && b.status === "active"
      })
      out.push({
        key,
        bookings: mBookings.length,
        earnings: mBookings.reduce((sum, b) => sum + (_nullishCoalesce(b.amount, () => ( 0))), 0),
      })
    }
    return out
  }, [filtered, now])

  // CSV download of filtered bookings
  function downloadCSV() {
    const rows = [
      ["Booking ID", "Date", "Time", "Sport", "Customer", "Amount", "Status", "Source", "Turf"],
      ...filtered.map((b) => [
        b.id,
        b.date,
        b.time,
        b.sport,
        b.customer,
        String(_nullishCoalesce(b.amount, () => ( ""))),
        b.status,
        _nullishCoalesce(b.source, () => ( "")),
        _nullishCoalesce(b.turf, () => ( "")),
      ]),
    ]
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sportitup-report.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  // Lightweight printable PDF via window.print
  function downloadPDF() {
    const html = `
      <html>
        <head>
          <title>Sportitup Report</title>
          <style>
            body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, 'Helvetica Neue', Arial; padding: 24px; }
            h1 { margin: 0 0 8px 0; }
            h2 { margin-top: 24px; }
            table { border-collapse: collapse; width: 100%; margin-top: 12px; }
            th, td { border: 1px solid #e5e7eb; padding: 6px 8px; font-size: 12px; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Sportitup Report</h1>
          <div>Filters: Sport=${sport}, Turf=${turf}, Range=${range}</div>
          <h2>Summary</h2>
          <div>Today Bookings: ${todayBookings}</div>
          <div>Today Earnings: ₹ ${fmtINR(todayEarnings)}</div>
          <h2>Bookings (${filtered.length})</h2>
          <table>
            <thead>
              <tr><th>ID</th><th>Date</th><th>Time</th><th>Sport</th><th>Customer</th><th>Amount</th><th>Status</th><th>Source</th></tr>
            </thead>
            <tbody>
              ${filtered
                .map(
                  (b) =>
                    `<tr><td>${b.id}</td><td>${b.date}</td><td>${b.time}</td><td>${b.sport}</td><td>${b.customer}</td><td>${_nullishCoalesce(b.amount, () => ( ""))}</td><td>${b.status}</td><td>${_nullishCoalesce(b.source, () => ( ""))}</td></tr>`,
                )
                .join("")}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `
    const w = window.open("", "_blank")
    if (!w) return
    w.document.write(html)
    w.document.close()
  }

  // Payouts and insights
  const ownerEarnings = useMemo(
    () => filtered.filter((b) => b.status === "active").reduce((sum, b) => sum + (_nullishCoalesce(b.amount, () => ( 0))), 0),
    [filtered],
  )

  const insight = useMemo(() => {
    if (filtered.length === 0) return "Not enough data yet."
    const dayCounts = new Array(7).fill(0)
    const hourCounts = {}
    for (const b of filtered) {
      const d = toDate(b.date)
      dayCounts[weekdayIndex(d)]++
      const h = parseStartHour(b.time)
      if (h != null) {
        const bucket = `${String(h).padStart(2, "0")}-${String(h + 3).padStart(2, "0")}`
        hourCounts[bucket] = (hourCounts[bucket] || 0) + 1
      }
    }
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const topDayIdx = dayCounts.indexOf(Math.max(...dayCounts))
    const topWindow = _optionalChain([Object, 'access', _4 => _4.entries, 'call', _5 => _5(hourCounts), 'access', _6 => _6.sort, 'call', _7 => _7((a, b) => b[1] - a[1]), 'access', _8 => _8[0], 'optionalAccess', _9 => _9[0]]) || "17-20"
    return `Your bookings are highest on ${days[topDayIdx]} between ${topWindow.replace("-", ":00–")}:00.`
  }, [filtered])

  return (
    React.createElement(AdminShell, { title: "Stats & Earnings"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 307}}
      /* Filters */
      , React.createElement(Card, { className: "border-gray-200 mb-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}
        , React.createElement(CardContent, { className: "pt-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}
          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-5 gap-3 items-end"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 312}}
              , React.createElement('label', { className: "block text-sm text-gray-600 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}, "Sport")
              , React.createElement('select', {
                className: "h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"       ,
                value: sport,
                onChange: (e) => setSport(e.target.value ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 314}}

                , React.createElement('option', { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}, "All")
                , React.createElement('option', { value: "cricket", __self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}, "Cricket")
                , React.createElement('option', { value: "football", __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}, "Football")
                , React.createElement('option', { value: "pickleball", __self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}, "Pickleball")
              )
            )
            , turfOptions.length > 0 && (
              React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}
                , React.createElement('label', { className: "block text-sm text-gray-600 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}, "Turf")
                , React.createElement('select', {
                  className: "h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm capitalize"        ,
                  value: turf,
                  onChange: (e) => setTurf(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}

                  , React.createElement('option', { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}, "All")
                  , turfOptions.map((t) => (
                    React.createElement('option', { key: t, value: t, __self: this, __source: {fileName: _jsxFileName, lineNumber: 335}}
                      , t
                    )
                  ))
                )
              )
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 342}}
              , React.createElement('label', { className: "block text-sm text-gray-600 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}, "Date Range" )
              , React.createElement('select', {
                className: "h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"       ,
                value: range,
                onChange: (e) => setRange(e.target.value ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 344}}

                , React.createElement('option', { value: "today", __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}, "Today")
                , React.createElement('option', { value: "7d", __self: this, __source: {fileName: _jsxFileName, lineNumber: 350}}, "Last 7 Days"  )
                , React.createElement('option', { value: "30d", __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}, "Last 30 Days"  )
                , React.createElement('option', { value: "custom", __self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}, "Custom")
              )
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}
              , React.createElement('label', { className: "block text-sm text-gray-600 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 356}}, "Start")
              , React.createElement('input', {
                type: "date",
                className: "h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"       ,
                value: start,
                onChange: (e) => setStart(e.target.value),
                disabled: range !== "custom", __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}
              )
            )
            , React.createElement('div', { className: "flex gap-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 365}}
              , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 366}}
                , React.createElement('label', { className: "block text-sm text-gray-600 mb-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 367}}, "End")
                , React.createElement('input', {
                  type: "date",
                  className: "h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"       ,
                  value: end,
                  onChange: (e) => setEnd(e.target.value),
                  disabled: range !== "custom", __self: this, __source: {fileName: _jsxFileName, lineNumber: 368}}
                )
              )
              , React.createElement('div', { className: "flex items-end" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}
                , React.createElement(Button, { onClick: downloadCSV, className: "bg-green-600 hover:bg-green-700 text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}, "Download Report (CSV)"

                )
                , React.createElement(Button, { onClick: downloadPDF, className: "ml-3 bg-gray-800 hover:bg-black text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 380}}, "Download Report (PDF)"

                )
              )
            )
          )
        )
      )

      /* Payout summary */
      , React.createElement('div', { className: "grid grid-cols-1 gap-6 mb-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}
        , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}
          , React.createElement(CardHeader, { className: "pb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}}
            , React.createElement(CardTitle, { className: "text-sm font-medium text-gray-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 393}}, "Owner Earnings" )
          )
          , React.createElement(CardContent, { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}
            , React.createElement('div', { className: "text-3xl font-bold text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 396}}, "₹ " , fmtINR(ownerEarnings))
            , React.createElement(Badge, { className: "bg-green-600 text-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 397}}, "Earnings")
          )
        )
      )

      /* Summary cards */
      , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 403}}
        , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 404}}
          , React.createElement(CardHeader, { className: "pb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}
            , React.createElement(CardTitle, { className: "text-sm font-medium text-gray-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}}, "Today's Bookings" )
          )
          , React.createElement(CardContent, { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}
            , React.createElement('div', { className: "text-3xl font-bold text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}}, isLoading ? "—" : todayBookings)
            , React.createElement(Badge, { className: "bg-green-100 text-green-700 border-green-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}, "Daily")
          )
        )

        , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 414}}
          , React.createElement(CardHeader, { className: "pb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 415}}
            , React.createElement(CardTitle, { className: "text-sm font-medium text-gray-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 416}}, "Earnings (Today)" )
          )
          , React.createElement(CardContent, { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}
            , React.createElement('div', { className: "text-3xl font-bold text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 419}}, isLoading ? "₹ —" : `₹ ${fmtINR(todayEarnings)}`)
            , React.createElement(Badge, { className: "bg-green-100 text-green-700 border-green-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 420}}, "INR")
          )
        )

        , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
          , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 425}}
            , React.createElement(CardTitle, { className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 426}}, "Status")
          )
          , React.createElement(CardContent, { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 428}}
            , isLoading ? "Loading..." : error ? "Showing cached/empty data." : "Up to date."
          )
        )
      )

      /* Daily (line: bookings & earnings) */
      , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 435}}
        , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}
          , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}
            , React.createElement(CardTitle, { className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}, "Daily (Last 7 Days)"   )
          )
          , React.createElement(CardContent, { className: "h-64", __self: this, __source: {fileName: _jsxFileName, lineNumber: 440}}
            , isLoading ? (
              React.createElement('div', { className: "h-full w-full animate-pulse rounded-md bg-gray-100"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 442}} )
            ) : (
              React.createElement(ResponsiveContainer, { width: "100%", height: "100%", __self: this, __source: {fileName: _jsxFileName, lineNumber: 444}}
                , React.createElement(LineChart, { data: daily, margin: { top: 5, right: 10, left: 0, bottom: 0 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 445}}
                  , React.createElement(CartesianGrid, { strokeDasharray: "3 3" , stroke: "#e5e7eb", __self: this, __source: {fileName: _jsxFileName, lineNumber: 446}} )
                  , React.createElement(XAxis, { dataKey: "key", tick: { fontSize: 12 }, stroke: "#6b7280", __self: this, __source: {fileName: _jsxFileName, lineNumber: 447}} )
                  , React.createElement(YAxis, { tick: { fontSize: 12 }, stroke: "#6b7280", __self: this, __source: {fileName: _jsxFileName, lineNumber: 448}} )
                  , React.createElement(Tooltip, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 449}} )
                  , React.createElement(Legend, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 450}} )
                  , React.createElement(Line, {
                    type: "monotone",
                    dataKey: "bookings",
                    name: "Bookings",
                    stroke: "#16a34a",
                    strokeWidth: 2,
                    dot: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}}
                  )
                  , React.createElement(Line, {
                    type: "monotone",
                    dataKey: "earnings",
                    name: "Earnings (₹)" ,
                    stroke: "#2563eb",
                    strokeWidth: 2,
                    dot: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 459}}
                  )
                )
              )
            )
          )
        )

        /* Weekly (bar: bookings) */
        , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 474}}
          , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 475}}
            , React.createElement(CardTitle, { className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 476}}, "Weekly (Last 8 Weeks)"   )
          )
          , React.createElement(CardContent, { className: "h-64", __self: this, __source: {fileName: _jsxFileName, lineNumber: 478}}
            , isLoading ? (
              React.createElement('div', { className: "h-full w-full animate-pulse rounded-md bg-gray-100"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 480}} )
            ) : (
              React.createElement(ResponsiveContainer, { width: "100%", height: "100%", __self: this, __source: {fileName: _jsxFileName, lineNumber: 482}}
                , React.createElement(BarChart, { data: weekly, margin: { top: 5, right: 10, left: 0, bottom: 0 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 483}}
                  , React.createElement(CartesianGrid, { strokeDasharray: "3 3" , stroke: "#e5e7eb", __self: this, __source: {fileName: _jsxFileName, lineNumber: 484}} )
                  , React.createElement(XAxis, { dataKey: "key", tick: { fontSize: 12 }, stroke: "#6b7280", __self: this, __source: {fileName: _jsxFileName, lineNumber: 485}} )
                  , React.createElement(YAxis, { tick: { fontSize: 12 }, stroke: "#6b7280", __self: this, __source: {fileName: _jsxFileName, lineNumber: 486}} )
                  , React.createElement(Tooltip, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 487}} )
                  , React.createElement(Bar, { dataKey: "bookings", name: "Bookings", fill: "#16a34a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 488}} )
                )
              )
            )
          )
        )
      )

      /* Monthly (combined line + bar) */
      , React.createElement('div', { className: "grid grid-cols-1 gap-6 mt-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 497}}
        , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 498}}
          , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 499}}
            , React.createElement(CardTitle, { className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 500}}, "Monthly (Last 6 Months)"   )
          )
          , React.createElement(CardContent, { className: "h-72", __self: this, __source: {fileName: _jsxFileName, lineNumber: 502}}
            , isLoading ? (
              React.createElement('div', { className: "h-full w-full animate-pulse rounded-md bg-gray-100"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 504}} )
            ) : (
              React.createElement(ResponsiveContainer, { width: "100%", height: "100%", __self: this, __source: {fileName: _jsxFileName, lineNumber: 506}}
                , React.createElement(BarChart, { data: monthly, margin: { top: 5, right: 10, left: 0, bottom: 0 }, __self: this, __source: {fileName: _jsxFileName, lineNumber: 507}}
                  , React.createElement(CartesianGrid, { strokeDasharray: "3 3" , stroke: "#e5e7eb", __self: this, __source: {fileName: _jsxFileName, lineNumber: 508}} )
                  , React.createElement(XAxis, { dataKey: "key", tick: { fontSize: 12 }, stroke: "#6b7280", __self: this, __source: {fileName: _jsxFileName, lineNumber: 509}} )
                  , React.createElement(YAxis, { tick: { fontSize: 12 }, stroke: "#6b7280", __self: this, __source: {fileName: _jsxFileName, lineNumber: 510}} )
                  , React.createElement(Tooltip, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 511}} )
                  , React.createElement(Legend, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 512}} )
                  , React.createElement(Bar, { dataKey: "bookings", name: "Bookings", fill: "#16a34a", __self: this, __source: {fileName: _jsxFileName, lineNumber: 513}} )
                  , React.createElement(Line, {
                    type: "monotone",
                    dataKey: "earnings",
                    name: "Earnings (₹)" ,
                    stroke: "#2563eb",
                    strokeWidth: 2,
                    dot: false, __self: this, __source: {fileName: _jsxFileName, lineNumber: 514}}
                  )
                )
              )
            )
          )
        )
      )

      /* Simple insight */
      , React.createElement('div', { className: "mt-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 530}}
        , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 531}}
          , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 532}}
            , React.createElement(CardTitle, { className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 533}}, "Insights")
          )
          , React.createElement(CardContent, { className: "text-gray-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 535}}, insight)
        )
      )
    )
  )
}
