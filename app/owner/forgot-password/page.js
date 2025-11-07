"use client"
import React from "react"
const _jsxFileName = "app\\owner\\forgot-password\\page.tsx";



import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function OwnerForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    React.createElement('main', { className: "min-h-screen bg-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}
      , React.createElement('header', { className: "border-b border-gray-200 bg-white sticky top-0 z-40"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 23}}
        , React.createElement('div', { className: "container mx-auto px-4 py-4 flex items-center justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
          , React.createElement(Link, { href: "/", className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}
            , React.createElement('img', { src: "/sportitupp-removebg-preview.png", alt: "SportItUp", className: "h-20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 26}} )
          )
          , React.createElement(Link, { href: "/owner/login", className: "text-sm text-gray-600 hover:text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 28}}, "Back to Owner Login"

          )
        )
      )

      , React.createElement('section', { className: "container mx-auto px-4 py-10"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
        , React.createElement('div', { className: "max-w-md mx-auto" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}
          , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}
            , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}
              , React.createElement(CardTitle, { className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 38}}, "Reset Owner Password"  )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}
              , sent ? (
                React.createElement('p', { className: "text-green-700", __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}, "If an account exists for "
                       , email || "your email", ", a reset link has been sent."
                )
              ) : (
                React.createElement('form', { onSubmit: onSubmit, className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}
                    , React.createElement(Label, { htmlFor: "email", __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}, "Owner Email" )
                    , React.createElement(Input, { id: "email", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}} )
                  )
                  , React.createElement(Button, { type: "submit", className: "w-full bg-green-600 hover:bg-green-700 text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}, "Send Reset Link"

                  )
                )
              )
            )
          )
        )
      )
    )
  )
}
