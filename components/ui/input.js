// const _jsxFileName = "components\\ui\\input.tsx";import * as React from 'react'

// import { cn } from '@/lib/utils'

// function Input({ className, type, ...props }) {
//   return (
//     React.createElement('input', {
//       type: type,
//       'data-slot': "input",
//       className: cn(
//         'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
//         'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
//         'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
//         className,
//       ),
//       ...props, __self: this, __source: {fileName: _jsxFileName, lineNumber: 7}}
//     )
//   )
// }

// export { Input }

const _jsxFileName = "components\\ui\\input.tsx";
import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type = "text", ...props }) {
  return React.createElement("input", {
    type: type,
    "data-slot": "input",
    className: cn(
      // base input styles changed to match the Phone OTP box look:
      // single border, slightly larger vertical padding, rounded corners,
      // consistent text size, and a soft green focus ring.
      "w-full min-w-0 rounded-md border border-gray-200 bg-white px-3 py-2 text-base transition focus:outline-none",
      // focus ring / border color
      "focus-visible:ring-2 focus-visible:ring-green-300 focus-visible:border-green-400",
      // disabled / aria-invalid handling (keep these)
      "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
      // preserve any additional classes passed in
      className
    ),
    ...props,
    __self: this,
    __source: { fileName: _jsxFileName, lineNumber: 7 },
  });
}

export { Input };
