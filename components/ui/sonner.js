'use client'
const _jsxFileName = "components\\ui\\sonner.tsx";

import { useTheme } from 'next-themes'
import { Toaster as Sonner, } from 'sonner'

const Toaster = ({ ...props }) => {
  const { theme = 'system' } = useTheme()

  return (
    React.createElement(Sonner, {
      theme: theme ,
      className: "toaster group" ,
      style: 
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } 
      ,
      ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 10}}
    )
  )
}

export { Toaster }
