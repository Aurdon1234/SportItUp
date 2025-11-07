"use client"
import React from "react"
const _jsxFileName = "app\\booking\\success\\page.tsx";

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Trophy, MapPin, Calendar, Clock, Download, Share2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function BookingSuccessPage() {
  const searchParams = useSearchParams()
  const [bookingData, setBookingData] = useState(null)

  useEffect(() => {
    const dataParam = searchParams.get("data")
    if (dataParam) {
      try {
        const data = JSON.parse(dataParam)
        setBookingData(data)
      } catch (error) {
        console.error("Error parsing booking data:", error)
      }
    }
  }, [searchParams])

  if (!bookingData) {
    return (
      React.createElement('div', { className: "min-h-screen bg-background flex items-center justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 29}}
        , React.createElement('div', { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 30}}
          , React.createElement('h2', { className: "text-2xl font-bold mb-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 31}}, "Loading...")
          , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}, "Please wait while we load your booking details."       )
        )
      )
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":")
    const hour = Number.parseInt(hours)
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    React.createElement('div', { className: "min-h-screen bg-background" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}
      /* Header */
      , React.createElement('header', { className: "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}
        , React.createElement('div', { className: "container mx-auto px-4 py-4 flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
          , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
            , React.createElement('div', { className: "w-8 h-8 bg-primary rounded-full flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
              , React.createElement(Trophy, { className: "w-5 h-5 text-primary-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}} )
            )
            , React.createElement('span', { className: "text-xl font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}, "SportItUp")
          )
        )
      )

      , React.createElement('div', { className: "container mx-auto px-4 py-8 max-w-2xl"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
        /* Success Message */
        , React.createElement('div', { className: "text-center mb-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}
          , React.createElement('div', { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}
            , React.createElement(CheckCircle, { className: "w-8 h-8 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}} )
          )
          , React.createElement('h1', { className: "text-3xl font-bold text-green-600 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}, "Booking Confirmed!" )
          , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}, "Your slot has been successfully booked"     )
        )

        /* Booking Details */
        , React.createElement(Card, { className: "mb-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}
          , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
            , React.createElement(CardTitle, { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}, "Booking Details" )
              , React.createElement(Badge, { variant: "outline", className: "bg-green-50 text-green-700 border-green-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}, "Confirmed"

              )
            )
          )
          , React.createElement(CardContent, { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}
            , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}
              , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}
                  , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}, "Booking ID" )
                  , React.createElement('p', { className: "font-mono font-medium text-lg"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}, bookingData.bookingId)
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}
                  , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}, "Venue")
                  , React.createElement('p', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}, bookingData.turfName)
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
                  , React.createElement('p', { className: "text-sm text-muted-foreground flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
                    , React.createElement(MapPin, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}} ), "Location"

                  )
                  , React.createElement('p', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 105}}, bookingData.location)
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}
                  , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}, "Sport")
                  , React.createElement(Badge, { variant: "outline", __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}}, bookingData.sport)
                )
              )
              , React.createElement('div', { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}
                  , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}, "Payment ID" )
                  , React.createElement('p', { className: "font-mono text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}}, bookingData.paymentId)
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
                  , React.createElement('p', { className: "text-sm text-muted-foreground flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
                    , React.createElement(Calendar, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}} ), "Date"

                  )
                  , React.createElement('p', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, formatDate(bookingData.date))
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
                  , React.createElement('p', { className: "text-sm text-muted-foreground flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
                    , React.createElement(Clock, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}} ), "Time Slot"

                  )
                  , React.createElement('p', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 129}}
                    , formatTime(bookingData.timeSlot), " -" , " "
                    , formatTime(
                      (Number.parseInt(bookingData.timeSlot.split(":")[0]) + 1).toString().padStart(2, "0") + ":00",
                    )
                  )
                )
                , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 136}}
                  , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 137}}, "Duration")
                  , React.createElement('p', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}, "1 Hour" )
                )
              )
            )
          )
        )

        /* Payment Summary */
        , React.createElement(Card, { className: "mb-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}}
          , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}
            , React.createElement(CardTitle, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}, "Payment Summary" )
          )
          , React.createElement(CardContent, { className: "space-y-3", __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}
            , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}
              , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}, "Total Amount" )
              , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}, "₹", bookingData.totalAmount)
            )
            , React.createElement('div', { className: "flex justify-between text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}, "Paid Online (10%)"  )
              , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 157}}, "₹", bookingData.advanceAmount)
            )
            , React.createElement('div', { className: "flex justify-between text-orange-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}, "Pay at Venue (90%)"   )
              , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}, "₹", bookingData.remainingAmount)
            )
          )
        )

        /* Important Instructions */
        , React.createElement(Card, { className: "mb-6 border-orange-200 bg-orange-50"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 167}}
          , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}
            , React.createElement(CardTitle, { className: "text-orange-800", __self: this, __source: {fileName: _jsxFileName, lineNumber: 169}}, "Important Instructions" )
          )
          , React.createElement(CardContent, { className: "space-y-2 text-sm text-orange-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 172}}, "• Please arrive 10 minutes before your slot time"        )
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}, "• Carry this booking confirmation (screenshot or print)"       )
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}, "• Pay remaining ₹"   , bookingData.remainingAmount, " at the venue"   )
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}, "• Cancellation allowed up to 2 hours before slot"        )
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 176}}, "• Contact venue directly for any queries"      )
          )
        )

        /* Action Buttons */
        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
          , React.createElement(Button, { variant: "outline", className: "h-12 bg-transparent" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}}
            , React.createElement(Download, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 183}} ), "Download Receipt"

          )
          , React.createElement(Button, { variant: "outline", className: "h-12 bg-transparent" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 186}}
            , React.createElement(Share2, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}} ), "Share Booking"

          )
        )

        /* Navigation Buttons */
        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}
          , React.createElement(Link, { href: "/locations", __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}
            , React.createElement(Button, { variant: "outline", className: "w-full h-12 bg-transparent"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}, "Book Another Slot"

            )
          )
          , React.createElement(Link, { href: "/", __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}
            , React.createElement(Button, { className: "w-full h-12" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}, "Back to Home"  )
          )
        )

        /* Support */
        , React.createElement('div', { className: "mt-8 text-center text-sm text-muted-foreground"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}
          , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}, "Need help with your booking?"    )
          , React.createElement('p', { className: "mt-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 207}}, "Call us at "
               , React.createElement('span', { className: "font-medium text-primary" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}, "+91 98765 43210"  ), " or"
            , React.createElement(Link, { href: "/support", className: "text-primary hover:underline ml-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 209}}, "Contact Support"

            )
          )
        )
      )
    )
  )
}
