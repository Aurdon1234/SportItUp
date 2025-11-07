"use client"
const _jsxFileName = "components\\admin\\topbar.tsx";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import NotificationsCenter from "@/components/admin/notifications-center"

export function AdminTopbar({ title }) {
  const router = useRouter()
  async function handleLogout() {
    await fetch("/api/owner/logout", { method: "POST" })
    router.replace("/owner/login")
  }
  return (
    React.createElement('header', { className: "h-16 sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}
      , React.createElement('div', { className: "h-full container mx-auto px-4 flex items-center justify-between gap-3"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
        , React.createElement('div', { className: "flex items-center gap-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}
          , React.createElement('button', { className: "md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-200"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}
            , React.createElement(Menu, { className: "h-5 w-5 text-gray-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 21}} )
            , React.createElement('span', { className: "sr-only", __self: this, __source: {fileName: _jsxFileName, lineNumber: 22}}, "Open menu" )
          )
          , React.createElement(Image, {
            src: "/sportitupp-removebg-preview.png",
            alt: "Sportitup",
            width: 400,
            height: 120,
            className: "h-16 w-auto md:h-16"  ,
            priority: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
          )
          , React.createElement('h1', { className: "text-lg md:text-xl font-semibold text-black"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 32}}, title || "Dashboard")
        )
        , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
          , React.createElement(NotificationsCenter, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 35}} )
          , React.createElement(Button, { variant: "outline", className: "border-gray-200 text-black bg-transparent"  , asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 36}}
            , React.createElement(Link, { href: "/", __self: this, __source: {fileName: _jsxFileName, lineNumber: 37}}, "View Site" )
          )
          , React.createElement(Button, { className: "bg-green-600 hover:bg-green-700 text-white"  , disabled: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}, "Owner Profile"

          )
          , React.createElement(Button, { className: "bg-gray-100 text-black" , onClick: handleLogout, __self: this, __source: {fileName: _jsxFileName, lineNumber: 42}}, "Logout"

          )
        )
      )
    )
  )
}
