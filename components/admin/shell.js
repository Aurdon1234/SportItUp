"use client"
const _jsxFileName = "components\\admin\\shell.tsx";


import { AdminSidebar } from "./sidebar"
import { AdminTopbar } from "./topbar"

export function AdminShell({ title, children }) {
  return (
    React.createElement('div', { className: "min-h-screen bg-white text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
      , React.createElement('div', { className: "flex", __self: this, __source: {fileName: _jsxFileName, lineNumber: 10}}
        , React.createElement(AdminSidebar, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 11}} )
        , React.createElement('div', { className: "flex-1 min-w-0" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
          , React.createElement(AdminTopbar, { title: title, __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}} )
          , React.createElement('main', { className: "container mx-auto px-4 py-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}}, children)
        )
      )
    )
  )
}
