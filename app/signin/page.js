"use client"
import React from "react"
const _jsxFileName = "app\\signin\\page.tsx";

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Mail, ArrowLeft, Check } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const [signInMethod, setSignInMethod] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState("")
  const [name, setName] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState("details")

  const handlePhoneSignIn = () => {
    if (name && phoneNumber) {
      setStep("otp")
    }
  }

  const handleOtpVerification = () => {
    if (otp.length === 6) {
      setStep("success")
      // Redirect to locations after 2 seconds
      setTimeout(() => {
        window.location.href = "/locations"
      }, 2000)
    }
  }

  const handleGoogleSignIn = () => {
    // Simulate Google sign in
    setStep("success")
    setTimeout(() => {
      window.location.href = "/locations"
    }, 2000)
  }

  if (step === "success") {
    return (
      React.createElement('div', { className: "min-h-screen bg-white flex items-center justify-center px-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 44}}
        , React.createElement(Card, { className: "w-full max-w-md border-green-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}
          , React.createElement(CardContent, { className: "pt-6 text-center" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
            , React.createElement('div', { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}
              , React.createElement(Check, { className: "w-8 h-8 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}} )
            )
            , React.createElement('h2', { className: "text-2xl font-bold text-black mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 50}}, "Welcome to SportItUp!"  )
            , React.createElement('p', { className: "text-gray-600 mb-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 51}}, "Sign in successful. Redirecting you to book your venue..."        )
          )
        )
      )
    )
  }

  return (
    React.createElement('div', { className: "min-h-screen bg-white flex items-center justify-center px-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 59}}
      , React.createElement('div', { className: "w-full max-w-md" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 60}}
        /* Header */
        , React.createElement('div', { className: "text-center mb-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 62}}
          , React.createElement(Link, { href: "/", className: "inline-flex items-center text-gray-600 hover:text-black mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 63}}
            , React.createElement(ArrowLeft, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}} ), "Back to Home"

          )
          , React.createElement('img', { src: "/sportitupp-removebg-preview.png", alt: "SportItUp", className: "h-20 mx-auto mb-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}} )
          , React.createElement('h1', { className: "text-2xl font-bold text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}, "Sign In to SportItUp"   )
          , React.createElement('p', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 69}}, "Choose your preferred sign in method"     )
        )

        , !signInMethod ? (
          /* Method Selection */
          React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 74}}
            , React.createElement(Card, {
              className: "cursor-pointer hover:shadow-md transition-all border-gray-200 hover:border-green-300"    ,
              onClick: () => setSignInMethod("phone"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 75}}

              , React.createElement(CardContent, { className: "p-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
                , React.createElement('div', { className: "flex items-center space-x-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}
                  , React.createElement('div', { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}}
                    , React.createElement(Phone, { className: "w-6 h-6 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 82}} )
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}
                    , React.createElement('h3', { className: "font-semibold text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 85}}, "Phone Number" )
                    , React.createElement('p', { className: "text-sm text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 86}}, "Sign in with your phone number and OTP"       )
                  )
                )
              )
            )

            , React.createElement(Card, {
              className: "cursor-pointer hover:shadow-md transition-all border-gray-200 hover:border-green-300"    ,
              onClick: () => setSignInMethod("google"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}

              , React.createElement(CardContent, { className: "p-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 96}}
                , React.createElement('div', { className: "flex items-center space-x-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}
                  , React.createElement('div', { className: "w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 98}}
                    , React.createElement(Mail, { className: "w-6 h-6 text-blue-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 99}} )
                  )
                  , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}
                    , React.createElement('h3', { className: "font-semibold text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 102}}, "Google Account" )
                    , React.createElement('p', { className: "text-sm text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 103}}, "Sign in with your Google account"     )
                  )
                )
              )
            )
          )
        ) : signInMethod === "phone" ? (
          /* Phone Sign In */
          React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
            , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}
                , React.createElement(CardTitle, { className: "text-xl text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 114}}
                  , step === "details" ? "Enter Your Details" : "Verify OTP"
                )
                , React.createElement(Button, {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => setSignInMethod(null),
                  className: "text-gray-600 hover:text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}

                  , React.createElement(ArrowLeft, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}} )
                )
              )
            )
            , React.createElement(CardContent, { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
              , step === "details" ? (
                React.createElement(React.Fragment, null
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}
                    , React.createElement(Label, { htmlFor: "name", className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}, "Full Name"

                    )
                    , React.createElement(Input, {
                      id: "name",
                      type: "text",
                      placeholder: "Enter your full name"   ,
                      value: name,
                      onChange: (e) => setName(e.target.value),
                      className: "border-gray-200 focus:border-green-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}
                    )
                  )
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}
                    , React.createElement(Label, { htmlFor: "phone", className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}, "Phone Number"

                    )
                    , React.createElement(Input, {
                      id: "phone",
                      type: "tel",
                      placeholder: "+91 9876543210" ,
                      value: phoneNumber,
                      onChange: (e) => setPhoneNumber(e.target.value),
                      className: "border-gray-200 focus:border-green-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}
                    )
                  )
                  , React.createElement(Button, {
                    onClick: handlePhoneSignIn,
                    disabled: !name || !phoneNumber,
                    className: "w-full bg-green-600 hover:bg-green-700 text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}
, "Send OTP"

                  )
                )
              ) : (
                React.createElement(React.Fragment, null
                  , React.createElement('div', { className: "text-center mb-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 166}}
                    , React.createElement('p', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 167}}, "We've sent a 6-digit OTP to"

                      , React.createElement('br', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 169}} )
                      , React.createElement('span', { className: "font-semibold text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}, phoneNumber)
                    )
                  )
                  , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 173}}
                    , React.createElement(Label, { htmlFor: "otp", className: "text-black", __self: this, __source: {fileName: _jsxFileName, lineNumber: 174}}, "Enter OTP"

                    )
                    , React.createElement(Input, {
                      id: "otp",
                      type: "text",
                      placeholder: "123456",
                      maxLength: 6,
                      value: otp,
                      onChange: (e) => setOtp(e.target.value.replace(/\D/g, "")),
                      className: "border-gray-200 focus:border-green-500 text-center text-lg tracking-widest"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
                    )
                  )
                  , React.createElement(Button, {
                    onClick: handleOtpVerification,
                    disabled: otp.length !== 6,
                    className: "w-full bg-green-600 hover:bg-green-700 text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 187}}
, "Verify & Sign In"

                  )
                  , React.createElement(Button, {
                    variant: "ghost",
                    className: "w-full text-gray-600 hover:text-black"  ,
                    onClick: () => setStep("details"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}
, "Change Phone Number"

                  )
                )
              )
            )
          )
        ) : (
          /* Google Sign In */
          React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 207}}
            , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}
              , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 209}}
                , React.createElement(CardTitle, { className: "text-xl text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}, "Sign In with Google"   )
                , React.createElement(Button, {
                  variant: "ghost",
                  size: "sm",
                  onClick: () => setSignInMethod(null),
                  className: "text-gray-600 hover:text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}

                  , React.createElement(ArrowLeft, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}} )
                )
              )
            )
            , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}
              , React.createElement(Button, { onClick: handleGoogleSignIn, className: "w-full bg-blue-600 hover:bg-blue-700 text-white"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 222}}
                , React.createElement('svg', { className: "w-5 h-5 mr-2"  , viewBox: "0 0 24 24"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}
                  , React.createElement('path', {
                    fill: "currentColor",
                    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}
                  )
                  , React.createElement('path', {
                    fill: "currentColor",
                    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"            , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
                  )
                  , React.createElement('path', {
                    fill: "currentColor",
                    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}
                  )
                  , React.createElement('path', {
                    fill: "currentColor",
                    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"                   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}
                  )
                ), "Continue with Google"

              )
            )
          )
        )

        , React.createElement('div', { className: "text-center mt-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 247}}
          , React.createElement('p', { className: "text-sm text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}, "By signing in, you agree to our"
                  , " "
            , React.createElement('a', { href: "#", className: "text-green-600 hover:underline" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}, "Terms of Service"

            ), " ", "and"
            , " "
            , React.createElement('a', { href: "#", className: "text-green-600 hover:underline" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}, "Privacy Policy"

            )
          )
        )
      )
    )
  )
}
