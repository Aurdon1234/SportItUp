import React from "react";
const _jsxFileName = "app\\page.tsx";import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, Target, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    React.createElement('div', { className: "min-h-screen bg-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 9}}
      /* Header */
      , React.createElement('header', { className: "border-b border-gray-200 bg-white sticky top-0 z-50"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 11}}
        , React.createElement('div', { className: "container mx-auto px-4 py-4 flex items-center justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 12}}
          , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 13}}
            // , React.createElement('img', { src: "/sportitupp-removebg-preview.png", alt: "SportItUp", className: "h-24", __self: this, __source: {fileName: _jsxFileName, lineNumber: 14}} )
            , React.createElement(require("@/components/LogoLink.js").default, {})
          )
          , React.createElement('nav', { className: "hidden md:flex items-center space-x-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 16}}
            , React.createElement('a', { href: "#sports", className: "text-gray-600 hover:text-black transition-colors"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 17}}, "Sports"

            )
            , React.createElement('a', { href: "#community", className: "text-gray-600 hover:text-black transition-colors"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 20}}, "Community"

            )
            /* ensure About goes to the homepage About anchor */
            , React.createElement('a', { href: "#about", className: "text-gray-600 hover:text-black transition-colors"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 24}}, "About"

            )
          )
          /* Removed: Admin Login, Sign In, Sign Up */
        )
      )

      /* Hero Section */
      , React.createElement('section', { className: "relative py-20 px-4 text-center bg-gradient-to-br from-white via-green-50 to-white"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 33}}
        , React.createElement('div', { className: "container mx-auto max-w-4xl"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 34}}
          , React.createElement(Badge, { className: "mb-6 bg-green-100 text-green-700 border-green-200"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 35}}, "🏆 Punjab's Premier Sports Booking Platform"

          )
          , React.createElement('h1', { className: "text-4xl md:text-6xl font-bold text-balance mb-6 text-black"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 38}}, "Book Your "
              , React.createElement('span', { className: "text-green-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 39}}, "Sports Venue" ), " with SportItUp"
          )
          , React.createElement('p', { className: "text-xl text-gray-600 text-pretty mb-8 max-w-2xl mx-auto"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 41}}, "Find and book the best cricket, football, and pickleball venues in Amritsar and Patiala. Easy booking, great facilities, competitive prices."


          )
          , React.createElement('div', { className: "flex flex-col sm:flex-row gap-4 justify-center items-center"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 45}}
            , React.createElement(Button, { size: "lg", className: "text-lg px-8 bg-green-600 hover:bg-green-700 text-white"    , asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 46}}
              , React.createElement(Link, { href: "/locations", __self: this, __source: {fileName: _jsxFileName, lineNumber: 47}}, "Start Booking "
                  , React.createElement(ArrowRight, { className: "ml-2 w-5 h-5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 48}} )
              )
            )
          )
        )
      )

      /* Featured Sports Categories */
      // , React.createElement('section', { id: "sports", className: "py-16 px-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 64}}
      //   , React.createElement('div', { className: "container mx-auto" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 65}}
      //     , React.createElement('div', { className: "text-center mb-12" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 66}}
      //       , React.createElement('h2', { className: "text-3xl md:text-4xl font-bold text-black mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 67}}, "Available Sports" )
      //       , React.createElement('p', { className: "text-gray-600 text-lg max-w-2xl mx-auto"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 68}}, "Book venues for your favorite sports. Quality facilities and easy online booking."

      //       )
      //     )

      //     , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 73}}
      //       , [
      //         { name: "Cricket", icon: "🏏", description: "Professional cricket grounds and nets", slug: "cricket" },
      //         { name: "Football", icon: "⚽", description: "Full-size and 5-a-side football turfs", slug: "football" },
      //         {
      //           name: "Pickleball",
      //           icon: "🏓",
      //           description: "Modern pickleball courts with quality equipment",
      //           slug: "pickleball",
      //         },
      //       ].map((sport, index) => (
      //         React.createElement(Card, {
      //           key: index,
      //           className: "group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-green-300"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 84}}

      //           , React.createElement(CardHeader, { className: "text-center pb-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 88}}
      //             , React.createElement('div', { className: "text-5xl mb-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 89}}, sport.icon)
      //             , React.createElement(CardTitle, { className: "text-xl text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 90}}, sport.name)
      //           )
      //           , React.createElement(CardContent, { className: "text-center", __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}
      //             , React.createElement('p', { className: "text-gray-600 mb-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 93}}, sport.description)
      //             , React.createElement(Button, {
      //               variant: "outline",
      //               size: "sm",
      //               className: "w-full group-hover:bg-green-600 group-hover:text-white transition-colors border-gray-200 bg-transparent"     ,
      //               asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}

      //               , React.createElement(Link, { href: `/locations?sport=${sport.slug}`, __self: this, __source: {fileName: _jsxFileName, lineNumber: 100}}, "Book Now" )
      //             )
      //           )
      //         )
      //       ))
      //     )
      //   )
      // )

      /* Community Section */
      , React.createElement('section', { id: "community", className: "py-16 px-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}
        , React.createElement('div', { className: "container mx-auto text-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 111}}
          , React.createElement('h2', { className: "text-3xl md:text-4xl font-bold text-black mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 112}}, "Why Choose SportItUp"  )
          , React.createElement('p', { className: "text-gray-600 text-lg max-w-2xl mx-auto mb-8"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 113}}, "Experience hassle-free sports venue booking with quality facilities and competitive pricing."

          )

          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 117}}
            , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 118}}
              , React.createElement('div', { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 119}}
                , React.createElement(Calendar, { className: "w-6 h-6 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 120}} )
              )
              , React.createElement('h3', { className: "text-xl font-semibold text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}, "Easy Booking" )
              , React.createElement('p', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}, "Simple online booking system with instant confirmation"      )
            )

            , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 126}}
              , React.createElement('div', { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 127}}
                , React.createElement(Trophy, { className: "w-6 h-6 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 128}} )
              )
              , React.createElement('h3', { className: "text-xl font-semibold text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 130}}, "Quality Venues" )
              , React.createElement('p', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 131}}, "Premium sports facilities with modern amenities and equipment"       )
            )

            , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 134}}
              , React.createElement('div', { className: "w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 135}}
                , React.createElement(Target, { className: "w-6 h-6 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 136}} )
              )
              , React.createElement('h3', { className: "text-xl font-semibold text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 138}}, "Best Prices" )
              , React.createElement('p', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 139}}, "Competitive pricing with transparent costs and no hidden fees"        )
            )
          )

          , React.createElement(Button, { size: "lg", className: "text-lg px-8 bg-green-600 hover:bg-green-700 text-white"    , asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 143}}
            , React.createElement(Link, { href: "/locations", __self: this, __source: {fileName: _jsxFileName, lineNumber: 144}}, "Start Booking "
                , React.createElement(ArrowRight, { className: "ml-2 w-5 h-5"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 145}} )
            )
          )
        )
      )

      /* About Section */
      , React.createElement('section', { id: "about", className: "py-16 px-4  bg-green-50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
        , React.createElement('div', { className: "container mx-auto max-w-3xl"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}
          , React.createElement('h2', { className: "text-3xl md:text-4xl font-bold text-black mb-4 text-balance"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}, "About Sportitup" )
          , React.createElement('div', { className: "space-y-4 text-gray-700 leading-7"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}}
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 156}}, "At Sportitup, we believe that playing sports should be simple, fun, and hassle-free. Our platform connects players with the best turfs in their city, offering easy online booking, transparent pricing, and instant confirmation."



            )
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}, "We currently provide access to cricket, football, and pickleball venues in Punjab, starting with Amritsar and Patiala, and are rapidly expanding. Whether you’re booking a friendly match or organizing a tournament, Sportitup ensures you get premium facilities at the best prices."



            )
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 166}}, "Our mission is to make sports accessible to everyone and to encourage a healthier, more active lifestyle. With Sportitup, you don’t have to worry about endless calls or last-minute turf unavailability—everything is just a click away."



            )
            , React.createElement('p', { className: "font-semibold text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 171}}, "Play more. Stress less. Sportitup."    )
          )
        )
      )

      /* Footer */
      , React.createElement('footer', { className: "border-t border-gray-200 py-12 px-4 bg-white"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 177}}
        , React.createElement('div', { className: "container mx-auto" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 178}}
          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-4 gap-8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 179}}
            , React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 180}}
              , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 181}}
                , React.createElement('img', { src: "/sportitupp-removebg-preview.png", alt: "SportItUp", className: "h-20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 182}} )
              )
              , React.createElement('p', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 184}}, "Punjab's premier sports venue booking platform for cricket, football, and pickleball."

              )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 189}}
              , React.createElement('h4', { className: "font-semibold text-black mb-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 190}}, "Sports")
              , React.createElement('ul', { className: "space-y-2 text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 191}}
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 192}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 193}}, "Cricket")
                )
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}, "Football")
                )
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 199}}, "Pickleball")
                )
              )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 204}}
              , React.createElement('h4', { className: "font-semibold text-black mb-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 205}}, "Locations")
              , React.createElement('ul', { className: "space-y-2 text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 206}}
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 207}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 208}}, "Amritsar")
                )
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 211}}, "Patiala")
                )
              )
            )

            , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
              , React.createElement('h4', { className: "font-semibold text-black mb-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}, "Support")
              , React.createElement('ul', { className: "space-y-2 text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}}
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}
                  /* Make Help Center plain text (non-clickable) */
                  , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}, "Help Center" )
                )
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}
                  , React.createElement('div', { className: "space-y-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}
                    , React.createElement('p', { className: "hover:text-black transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}, "Contact Us:" )
                    , React.createElement('p', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 226}}, "📞 +91 9958417828, +91 9988993456"  )
                    , React.createElement('p', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 227}}, "✉️ sportituporg@gmail.com" )
                    , React.createElement('p', { className: "text-sm flex items-center gap-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
                      , React.createElement('svg', { className: "w-4 h-4" , fill: "currentColor", viewBox: "0 0 24 24"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 229}}
                        , React.createElement('path', { d: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919-.058 1.265-.069 1.645-.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225 1.664 4.771 4.919 4.919 1.266.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.358-.2 6.78 2.618 6.98 6.98 1.281.058 1.689.073 4.949.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.203-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"                                                                , __self: this, __source: {fileName: _jsxFileName, lineNumber: 230}} )
                      ), "@sportitupindia"

                    )
                  )
                )
                /* Keep Privacy Policy and Terms as links */
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
                  , React.createElement(Link, { href: "/privacy", className: "hover:text-black transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}, "Privacy Policy"

                  )
                )
                , React.createElement('li', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}
                  , React.createElement(Link, { href: "/terms", className: "hover:text-black transition-colors" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}, "Terms of Service"

                  )
                )
              )
            )
          )

          , React.createElement('div', { className: "border-t border-gray-200 mt-8 pt-8 text-center text-gray-600"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}}
            , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}, "© 2025 SportItUp.in. All rights reserved. Built for sports enthusiasts in Punjab."           )
          )
        )
      )
    )
  )
}
