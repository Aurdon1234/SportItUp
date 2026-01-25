"use client"
import React from "react"
const _jsxFileName = "app\\turfs\\[location]\\page.tsx";

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Search, Trophy, Star, Clock, Users, Car, Wifi, Zap, Droplets, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

const turfs = [
  // Amritsar Cricket Venues
  // {
  //   id: "super-six-turf",
  //   name: "Super Six Turf",
  //   location: "Suncity, Batala Road, Amritsar",
  //   rating: 4.8,
  //   reviews: 156,
  //   sports: ["Cricket"],
  //   pricePerHour: 1000,
  //   image: "/cricket-ground-amritsar-nets-practice.png",
  //   amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
  //   openTime: "6:00 AM",
  //   closeTime: "10:00 PM",
  //   featured: true,
  //   courts: 1,
  // },
  // {
  //   id: "theturfplay",
  //   name: "theturfplay",
  //   location: "Loharka Road, Amritsar",
  //   rating: 4.7,
  //   reviews: 89,
  //   sports: ["Cricket"],
  //   pricePerHour: 1200,
  //   image: "/cricket-ground-amritsar-nets-practice.png",
  //   amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
  //   openTime: "6:00 AM",
  //   closeTime: "10:00 PM",
  //   featured: false,
  //   courts: 1,
  // },
  // {
  //   id: "the-pavilion-amritsar-cricket",
  //   name: "The Pavilion Amritsar",
  //   location: "Loharka Road, Amritsar",
  //   rating: 4.9,
  //   reviews: 234,
  //   sports: ["Cricket"],
  //   pricePerHour: 1200,
  //   image: "/cricket-ground-amritsar-nets-practice.png",
  //   amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
  //   openTime: "6:00 AM",
  //   closeTime: "11:59 PM",
  //   featured: true,
  //   courts: 1,
  // },
  // // Amritsar Pickleball Venues
  // {
  //   id: "pickleup-amritsar",
  //   name: "Pickleup Amritsar",
  //   location: "Lumsden Club, Amritsar",
  //   rating: 4.6,
  //   reviews: 67,
  //   sports: ["Pickleball"],
  //   pricePerHour: 600,
  //   image: "/pickleball-court-amritsar-indoor-modern.png",
  //   amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
  //   openTime: "6:00 AM",
  //   closeTime: "11:00 PM",
  //   featured: true,
  //   courts: 2,
  // },
  // {
  //   id: "the-pavilion-amritsar-pickleball",
  //   name: "The Pavilion Amritsar",
  //   location: "Loharka Road, Amritsar",
  //   rating: 4.8,
  //   reviews: 145,
  //   sports: ["Pickleball"],
  //   pricePerHour: 1000,
  //   image: "/pickleball-court-amritsar-indoor-modern.png",
  //   amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
  //   openTime: "6:00 AM",
  //   closeTime: "11:59 PM",
  //   featured: false,
  //   courts: 2,
  // },
  // {
  //   id: "the-pavilion-amritsar-cricket",
  //   name: "The Pavilion Amritsar",
  //   location: "Loharka Road, Amritsar",
  //   rating: 4.9,
  //   reviews: 234,
  //   sports: ["Cricket"],
  //   pricePerHour: 1200,
  //   image: "/cricket-ground-amritsar-nets-practice.png",
  //   amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
  //   openTime: "6:00 AM",
  //   closeTime: "11:59 PM",
  //   featured: true,
  //   courts: 1,
  // },
  // Amritsar Pickleball Venues
  // {
  //   id: "pickleup-amritsar",
  //   name: "Pickleup Amritsar",
  //   location: "Lumsden Club, Amritsar",
  //   rating: 4.6,
  //   reviews: 67,
  //   sports: ["Pickleball"],
  //   pricePerHour: 600,
  //   image: "/pickleball-court-amritsar-indoor-modern.png",
  //   amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
  //   openTime: "6:00 AM",
  //   closeTime: "11:00 PM",
  //   featured: true,
  //   courts: 2,
  // },
  {
    id: "pavilion-amritsar",
    name: "The Pavilion Amritsar",
    location: "Next to RB Estate, Loharka Road, Amritsar",
    rating: 4.6,
    reviews: 11,
    sports: ["Pickleball", "Cricket", "Football"],
    // pricePerHour: 800,
    priceNormal: 1000,
    pricePeak: 1200,
    image: "/pavilion-amritsar.jpeg",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "12:00 AM",
    featured: false,
    courts: 4,
  },
  // Patiala Cricket Venues
  // {
  //   id: "box-cricket-patiala",
  //   name: "Box Cricket Patiala",
  //   location: "Sheesh Mahal Enclave, Patiala",
  //   rating: 4.9,
  //   reviews: 213,
  //   sports: ["Cricket"],
  //   // pricePerHour: 1000,
  //   priceNormal: 1000,
  //   pricePeak: 1000,
  //   image: "/box-cricket-patiala.webp",
  //   amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
  //   openTime: "6:00 AM",
  //   closeTime: "10:00 PM",
  //   featured: false,
  //   courts: 1,
  // },
  // // Patiala Pickleball Venues
  // {
  //   id: "pickleball-patiala",
  //   name: "Pickleball Patiala",
  //   location: "Sheesh Mahal Enclave, Patiala",
  //   rating: 4.9,
  //   reviews: 98,
  //   sports: ["Pickleball"],
  //   // pricePerHour: 600,
  //   priceNormal: 600,
  //   pricePeak: 600,
  //   image: "/pickleball-patiala.webp",
  //   amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
  //   openTime: "6:00 AM",
  //   closeTime: "10:00 PM",
  //   featured: false,
  //   courts: 2,
  // },
  {
    id: "pinnacle-patiala",
    name: "The Pinnacle Club",
    location: "Tiwana Chownk, Near Bhadson Rd, Patiala",
    rating: 5.0,
    reviews: 1,
    sports: ["Pickleball"],
    // pricePerHour: 800,
    priceNormal: 600,
    pricePeak: 800,
    image: "/pinnacle-patiala.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "11:00 PM",
    featured: false,
    courts: 2,
  },
  {
    id: "dmk-patiala",
    name: "DMK Royal Cube",
    location: "434, Ranjit Nagar, Patiala",
    rating: 4.9,
    reviews: 87,
    sports: ["Cricket", "Tennis"],
    // pricePerHour: 800,
    priceNormal: 800,
    pricePeak: 1000,
    image: "/dmk-patiala.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "11:00 PM",
    featured: false,
    courts: 1,
  },
]

const amenityIcons = {
  Parking: Car,
  WiFi: Wifi,
  Floodlights: Zap,
  "Changing Rooms": Users,
  AC: Droplets,
  Refreshments: Users,
  "Equipment Rental": Trophy,
  Equipment: Trophy,
  Coaching: Users,
  Cafeteria: Users,
  Washrooms: Users,
}

export default function TurfsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const location = params.location 
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSport, setSelectedSport] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [selectedTurf, setSelectedTurf] = useState(null)

  useEffect(() => {
    const sportParam = searchParams.get("sport")
    if (sportParam) {
      setSelectedSport(sportParam.charAt(0).toUpperCase() + sportParam.slice(1))
    }
  }, [searchParams])

  const locationName = location.charAt(0).toUpperCase() + location.slice(1)

  const locationTurfs = turfs.filter((turf) => turf.location.toLowerCase().includes(location.toLowerCase()))

  const filteredTurfs = locationTurfs.filter((turf) => {
    const matchesSearch =
      turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turf.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSport = selectedSport === "all" || turf.sports.includes(selectedSport)
    return matchesSearch && matchesSport
  })

  function renderPrice(turf) {
  const normal = turf.priceNormal
  const peak = turf.pricePeak

  if (!normal) return null

  // same price or no peak → single price
  if (!peak || peak === normal) {
    return <>₹{normal}</>
  }

  // different → range
  return <>₹{normal} – ₹{peak}</>
}


  const sortedTurfs = [...filteredTurfs].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "price-low":
        return renderPrice(allSports) - renderPrice(b)
      case "price-high":
        return renderPrice(b) - renderPrice(a)
      default:
        return 0
    }
  })

  const featuredTurfs = sortedTurfs.filter((turf) => turf.featured)
  const regularTurfs = sortedTurfs.filter((turf) => !turf.featured)

  const allSports = ["Cricket", "Football", "Pickleball", "Tennis"]

  const handleTurfSelect = (turfId) => {
    setSelectedTurf(turfId)
    setTimeout(() => {
      window.location.href = `/booking/${turfId}`
    }, 500)
  }

  return (
    React.createElement('div', { className: "min-h-screen bg-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 194}}
      , React.createElement('header', { className: "border-b border-gray-200 bg-white sticky top-0 z-50"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 195}}
        , React.createElement('div', { className: "container mx-auto px-4 py-4 flex items-center justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 196}}
          , React.createElement('div', { className: "flex items-center space-x-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 197}}
            , React.createElement(Link, { href: "/locations", className: "flex items-center space-x-2 text-gray-600 hover:text-black"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 198}}
              , React.createElement(ArrowLeft, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 199}} )
              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 200}}, "Back to Locations"  )
            )
            , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 202}}
              // , React.createElement('img', { src: "/sportitupp-removebg-preview.png", alt: "SportItUp", className: "h-20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 203}} )
              , React.createElement(Link, { href: "/", className: "flex items-center" },
  React.createElement('img', {
    src: "/sportitupp-removebg-preview.png",
    alt: "SportItUp",
    className: "h-20 cursor-pointer",
  })
)
            )
          )
        )
      )

      , React.createElement('div', { className: "container mx-auto px-4 py-8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}
        , React.createElement('div', { className: "mb-8", __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}}
          , React.createElement('div', { className: "flex items-center gap-2 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}
            , React.createElement(MapPin, { className: "w-5 h-5 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 218}} )
            , React.createElement('span', { className: "text-lg text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}, locationName)
          )
          , React.createElement('h1', { className: "text-3xl md:text-4xl font-bold text-black mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 221}}, "Sports Venues in "   , locationName)
          , selectedSport !== "all" && (
            React.createElement(Badge, { className: "mb-4 bg-green-100 text-green-700 border-green-200"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}, "Showing " , selectedSport, " venues" )
          )
          , React.createElement('p', { className: "text-gray-600 text-lg" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}, "Discover and book the best sports facilities in your area"         )
        )

        , React.createElement('div', { className: "flex flex-col md:flex-row gap-4 mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200"         , __self: this, __source: {fileName: _jsxFileName, lineNumber: 228}}
          , React.createElement('div', { className: "flex-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 229}}
            , React.createElement('div', { className: "relative", __self: this, __source: {fileName: _jsxFileName, lineNumber: 230}}
              , React.createElement(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 231}} )
              , React.createElement(Input, {
                type: "text",
                placeholder: "Search venues..." ,
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
                className: "pl-10 border-gray-200" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}
              )
            )
          )
          , React.createElement(Select, { value: selectedSport, onValueChange: setSelectedSport, __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}
            , React.createElement(SelectTrigger, { className: "w-full md:w-48 border-gray-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}
              , React.createElement(SelectValue, { placeholder: "Select Sport" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 243}} )
            )
            , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 245}}
              , React.createElement(SelectItem, { value: "all", __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}}, "All Sports" )
              , allSports.map((sport) => (
                React.createElement(SelectItem, { key: sport, value: sport, __self: this, __source: {fileName: _jsxFileName, lineNumber: 248}}
                  , sport
                )
              ))
            )
          )
          , React.createElement(Select, { value: sortBy, onValueChange: setSortBy, __self: this, __source: {fileName: _jsxFileName, lineNumber: 254}}
            , React.createElement(SelectTrigger, { className: "w-full md:w-48 border-gray-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 255}}
              , React.createElement(SelectValue, { placeholder: "Sort By" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}} )
            )
            , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 258}}
              , React.createElement(SelectItem, { value: "rating", __self: this, __source: {fileName: _jsxFileName, lineNumber: 259}}, "Highest Rated" )
              , React.createElement(SelectItem, { value: "price-low", __self: this, __source: {fileName: _jsxFileName, lineNumber: 260}}, "Price: Low to High"   )
              , React.createElement(SelectItem, { value: "price-high", __self: this, __source: {fileName: _jsxFileName, lineNumber: 261}}, "Price: High to Low"   )
            )
          )
        )

        , featuredTurfs.length > 0 && (
          React.createElement('div', { className: "mb-12", __self: this, __source: {fileName: _jsxFileName, lineNumber: 267}}
            , React.createElement('div', { className: "flex items-center gap-2 mb-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}
              , React.createElement('h2', { className: "text-2xl font-semibold text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}, "Featured Venues" )
              , React.createElement(Badge, { variant: "secondary", className: "bg-green-100 text-green-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 270}}, "Recommended"

              )
            )
            , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 274}}
              , featuredTurfs.map((turf) => (
                React.createElement(Card, {
                  key: turf.id,
                  className: `group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-green-300 ${
                    selectedTurf === turf.id ? "ring-2 ring-green-500" : ""
                  }`,
                  onClick: () => handleTurfSelect(turf.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}

                  , React.createElement('div', { className: "flex", __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}
                    , React.createElement('div', { className: "relative w-48 h-48 overflow-hidden rounded-l-lg"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
                      , React.createElement('img', {
                        src: turf.image || "/placeholder.svg",
                        alt: turf.name,
                        className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}}
                      )
                      , React.createElement('div', { className: "absolute top-3 left-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 290}}
                        , React.createElement(Badge, { className: "bg-green-600 text-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 291}}, "Featured")
                      )
                    )
                    , React.createElement('div', { className: "flex-1 p-6" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 294}}
                      , React.createElement('div', { className: "flex justify-between items-start mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 295}}
                        , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}
                          , React.createElement(CardTitle, { className: "text-xl mb-1 text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 297}}, turf.name)
                          , React.createElement(CardDescription, { className: "flex items-center gap-1 text-gray-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 298}}
                            , React.createElement(MapPin, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 299}} )
                            , turf.location
                          )
                        )
                        , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}
                          , React.createElement('div', { className: "text-2xl font-bold text-green-600 whitespace-nowrap"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}, renderPrice(turf))
                          , React.createElement('div', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}}, "per hour" )
                        )
                      )

                      , React.createElement('div', { className: "flex items-center gap-4 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}
                        , React.createElement('div', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}
                          , React.createElement(Star, { className: "w-4 h-4 fill-yellow-400 text-yellow-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 311}} )
                          , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 312}}, turf.rating)
                          , React.createElement('span', { className: "text-gray-600 text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 313}}, "(", turf.reviews, ")")
                        )
                        , React.createElement('div', { className: "flex items-center gap-1 text-gray-600 text-sm"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 315}}
                          , React.createElement(Clock, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 316}} )
                          , turf.openTime, " - "  , turf.closeTime
                        )
                      )

                      , React.createElement('div', { className: "flex flex-wrap gap-1 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}
                        , turf.sports.map((sport, index) => (
                          React.createElement(Badge, { key: index, variant: "outline", className: "text-xs border-gray-200" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}
                            , sport
                          )
                        ))
                        , turf.courts > 1 && (
                          React.createElement(Badge, { variant: "secondary", className: "text-xs bg-green-100 text-green-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 328}}
                            , turf.courts, " Courts"
                          )
                        )
                      )

                      , React.createElement('div', { className: "flex flex-wrap gap-2 mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 334}}
                        , turf.amenities.slice(0, 4).map((amenity, index) => {
                          const IconComponent = amenityIcons[amenity ] || Trophy
                          return (
                            React.createElement('div', { key: index, className: "flex items-center gap-1 text-xs text-gray-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 338}}
                              , React.createElement(IconComponent, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 339}} )
                              , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 340}}, amenity)
                            )
                          )
                        })
                      )

                      , React.createElement(Button, {
                        className: `w-full transition-colors ${
                          selectedTurf === turf.id
                            ? "bg-green-600 text-white"
                            : "border-gray-200 text-black hover:bg-green-600 hover:text-white"
                        }`,
                        variant: selectedTurf === turf.id ? "default" : "outline", __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}}

                        , selectedTurf === turf.id ? "Selected" : "Book Now"
                      )
                    )
                  )
                )
              ))
            )
          )
        )

        , regularTurfs.length > 0 && (
          React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 365}}
            , React.createElement('h2', { className: "text-2xl font-semibold text-black mb-6"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 366}}, "All Venues" )
            , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 367}}
              , regularTurfs.map((turf) => (
                React.createElement(Card, {
                  key: turf.id,
                  className: `group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-green-300 ${
                    selectedTurf === turf.id ? "ring-2 ring-green-500" : ""
                  }`,
                  onClick: () => handleTurfSelect(turf.id), __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}

                  , React.createElement('div', { className: "relative overflow-hidden rounded-t-lg"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}
                    , React.createElement('img', {
                      src: turf.image || "/placeholder.svg",
                      alt: turf.name,
                      className: "w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}
                    )
                  )
                  , React.createElement(CardHeader, { className: "pb-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}
                    , React.createElement('div', { className: "flex justify-between items-start"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 384}}
                      , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 385}}
                        , React.createElement(CardTitle, { className: "text-lg text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 386}}, turf.name)
                        , React.createElement(CardDescription, { className: "flex items-center gap-1 text-xs text-gray-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 387}}
                          , React.createElement(MapPin, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 388}} )
                          , turf.location
                        )
                      )
                      , React.createElement('div', { className: "text-right", __self: this, __source: {fileName: _jsxFileName, lineNumber: 392}}
                        , React.createElement('div', { className: "text-lg font-bold text-green-600 whitespace-nowrap"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 393}}, renderPrice(turf))
                        , React.createElement('div', { className: "text-xs text-gray-500" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 394}}, "per hour" )
                      )
                    )
                  )
                  , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 398}}
                    , React.createElement('div', { className: "flex items-center gap-4 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 399}}
                      , React.createElement('div', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 400}}
                        , React.createElement(Star, { className: "w-4 h-4 fill-yellow-400 text-yellow-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 401}} )
                        , React.createElement('span', { className: "font-medium text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 402}}, turf.rating)
                        , React.createElement('span', { className: "text-gray-600 text-xs" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 403}}, "(", turf.reviews, ")")
                      )
                      , React.createElement('div', { className: "flex items-center gap-1 text-gray-600 text-xs"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}
                        , React.createElement(Clock, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}} )
                        , turf.openTime, " - "  , turf.closeTime
                      )
                    )

                    , React.createElement('div', { className: "flex flex-wrap gap-1 mb-3"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}}
                      , turf.sports.map((sport, index) => (
                        React.createElement(Badge, { key: index, variant: "outline", className: "text-xs border-gray-200" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 413}}
                          , sport
                        )
                      ))
                      , turf.courts > 1 && (
                        React.createElement(Badge, { variant: "secondary", className: "text-xs bg-green-100 text-green-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}
                          , turf.courts, " Courts"
                        )
                      )
                    )

                    , React.createElement('div', { className: "flex flex-wrap gap-2 mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
                      , turf.amenities.slice(0, 3).map((amenity, index) => {
                        const IconComponent = amenityIcons[amenity ] || Trophy
                        return (
                          React.createElement('div', { key: index, className: "flex items-center gap-1 text-xs text-gray-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 428}}
                            , React.createElement(IconComponent, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}} )
                            , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 430}}, amenity)
                          )
                        )
                      })
                    )

                    , React.createElement(Button, {
                      className: `w-full transition-colors ${
                        selectedTurf === turf.id
                          ? "bg-green-600 text-white"
                          : "border-gray-200 text-black hover:bg-green-600 hover:text-white"
                      }`,
                      variant: selectedTurf === turf.id ? "default" : "outline", __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}

                      , selectedTurf === turf.id ? "Selected" : "Book Now"
                    )
                  )
                )
              ))
            )
          )
        )

        , sortedTurfs.length === 0 && (
          React.createElement('div', { className: "text-center py-12" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 454}}
            , React.createElement(Trophy, { className: "w-12 h-12 text-gray-400 mx-auto mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 455}} )
            , React.createElement('h3', { className: "text-xl font-semibold text-black mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 456}}, "No venues found"  )
            , React.createElement('p', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 457}}, "Try adjusting your search criteria or browse all available sports."         )
          )
        )
      )
    )
  )
}
