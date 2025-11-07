"use client"
const _jsxFileName = "components\\payment\\upi-qr.tsx";

import React from "react";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Copy, Check, Smartphone } from "lucide-react"

export function UpiQr({ upiId, amount, merchantName = "SportItUp", qrImageUrl }) {
  const [copied, setCopied] = useState(false)

  const amountFixed = Number.isFinite(amount) ? amount.toFixed(2) : "0.00"
  const upiDeepLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    merchantName,
  )}&am=${encodeURIComponent(amountFixed)}&cu=INR&tn=${encodeURIComponent(`Advance payment - ${merchantName}`)}`
  const qrImage =
    qrImageUrl ||
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-01%20at%2023.06.08_fca08271.jpg-cgfljgM2yZ3Y6kZbARvAAvWM97QD6y.jpeg"

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (e) {
      // ignore
    }
  }

  return (
    React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 38}}
      , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}
        , React.createElement(CardTitle, { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}, "UPI QR (Alternate Payment)"   )
      )
      , React.createElement(CardContent, { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}
        , React.createElement('div', { className: "flex flex-col items-center gap-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 43}}
          , React.createElement('img', {
            src: qrImage || "/placeholder.svg",
            alt: `Scan to pay via UPI to ${upiId}`,
            className: "w-full max-w-xs rounded-md border"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
          )
          , React.createElement('p', { className: "text-sm text-muted-foreground text-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}, "Scan the QR in any UPI app or tap the button below. Make sure the amount is ₹"
                             , amountFixed, "."
          )
          , React.createElement('p', { className: "text-xs text-center text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}, "Paying to: "
              , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}, upiId)
          )
        )

        , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 57}}
          , React.createElement(Input, { readOnly: true, value: upiId, 'aria-label': "UPI ID" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}} )
          , React.createElement(Button, { type: "button", variant: "outline", className: "bg-transparent", onClick: onCopy, 'aria-label': "Copy UPI ID"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
            , copied ? React.createElement(Check, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}} ) : React.createElement(Copy, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}} )
            , copied ? "Copied" : "Copy"
          )
        )

        , React.createElement('a', { href: upiDeepLink, __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
          , React.createElement(Button, { className: "w-full", __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
            , React.createElement(Smartphone, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}} ), "Pay ₹"
             , amountFixed, " in UPI app"
          )
        )

        , React.createElement('p', { className: "text-xs text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}, "Note: UPI QR is provided for convenience. If you pay by QR, please complete the on-screen steps so we can confirm your booking."


        )
      )
    )
  )
}

export default UpiQr
