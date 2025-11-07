"use client"
import React from "react"
const _jsxFileName = "app\\admin\\bookings\\page.tsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }



import { AdminShell } from "@/components/admin/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useSWR from "swr"
import { useMemo, useState } from "react"












const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json())

function fmtINR(n) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(_nullishCoalesce(n, () => ( 0)))
}

export default function AdminBookingsPage() {
  const { data, mutate, isLoading } = useSWR("/api/admin/bookings", fetcher, {
    refreshInterval: 4000,
  })
  const [form, setForm] = useState({ date: "", time: "", sport: "cricket", customer: "", amount: "" })
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState






({
    date: "",
    time: "",
    sport: "cricket",
    customer: "",
    amount: "",
    status: "active",
  })

  const [filterSport, setFilterSport] = useState("all")
  const [filterTime, setFilterTime] = useState("")
  const [search, setSearch] = useState("")

  async function addBooking(e) {
    e.preventDefault()
    setSubmitting(true)
    await fetch("/api/admin/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: form.date,
        time: form.time,
        sport: form.sport,
        customer: form.customer,
        amount: form.amount ? Number(form.amount) : undefined,
      }),
      credentials: "include",
    })
    setSubmitting(false)
    setForm({ date: "", time: "", sport: "cricket", customer: "", amount: "" })
    mutate()
  }

  function startEdit(b) {
    setEditingId(b.id)
    setEditForm({
      date: b.date,
      time: b.time,
      sport: b.sport,
      customer: b.customer,
      amount: b.amount != null ? String(b.amount) : "",
      status: b.status,
    })
  }

  async function saveEdit(e) {
    e.preventDefault()
    if (!editingId) return
    await fetch(`/api/admin/bookings/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: editForm.date,
        time: editForm.time,
        sport: editForm.sport,
        customer: editForm.customer,
        amount: editForm.amount ? Number(editForm.amount) : undefined,
        status: editForm.status,
      }),
      credentials: "include",
    })
    setEditingId(null)
    await mutate()
  }

  function cancelEdit() {
    setEditingId(null)
  }

  async function cancelBooking(id) {
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE", credentials: "include" })
    mutate()
  }

  const bookings = _optionalChain([data, 'optionalAccess', _ => _.bookings]) || []

  const view = useMemo(() => {
    return bookings.filter((b) => {
      if (filterSport !== "all" && b.sport !== filterSport) return false
      if (filterTime && !b.time.toLowerCase().includes(filterTime.toLowerCase())) return false
      if (search) {
        const q = search.toLowerCase()
        const hay = [b.id, b.customer, b.date, b.time, b.sport, _nullishCoalesce(b.amount, () => ( ""))].join(" ").toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [bookings, filterSport, filterTime, search])

  return (
    React.createElement(AdminShell, { title: "Bookings", __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}
      , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}
        , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}
          , React.createElement(CardTitle, { className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}, "All Bookings" )
        )
        , React.createElement(CardContent, { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}
          /* Add Booking */
          , React.createElement('form', { onSubmit: addBooking, className: "grid grid-cols-1 md:grid-cols-6 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}
            , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}
              , React.createElement(Label, { htmlFor: "date", __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}}, "Date")
              , React.createElement(Input, {
                id: "date",
                type: "date",
                value: form.date,
                onChange: (e) => setForm((f) => ({ ...f, date: e.target.value })),
                required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}}
              )
            )
            , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}
              , React.createElement(Label, { htmlFor: "time", __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}, "Time")
              , React.createElement(Input, {
                id: "time",
                placeholder: "06:00-07:00",
                value: form.time,
                onChange: (e) => setForm((f) => ({ ...f, time: e.target.value })),
                required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}
              )
            )
            , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 164}}
              , React.createElement(Label, { htmlFor: "sport", __self: this, __source: {fileName: _jsxFileName, lineNumber: 165}}, "Sport")
              , React.createElement('select', {
                id: "sport",
                className: "h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"       ,
                value: form.sport,
                onChange: (e) => setForm((f) => ({ ...f, sport: e.target.value  })), __self: this, __source: {fileName: _jsxFileName, lineNumber: 166}}

                , React.createElement('option', { value: "cricket", __self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}, "Cricket")
                , React.createElement('option', { value: "football", __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}, "Football")
                , React.createElement('option', { value: "pickleball", __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}, "Pickleball")
              )
            )
            , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
              , React.createElement(Label, { htmlFor: "customer", __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}, "Customer")
              , React.createElement(Input, {
                id: "customer",
                value: form.customer,
                onChange: (e) => setForm((f) => ({ ...f, customer: e.target.value })),
                required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}
              )
            )
            , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
              , React.createElement(Label, { htmlFor: "amount", __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}, "Amount Paid in Advance (₹)"    )
              , React.createElement(Input, {
                id: "amount",
                type: "number",
                value: form.amount,
                onChange: (e) => setForm((f) => ({ ...f, amount: e.target.value })), __self: this, __source: {fileName: _jsxFileName, lineNumber: 188}}
              )
            )
            , React.createElement('div', { className: "flex items-end" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
              , React.createElement(Button, { type: "submit", className: "w-full bg-green-600 hover:bg-green-700 text-white"   , disabled: submitting, __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
                , submitting ? "Adding..." : "Add Booking"
              )
            )
          )

          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-4 gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 203}}
              , React.createElement(Label, { className: "text-sm text-gray-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}, "Sport")
              , React.createElement('select', {
                className: "h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"       ,
                value: filterSport,
                onChange: (e) => setFilterSport(e.target.value ), __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}

                , React.createElement('option', { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}, "All")
                , React.createElement('option', { value: "cricket", __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}, "Cricket")
                , React.createElement('option', { value: "football", __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}, "Football")
                , React.createElement('option', { value: "pickleball", __self: this, __source: {fileName: _jsxFileName, lineNumber: 213}}, "Pickleball")
              )
            )
            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
              , React.createElement(Label, { className: "text-sm text-gray-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}, "Time")
              , React.createElement(Input, { placeholder: "e.g. 18:00" , value: filterTime, onChange: (e) => setFilterTime(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}} )
            )
            , React.createElement('div', { className: "md:col-span-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 220}}
              , React.createElement(Label, { className: "text-sm text-gray-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}, "Search")
              , React.createElement(Input, {
                placeholder: "Search by ID, customer, date, time…"     ,
                value: search,
                onChange: (e) => setSearch(e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}
              )
            )
          )

          , editingId && (
            React.createElement('form', {
              onSubmit: saveEdit,
              className: "grid grid-cols-1 md:grid-cols-7 gap-3 border border-gray-200 p-3 rounded-md"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}}

              , React.createElement('div', { className: "md:col-span-7 text-sm text-gray-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}, "Editing Booking: "
                  , React.createElement('span', { className: "font-mono", __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}, editingId)
              )
              , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}
                , React.createElement(Label, { htmlFor: "edit-date", __self: this, __source: {fileName: _jsxFileName, lineNumber: 239}}, "Date")
                , React.createElement(Input, {
                  id: "edit-date",
                  type: "date",
                  value: editForm.date,
                  onChange: (e) => setEditForm((f) => ({ ...f, date: e.target.value })),
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 240}}
                )
              )
              , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}
                , React.createElement(Label, { htmlFor: "edit-time", __self: this, __source: {fileName: _jsxFileName, lineNumber: 249}}, "Time")
                , React.createElement(Input, {
                  id: "edit-time",
                  placeholder: "06:00-07:00",
                  value: editForm.time,
                  onChange: (e) => setEditForm((f) => ({ ...f, time: e.target.value })),
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}
                )
              )
              , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 258}}
                , React.createElement(Label, { htmlFor: "edit-sport", __self: this, __source: {fileName: _jsxFileName, lineNumber: 259}}, "Sport")
                , React.createElement('select', {
                  id: "edit-sport",
                  className: "h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"       ,
                  value: editForm.sport,
                  onChange: (e) => setEditForm((f) => ({ ...f, sport: e.target.value  })), __self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}

                  , React.createElement('option', { value: "cricket", __self: this, __source: {fileName: _jsxFileName, lineNumber: 266}}, "Cricket")
                  , React.createElement('option', { value: "football", __self: this, __source: {fileName: _jsxFileName, lineNumber: 267}}, "Football")
                  , React.createElement('option', { value: "pickleball", __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}, "Pickleball")
                )
              )
              , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 271}}
                , React.createElement(Label, { htmlFor: "edit-customer", __self: this, __source: {fileName: _jsxFileName, lineNumber: 272}}, "Customer")
                , React.createElement(Input, {
                  id: "edit-customer",
                  value: editForm.customer,
                  onChange: (e) => setEditForm((f) => ({ ...f, customer: e.target.value })),
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 273}}
                )
              )
              , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}
                , React.createElement(Label, { htmlFor: "edit-amount", __self: this, __source: {fileName: _jsxFileName, lineNumber: 281}}, "Amount Paid in Advance (₹)"    )
                , React.createElement(Input, {
                  id: "edit-amount",
                  type: "number",
                  value: editForm.amount,
                  onChange: (e) => setEditForm((f) => ({ ...f, amount: e.target.value })), __self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}
                )
              )
              , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}}
                , React.createElement(Label, { htmlFor: "edit-status", __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}}, "Status")
                , React.createElement('select', {
                  id: "edit-status",
                  className: "h-9 w-full rounded-md border border-gray-200 bg-transparent px-3 text-sm"       ,
                  value: editForm.status,
                  onChange: (e) => setEditForm((f) => ({ ...f, status: e.target.value  })), __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}

                  , React.createElement('option', { value: "active", __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}}, "Active")
                  , React.createElement('option', { value: "canceled", __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}, "Canceled")
                )
              )
              , React.createElement('div', { className: "flex items-end gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 301}}
                , React.createElement(Button, { type: "submit", className: "bg-green-600 hover:bg-green-700 text-white"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}, "Save"

                )
                , React.createElement(Button, {
                  type: "button",
                  variant: "outline",
                  className: "border-gray-200 text-black bg-transparent"  ,
                  onClick: cancelEdit, __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}
, "Cancel"

                )
              )
            )
          )

          , React.createElement(Table, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 317}}
            , React.createElement(TableHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 318}}
              , React.createElement(TableRow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 319}}
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 320}}, "Booking ID" )
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}, "Date")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}, "Time")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}, "Sport")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 324}}, "Customer")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 325}}, "Amount Paid in Advance"   )
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 326}}, "Status")
                , React.createElement(TableHead, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}, "Source")
                , React.createElement(TableHead, { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}, "Actions")
              )
            )
            , React.createElement(TableBody, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}
              , isLoading ? (
                React.createElement(TableRow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 333}}
                  , React.createElement(TableCell, { colSpan: 8, className: "text-center text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 334}}, "Loading..."

                  )
                )
              ) : view.length === 0 ? (
                React.createElement(TableRow, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 339}}
                  , React.createElement(TableCell, { colSpan: 8, className: "text-center text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}, "No bookings found."

                  )
                )
              ) : (
                view.map((b) => {
                  return (
                    React.createElement(TableRow, { key: b.id, __self: this, __source: {fileName: _jsxFileName, lineNumber: 347}}
                      , React.createElement(TableCell, { className: "font-mono text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}, b.id)
                      , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}, b.date)
                      , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 350}}, b.time)
                      , React.createElement(TableCell, { className: "capitalize", __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}, b.sport)
                      , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 352}}, b.customer)
                      , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}, "₹ " , fmtINR(_nullishCoalesce(b.amount, () => ( 0))))
                      , React.createElement(TableCell, { className: b.status === "active" ? "text-green-700" : "text-gray-500", __self: this, __source: {fileName: _jsxFileName, lineNumber: 354}}
                        , b.status
                      )
                      , React.createElement(TableCell, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}, b.source || "admin")
                      , React.createElement(TableCell, { className: "text-right space-x-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 358}}
                        , React.createElement(Button, {
                          variant: "outline",
                          size: "sm",
                          className: "border-gray-200 text-black bg-transparent"  ,
                          onClick: () => startEdit(b), __self: this, __source: {fileName: _jsxFileName, lineNumber: 359}}
, "Edit"

                        )
                        , React.createElement(Button, {
                          variant: "destructive",
                          size: "sm",
                          onClick: () => cancelBooking(b.id),
                          disabled: b.status !== "active", __self: this, __source: {fileName: _jsxFileName, lineNumber: 367}}
, "Cancel"

                        )
                      )
                    )
                  )
                })
              )
            )
          )
        )
      )
    )
  )
}
