"use client"
import React from "react"
const _jsxFileName = "app\\owner\\login\\page.tsx";



import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function OwnerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("owner@sportitup.in")
  const [password, setPassword] = useState("OwN3r!2025#") // strong demo password
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/owner/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // ensure Set-Cookie is applied
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        if (res.status === 401) setError("Password incorrect")
        else setError("Password incorrect")
        return
      }
      if (typeof window !== "undefined") {
        window.location.replace("/admin")
        return
      }
      router.replace("/admin")
    } catch (err) {
      setError("Password incorrect")
    } finally {
      setLoading(false)
    }
  }

  return (
    React.createElement('main', { className: "min-h-screen bg-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
      , React.createElement('header', { className: "border-b border-gray-200 bg-white sticky top-0 z-40"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}
        , React.createElement('div', { className: "container mx-auto px-4 py-4 flex items-center justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
          , React.createElement(Link, { href: "/", className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
            , React.createElement('img', { src: "/sportitupp-removebg-preview.png", alt: "SportItUp", className: "h-36 md:h-44 w-auto"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}} )
          )
          , React.createElement(Link, { href: "/", className: "text-sm text-gray-600 hover:text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}, "Home"

          )
        )
      )

      , React.createElement('section', { className: "container mx-auto px-4 py-10"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
        , React.createElement('div', { className: "max-w-md mx-auto" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
          , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
            , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
              , React.createElement(CardTitle, { className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}, "Owner Login" )
              , React.createElement(CardDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}, "Demo credentials are pre-filled."   )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}
              , React.createElement('form', { onSubmit: onSubmit, className: "space-y-4", autoComplete: "off", __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}
                , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 70}}
                  , React.createElement(Label, { htmlFor: "email", __self: this, __source: {fileName: _jsxFileName, lineNumber: 71}}, "Email")
                  , React.createElement(Input, {
                    id: "email",
                    type: "email",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    required: true,
                    autoComplete: "off", __self: this, __source: {fileName: _jsxFileName, lineNumber: 72}}
                  )
                )
                , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
                  , React.createElement(Label, { htmlFor: "password", __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}}, "Password")
                  , React.createElement(Input, {
                    id: "password",
                    type: "password",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    required: true,
                    autoComplete: "new-password", __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}}
                  )
                )
                , error && React.createElement('p', { className: "text-sm text-red-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}, error)
                , React.createElement(Button, { type: "submit", className: "w-full bg-green-600 hover:bg-green-700 text-white"   , disabled: loading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}
                  , loading ? "Signing in..." : "Sign In"
                )
                , React.createElement('div', { className: "mt-3 text-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}
                  , React.createElement(Link, { href: "/owner/forgot-password", className: "text-sm text-green-700 hover:underline"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}, "Forgot password?"

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
