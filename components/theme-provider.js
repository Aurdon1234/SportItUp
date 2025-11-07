'use client'
const _jsxFileName = "components\\theme-provider.tsx";

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,

} from 'next-themes'

export function ThemeProvider({ children, ...props }) {
  return React.createElement(NextThemesProvider, { ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10}}, children)
}
