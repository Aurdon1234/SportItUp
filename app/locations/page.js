"use client"
import React from "react"
const _jsxFileName = "app\\locations\\page.tsx";

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MapPin, Search, ArrowRight } from "lucide-react"
import Link from "next/link"

const getVenueCountBySport = (locationId, sport) => {
  if (!sport) {
    // Return total venues if no sport selected
    return locationId === "amritsar" ? 0 : 3
  }

  if (sport === "cricket") {
    return locationId === "amritsar" ? 0 : 1 // Amritsar: Super Six, theturfplay, Pavilion | Patiala: Box cricket
  } else if (sport === "pickleball") {
    return locationId === "amritsar" ? 0 : 2 // Amritsar: Pickleup, Pavilion | Patiala: Pickeball Patiala
  } else if (sport === "football") {
    return 0 // No football venues currently available
  }

  return 0
}

const locations = [
  {
    id: "amritsar",
    name: "Amritsar",
    state: "Punjab",
    sports: ["Cricket", "Football", "Pickleball"],
    image: "/city-amritsar.jpg",
    popular: true,
  },
  {
    id: "patiala",
    name: "Patiala",
    state: "Punjab",
    sports: ["Cricket", "Football", "Pickleball"],
    image: "/city-patiala.jpg",
    popular: true,
  },
]

export default function LocationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedSport, setSelectedSport] = useState(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    const sport = searchParams.get("sport")
    if (sport) {
      setSelectedSport(sport)
    }
  }, [])

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.state.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleLocationSelect = (locationId) => {
    setSelectedLocation(locationId)
    const sportParam = selectedSport ? `?sport=${selectedSport}` : ""
    setTimeout(() => {
      window.location.href = `/turfs/${locationId}${sportParam}`
    }, 500)
  }

  return (
    React.createElement('div', { className: "min-h-screen bg-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 76}}
      /* Header */
      , React.createElement('header', { className: "border-b border-gray-200 bg-white sticky top-0 z-50"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 78}}
        , React.createElement('div', { className: "container mx-auto px-4 py-4 flex items-center justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 79}}
          , React.createElement(Link, { href: "/", className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 80}}
            , React.createElement('img', { src: "/sportitupp-removebg-preview.png", alt: "SportItUp", className: "h-20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 81}} )
          )
        )
      )

      , React.createElement('div', { className: "container mx-auto px-4 py-8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 92}}
        /* Page Header */
        , React.createElement('div', { className: "text-center mb-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 94}}
          , React.createElement('h1', { className: "text-3xl md:text-4xl font-bold text-black mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 95}}, "Choose Your Location"  )
          , selectedSport && (
            React.createElement(Badge, { className: "mb-4 bg-green-100 text-green-700 border-green-200 capitalize"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 97}}, "Looking for "
                , selectedSport, " venues"
            )
          )
          , React.createElement('p', { className: "text-gray-600 text-lg max-w-2xl mx-auto"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 101}}, "Select your city to discover amazing sports venues and book your favorite turfs"

          )
        )

        /* Search Bar */
        , React.createElement('div', { className: "max-w-md mx-auto mb-8"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 107}}
          , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 108}}
            , React.createElement(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 109}} )
            , React.createElement(Input, {
              type: "text",
              placeholder: "Search for your city..."   ,
              value: searchTerm,
              onChange: (e) => setSearchTerm(e.target.value),
              className: "pl-10 border-gray-200" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 110}}
            )
          )
        )

        /* Available Locations */
        , React.createElement('div', { className: "mb-12", __self: this, __source: {fileName: _jsxFileName, lineNumber: 121}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-6 justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 122}}
            , React.createElement('h2', { className: "text-2xl font-semibold text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 123}}, "Available Cities" )
            , React.createElement(Badge, { variant: "secondary", className: "bg-green-100 text-green-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 124}}, "Punjab"

            )
          )
          , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 128}}
            , filteredLocations.map((location) => {
              const venueCount = getVenueCountBySport(location.id, selectedSport)

              return (
                React.createElement(Card, {
                  key: location.id,
                  className: `group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-green-300 ${
                    selectedLocation === location.id ? "ring-2 ring-green-500" : ""
                  }`,
                  onClick: () => handleLocationSelect(location.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 133}}

                  , React.createElement('div', { className: "relative overflow-hidden rounded-t-lg"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 140}}
                    , React.createElement('img', {
                      src: location.image || "/placeholder.svg",
                      alt: `${location.name} sports venues`,
                      className: "w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 141}}
                    )
                    , React.createElement('div', { className: "absolute top-3 right-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 146}}
                      , React.createElement(Badge, { className: "bg-green-600 text-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 147}}, "Available")
                    )
                  )
                  , React.createElement(CardHeader, { className: "pb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 150}}
                    , React.createElement('div', { className: "flex items-center justify-between"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 151}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 152}}
                        , React.createElement(CardTitle, { className: "text-xl text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 153}}, location.name)
                        , React.createElement(CardDescription, { className: "flex items-center gap-1 text-gray-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 154}}
                          , React.createElement(MapPin, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 155}} )
                          , location.state
                        )
                      )
                      , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 159}}
                        , React.createElement('div', { className: "text-2xl font-bold text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 160}}, venueCount)
                        , React.createElement('div', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 161}}
                          , selectedSport ? `${selectedSport} venues` : "Venues"
                        )
                      )
                    )
                  )
                  , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 167}}
                    , React.createElement('div', { className: "flex flex-wrap gap-1 mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 168}}
                      , location.sports.map((sport, index) => (
                        React.createElement(Badge, { key: index, variant: "outline", className: "text-xs border-gray-200" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 170}}
                          , sport
                        )
                      ))
                    )
                    , React.createElement(Button, {
                      className: `w-full transition-colors ${
                        selectedLocation === location.id
                          ? "bg-green-600 text-white"
                          : "border-gray-200 text-black hover:bg-green-600 hover:text-white"
                      }`,
                      variant: selectedLocation === location.id ? "default" : "outline", __self: this, __source: {fileName: _jsxFileName, lineNumber: 175}}

                      , selectedLocation === location.id ? "Selected" : "Select Location"
                      , React.createElement(ArrowRight, { className: "ml-2 w-4 h-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 184}} )
                    )
                  )
                )
              )
            })
          )
        )
        /* No Results */
        , filteredLocations.length === 0 && (
          React.createElement('div', { className: "text-center py-12" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
            , React.createElement(MapPin, { className: "w-12 h-12 text-gray-400 mx-auto mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}} )
            , React.createElement('h3', { className: "text-xl font-semibold text-black mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}, "No locations found"  )
            , React.createElement('p', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}, "We couldn't find any cities matching \""
                    , searchTerm, "\". Currently available in Amritsar and Patiala."
            )
          )
        )
      )
    )
  )
}
