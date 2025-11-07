"use client"
const _jsxFileName = "components\\admin\\sidebar.tsx";

import Link from "next/link"
import { usePathname } from "next/navigation"
import { adminNavItems } from "./nav-items"
import { cn } from "@/lib/utils"

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    React.createElement('aside', { className: "hidden md:flex md:w-64 lg:w-72 border-r border-gray-200 bg-white"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
      , React.createElement('div', { className: "flex h-screen flex-col"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
        , React.createElement('div', { className: "h-16 flex items-center gap-2 px-4 border-b border-gray-200"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}
          , React.createElement('img', { src: "/sportitupp-removebg-preview.png", alt: "SportItUp", className: "h-16", __self: this, __source: {fileName: _jsxFileName, lineNumber: 15}} )
          , React.createElement('span', { className: "font-semibold text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}, "Owner Admin" )
        )
        , React.createElement('nav', { className: "flex-1 p-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 18}}
          , React.createElement('ul', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 19}}
            , adminNavItems.map((item) => {
              const active = pathname === item.href
              const Icon = item.icon
              return (
                React.createElement('li', { key: item.href, __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}
                  , React.createElement(Link, {
                    href: item.href,
                    className: cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                      active ? "bg-green-50 text-green-700 border border-green-200" : "text-gray-700 hover:bg-gray-100",
                    ),
                    'aria-current': active ? "page" : undefined, __self: this, __source: {fileName: _jsxFileName, lineNumber: 25}}

                    , React.createElement(Icon, { className: cn("h-4 w-4", active ? "text-green-700" : "text-gray-500"), __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}} )
                    , React.createElement('span', { className: "truncate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}, item.title)
                  )
                )
              )
            })
          )
        )
        , React.createElement('div', { className: "p-3 border-t border-gray-200 text-xs text-gray-500"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}, "© " , new Date().getFullYear(), " SportItUp" )
      )
    )
  )
}
