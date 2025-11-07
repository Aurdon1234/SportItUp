"use client"
import React from "react"
const _jsxFileName = "app\\signup\\page.tsx";



import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!")
      setIsLoading(false)
      return
    }

    // Simulate signup process
    setTimeout(() => {
      console.log("[v0] Signup attempt:", formData)
      setIsLoading(false)
      // Redirect to location selection after successful signup
      window.location.href = "/locations"
    }, 1500)
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    React.createElement('div', { className: "min-h-screen bg-background flex items-center justify-center p-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 49}}
      , React.createElement(Card, { className: "w-full max-w-md" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}
        , React.createElement(CardHeader, { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}
          , React.createElement('div', { className: "flex items-center justify-center space-x-2 mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 52}}
            , React.createElement('div', { className: "w-10 h-10 bg-primary rounded-full flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 53}}
              , React.createElement(Trophy, { className: "w-6 h-6 text-primary-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 54}} )
            )
            , React.createElement('span', { className: "text-2xl font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 56}}, "SportItUp")
          )
          , React.createElement(CardTitle, { className: "text-2xl", __self: this, __source: {fileName: _jsxFileName, lineNumber: 58}}, "Create Account" )
          , React.createElement(CardDescription, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}, "Join SportItUp to book amazing sports venues"      )
        )
        , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 61}}
          , React.createElement('form', { onSubmit: handleSignup, className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
              , React.createElement(Label, { htmlFor: "name", __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}, "Full Name" )
              , React.createElement(Input, {
                id: "name",
                type: "text",
                placeholder: "Enter your full name"   ,
                value: formData.name,
                onChange: (e) => handleInputChange("name", e.target.value),
                required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
              )
            )
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}
              , React.createElement(Label, { htmlFor: "email", __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}, "Email")
              , React.createElement(Input, {
                id: "email",
                type: "email",
                placeholder: "Enter your email"  ,
                value: formData.email,
                onChange: (e) => handleInputChange("email", e.target.value),
                required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
              )
            )
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}
              , React.createElement(Label, { htmlFor: "phone", __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}, "Phone Number" )
              , React.createElement(Input, {
                id: "phone",
                type: "tel",
                placeholder: "Enter your phone number"   ,
                value: formData.phone,
                onChange: (e) => handleInputChange("phone", e.target.value),
                required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 87}}
              )
            )
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}
              , React.createElement(Label, { htmlFor: "password", __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}, "Password")
              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
                , React.createElement(Input, {
                  id: "password",
                  type: showPassword ? "text" : "password",
                  placeholder: "Create a password"  ,
                  value: formData.password,
                  onChange: (e) => handleInputChange("password", e.target.value),
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}}
                )
                , React.createElement(Button, {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"      ,
                  onClick: () => setShowPassword(!showPassword), __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}

                  , showPassword ? (
                    React.createElement(EyeOff, { className: "h-4 w-4 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 115}} )
                  ) : (
                    React.createElement(Eye, { className: "h-4 w-4 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}} )
                  )
                )
              )
            )
            , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}
              , React.createElement(Label, { htmlFor: "confirmPassword", __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}, "Confirm Password" )
              , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}
                , React.createElement(Input, {
                  id: "confirmPassword",
                  type: showConfirmPassword ? "text" : "password",
                  placeholder: "Confirm your password"  ,
                  value: formData.confirmPassword,
                  onChange: (e) => handleInputChange("confirmPassword", e.target.value),
                  required: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 125}}
                )
                , React.createElement(Button, {
                  type: "button",
                  variant: "ghost",
                  size: "sm",
                  className: "absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"      ,
                  onClick: () => setShowConfirmPassword(!showConfirmPassword), __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}

                  , showConfirmPassword ? (
                    React.createElement(EyeOff, { className: "h-4 w-4 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}} )
                  ) : (
                    React.createElement(Eye, { className: "h-4 w-4 text-muted-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}} )
                  )
                )
              )
            )
            , React.createElement(Button, { type: "submit", className: "w-full", disabled: isLoading, __self: this, __source: {fileName: _jsxFileName, lineNumber: 148}}
              , isLoading ? "Creating account..." : "Create Account"
            )
          )
          , React.createElement('div', { className: "mt-6 text-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
            , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}, "Already have an account?"
                 , " "
              , React.createElement(Link, { href: "/login", className: "text-primary hover:underline" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}, "Sign in"

              )
            )
          )
        )
      )
    )
  )
}
