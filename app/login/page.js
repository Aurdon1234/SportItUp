"use client"
import React from "react"
const _jsxFileName = "app\\login\\page.tsx";


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

const DEMO_EMAIL = "demo@sportitup.in"
const DEMO_PASSWORD = "user1234"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    setTimeout(() => {
      // Simple demo validation to surface "Password incorrect" in red
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        window.location.href = "/locations"
      } else {
        setError("Password incorrect")
      }
      setIsLoading(false)
    }, 800)
  }

  return (
    React.createElement('div', { className: "min-h-screen bg-background flex items-center justify-center p-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}
      , React.createElement(Card, { className: "w-full max-w-md" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 40}}
        , React.createElement(CardHeader, { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}
          , React.createElement('div', { className: "flex items-center justify-center space-x-2 mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}
            , React.createElement('div', { className: "w-10 h-10 bg-primary rounded-full flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 43}}
              , React.createElement(Trophy, { className: "w-6 h-6 text-primary-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}} )
            )
            , React.createElement('span', { className: "text-2xl font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}, "SportItUp")
          )
          , React.createElement(CardTitle, { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}}, "Welcome Back" )
          , React.createElement(CardDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}, "Sign in to book your favorite sports venues"       )
        )
        , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
          , React.createElement('form', { onSubmit: handleLogin, className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}
              , React.createElement(Label, { htmlFor: "email", __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}}, "Email")
              , React.createElement(Input, {
                id: "email",
                type: "email",
                placeholder: "Enter your email"  ,
                value: email,
                onChange: (e) => setEmail(e.target.value),
                required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 55}}
              )
            )
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
              , React.createElement(Label, { htmlFor: "password", __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}, "Password")
              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
                , React.createElement(Input, {
                  id: "password",
                  type: showPassword ? "text" : "password",
                  placeholder: "Enter your password"  ,
                  value: password,
                  onChange: (e) => setPassword(e.target.value),
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}
                )
                , React.createElement(Button, {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"      ,
                  onClick: () => setShowPassword(!showPassword), __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}

                  , showPassword ? (
                    React.createElement(EyeOff, { className: "h-4 w-4 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 83}} )
                  ) : (
                    React.createElement(Eye, { className: "h-4 w-4 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}} )
                  )
                )
              )
            )
            , error && React.createElement('p', { className: "text-sm text-red-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}, error)
            , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 91}}
              , React.createElement(Link, { href: "/forgot-password", className: "text-sm text-primary hover:underline"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}, "Forgot password?"

              )
            )
            , React.createElement(Button, { type: "submit", className: "w-full", disabled: isLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}
              , isLoading ? "Signing in..." : "Sign In"
            )
          )
          , React.createElement('div', { className: "mt-6 text-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}
            , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}, "Don't have an account?"
                 , " "
              , React.createElement(Link, { href: "/signup", className: "text-primary hover:underline" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, "Sign up"

              )
            )
          )
        )
      )
    )
  )
}
