"use client"
const _jsxFileName = "components\\admin\\notifications-center.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

import { useEffect, useRef, useState } from "react"
import useSWR from "swr"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"











const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json())

export default function NotificationsCenter() {
  const { data } = useSWR("/api/admin/bookings", fetcher, { refreshInterval: 4000 })
  const bookings = Array.isArray(_optionalChain([data, 'optionalAccess', _ => _.bookings])) ? data.bookings : []
  const prev = useRef(new Map())
  const [items, setItems] = useState([])
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const cur = new Map(bookings.map((b) => [b.id, b]))
    // new or status changes
    for (const [id, b] of cur) {
      if (!prev.current.has(id)) {
        setItems((arr) =>
          [`New booking ${b.sport || ""} ${b.date} ${b.time} (${b.source || "online"})`, ...arr].slice(0, 20),
        )
        setUnread((u) => u + 1)
      } else {
        const before = prev.current.get(id)
        if (before.status !== b.status) {
          setItems((arr) => [`Booking ${b.status} for ${b.date} ${b.time}`, ...arr].slice(0, 20))
          setUnread((u) => u + 1)
        }
      }
    }
    // cancellations (removed)
    for (const [id] of prev.current) {
      if (!cur.has(id)) {
        setItems((arr) => [`Booking cancelled (${id})`, ...arr].slice(0, 20))
        setUnread((u) => u + 1)
      }
    }
    prev.current = cur
  }, [bookings])

  return (
    React.createElement(DropdownMenu, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
      , React.createElement(DropdownMenuTrigger, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
        , React.createElement(Button, { variant: "ghost", className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
          , React.createElement(Bell, { className: "h-5 w-5" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}} )
          , unread > 0 && (
            React.createElement(Badge, { className: "absolute -top-1 -right-1 px-1 py-0 text-[10px] bg-red-600 text-white"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}, unread)
          )
        )
      )
      , React.createElement(DropdownMenuContent, { align: "end", className: "w-80", __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
        , React.createElement(DropdownMenuLabel, { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}, "Notifications"

          , React.createElement(Button, { size: "sm", variant: "outline", onClick: () => setUnread(0), __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}, "Mark all read"

          )
        )
        , React.createElement(DropdownMenuSeparator, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 80}} )
        , items.length === 0 ? (
          React.createElement(DropdownMenuItem, { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}, "No notifications" )
        ) : (
          items.map((t, i) => (
            React.createElement(DropdownMenuItem, { key: i, className: "whitespace-normal leading-snug" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
              , t
            )
          ))
        )
      )
    )
  )
}
