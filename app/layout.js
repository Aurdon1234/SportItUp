import React from "react";
const _jsxFileName = "app\\layout.tsx";

import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "SportItUp - Your Ultimate Sports Destination",
  description:
    "Join the ultimate sports community at SportItUp.in - discover events, connect with athletes, and fuel your passion for sports",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}

) {
  return (
    React.createElement('html', { lang: "en", __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
      , React.createElement('body', { className: `font-sans ${inter.variable} antialiased`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}, children)
    )
  )
}
