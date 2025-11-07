"use client";

import { AdminShell } from "@/components/admin/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CalendarClock, IndianRupee, Activity } from "lucide-react"

export default function AdminDashboardPage() {
  return (
    React.createElement(AdminShell, { title: "Dashboard", __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}
      , React.createElement(Alert, { className: "mb-6 border-green-200" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
        , React.createElement(AlertTitle, { className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}, "Owner access coming soon"   )
        , React.createElement(AlertDescription, { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}, "Secure login and permissions will be added in the next steps. These stats are placeholders."

        )
      )

      , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}
        , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
          , React.createElement(CardHeader, { className: "pb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}}
            , React.createElement(CardTitle, { className: "text-sm font-medium text-gray-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}, "Today's Bookings" )
          )
          , React.createElement(CardContent, { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
            , React.createElement('div', { className: "text-3xl font-bold text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, "—")
            , React.createElement(CalendarClock, { className: "h-6 w-6 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}} )
          )
        )

        , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}
          , React.createElement(CardHeader, { className: "pb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}
            , React.createElement(CardTitle, { className: "text-sm font-medium text-gray-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}, "Earnings (Today)" )
          )
          , React.createElement(CardContent, { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
            , React.createElement('div', { className: "text-3xl font-bold text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}, "₹ —" )
            , React.createElement(IndianRupee, { className: "h-6 w-6 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}} )
          )
        )

        , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}
          , React.createElement(CardHeader, { className: "pb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}
            , React.createElement(CardTitle, { className: "text-sm font-medium text-gray-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}, "Utilization")
          )
          , React.createElement(CardContent, { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
            , React.createElement('div', { className: "text-3xl font-bold text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}, "—%")
            , React.createElement(Activity, { className: "h-6 w-6 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}} )
          )
        )
      )

      , React.createElement('div', { className: "mt-8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
        , React.createElement(Badge, { className: "bg-green-100 text-green-700 border-green-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}, "Getting Started" )
        , React.createElement('p', { className: "mt-3 text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}, "Next we'll connect a database, add owner authentication, and wire up bookings and availability."

        )
      )
    )
  )
}
