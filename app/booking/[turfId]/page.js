// // "use client"
// // import React from "react"
// // const _jsxFileName = "app\\booking\\[turfId]\\page.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

// // import { useState, useEffect } from "react"
// // import { Button } from "@/components/ui/button"
// // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// // import { Badge } from "@/components/ui/badge"
// // import { Calendar } from "@/components/ui/calendar"
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// // import { MapPin, Star, Clock, ArrowLeft, CalendarIcon, CreditCard } from "lucide-react"
// // import Link from "next/link"
// // import { useParams } from "next/navigation"
// // import useSWR from "swr" // bring SWR to booking page for live availability

// // const turfData = {
// //   "super-six-turf": {
// //     name: "Super Six Turf",
// //     location: "Suncity, Batala Road, Amritsar",
// //     rating: 4.8,
// //     reviews: 156,
// //     sports: ["Cricket"],
// //     pricePerHour: 1000,
// //     image: "/cricket-ground-amritsar-nets-practice.png",
// //     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
// //     openTime: "6:00 AM",
// //     closeTime: "10:00 PM",
// //     city: "amritsar",
// //   },
// //   theturfplay: {
// //     name: "theturfplay",
// //     location: "Loharka Road, Amritsar",
// //     rating: 4.7,
// //     reviews: 89,
// //     sports: ["Cricket"],
// //     pricePerHour: 1200,
// //     image: "/cricket-ground-amritsar-nets-practice.png",
// //     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
// //     openTime: "6:00 AM",
// //     closeTime: "10:00 PM",
// //     city: "amritsar",
// //   },
// //   "the-pavilion-amritsar-cricket": {
// //     name: "The Pavilion Amritsar",
// //     location: "Loharka Road, Amritsar",
// //     rating: 4.9,
// //     reviews: 234,
// //     sports: ["Cricket"],
// //     pricePerHour: 1200,
// //     image: "/cricket-ground-amritsar-nets-practice.png",
// //     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
// //     openTime: "6:00 AM",
// //     closeTime: "11:59 PM",
// //     city: "amritsar",
// //   },
// //   "pickleup-amritsar": {
// //     name: "Pickleup Amritsar",
// //     location: "Lumsden Club, Amritsar",
// //     rating: 4.6,
// //     reviews: 67,
// //     sports: ["Pickleball"],
// //     pricePerHour: 600,
// //     courts: 2,
// //     image: "/pickleball-court-amritsar-indoor-modern.png",
// //     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
// //     openTime: "6:00 AM",
// //     closeTime: "11:00 PM",
// //     city: "amritsar",
// //   },
// //   "the-pavilion-amritsar-pickleball": {
// //     name: "The Pavilion Amritsar",
// //     location: "Loharka Road, Amritsar",
// //     rating: 4.8,
// //     reviews: 145,
// //     sports: ["Pickleball"],
// //     pricePerHour: 1000,
// //     courts: 2,
// //     image: "/pickleball-court-amritsar-indoor-modern.png",
// //     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
// //     openTime: "6:00 AM",
// //     closeTime: "11:59 PM",
// //     city: "amritsar",
// //   },
// //   "box-cricket-patiala": {
// //     name: "Box cricket Patiala",
// //     location: "Sheesh Mahal Enclave, Patiala",
// //     rating: 4.5,
// //     reviews: 134,
// //     sports: ["Cricket"],
// //     pricePerHour: 1000,
// //     image: "/sports-complex-patiala-multi-sport-facilities.png",
// //     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
// //     openTime: "6:00 AM",
// //     closeTime: "10:00 PM",
// //     city: "patiala",
// //   },
// //   "pickeball-patiala": {
// //     name: "Pickeball Patiala",
// //     location: "Leela Bhawan, Patiala",
// //     rating: 4.4,
// //     reviews: 45,
// //     sports: ["Pickleball"],
// //     pricePerHour: 600,
// //     courts: 1,
// //     image: "/pickleball-academy-patiala-coaching-courts.png",
// //     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
// //     openTime: "10:00 AM",
// //     closeTime: "10:00 PM",
// //     city: "patiala",
// //   },
// // }

// // const generateTimeSlots = (openTime, closeTime) => {
// //   const slots = []
// //   const parseTime = (timeStr) => {
// //     const [time, period] = timeStr.split(" ")
// //     let [hours, minutes] = time.split(":").map(Number)
// //     if (period === "PM" && hours !== 12) hours += 12
// //     if (period === "AM" && hours === 12) hours = 0
// //     return hours
// //   }

// //   const openHour = parseTime(openTime)
// //   const closeHour = parseTime(closeTime)

// //   for (let hour = openHour; hour < closeHour; hour++) {
// //     const time24 = hour.toString().padStart(2, "0") + ":00"
// //     const time12 =
// //       hour === 0 ? "12:00 AM" : hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`

// //     slots.push({
// //       time: time24,
// //       label: time12,
// //       available: true, // Made all slots available by default
// //       peak: hour >= 16 && hour < 22, // 4 PM to 10 PM peak hours
// //     })
// //   }

// //   return slots
// // }

// // export default function BookingPage() {
// //   const params = useParams()
// //   const turfId = params.turfId 
// //   const turf = turfData[turfId ]

// //   const [selectedDate, setSelectedDate] = useState(new Date())
// //   // const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
// //   const [selectedTimeSlots, setSelectedTimeSlots] = React.useState(new Set())
// //   const [selectedSport, setSelectedSport] = useState("")

// //   useEffect(() => {
// //     if (_optionalChain([turf, 'optionalAccess', _ => _.sports, 'optionalAccess', _2 => _2.length]) === 1 && !selectedSport) {
// //       setSelectedSport(turf.sports[0] )
// //     }
// //   }, [turf, selectedSport])

// //   const dateKey = selectedDate ? selectedDate.toISOString().split("T")[0] : ""
// //   const { data: avail, isLoading: availLoading } = useSWR(
// //     selectedDate ? `/api/public/availability?turfId=${turfId}&date=${dateKey}` : null,
// //     (url) => fetch(url).then((r) => r.json()),
// //     { refreshInterval: 4000 },
// //   )

// //   if (!turf) {
// //     return React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}, "Turf not found"  )
// //   }

// //   const timeSlots = generateTimeSlots(turf.openTime, turf.closeTime)
// //   const blockedHours = new Set(_optionalChain([avail, 'optionalAccess', _3 => _3.blockedHours]) || [])

// //   const getCurrentPrice = () => {
// //     return turf.pricePerHour
// //   }

// //   const handleTimeSlotSelect = (timeSlot) => {
// //     if (blockedHours.has(timeSlot)) return // prevent selecting blocked
// //     setSelectedTimeSlot(timeSlot)
// //   }

// //   const toggleTimeSlot = (time) => {
// //   if (blockedHours.has(time)) return;
// //   setSelectedTimeSlots(prev => {
// //     const next = new Set(prev);
// //     if (next.has(time)) next.delete(time); else next.add(time);
// //     return next;
// //   });
// //   };

// //   const handleProceedToPayment = () => {
// //     const needsSportSelection = turf.sports.length > 1 && !selectedSport
// //     if (!selectedTimeSlot || !selectedDate || needsSportSelection) {
// //       alert("Please select date, time slot, and sport before proceeding")
// //       return
// //     }

// //     const totalAmount = getCurrentPrice()
// //     const advanceAmount = Math.round(totalAmount * 0.1) // 10% advance
// //     const remainingAmount = totalAmount - advanceAmount

// //     const bookingData = {
// //       turfId,
// //       turfName: turf.name,
// //       location: turf.location,
// //       date: selectedDate.toISOString().split("T")[0],
// //       timeSlot: selectedTimeSlot,
// //       sport: selectedSport || turf.sports[0],
// //       totalAmount,
// //       advanceAmount,
// //       remainingAmount,
// //       courts: turf.courts || 1,
// //     }

// //     const queryParams = new URLSearchParams({
// //       booking: JSON.stringify(bookingData),
// //     }).toString()

// //     window.location.href = `/payment?${queryParams}`
// //   }

// //   return (
// //     React.createElement('div', { className: "min-h-screen bg-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}
// //       /* Header */
// //       , React.createElement('header', { className: "border-b border-gray-200 bg-white sticky top-0 z-50"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}
// //         , React.createElement('div', { className: "container mx-auto px-4 py-4 flex items-center justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 213}}
// //           , React.createElement('div', { className: "flex items-center space-x-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 214}}
// //             , React.createElement(Link, { href: `/turfs/${turf.city}`, className: "flex items-center space-x-2 text-gray-600 hover:text-black"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}
// //               , React.createElement(ArrowLeft, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}} )
// //               , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}, "Back to Venues"  )
// //             )
// //             , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}
// //               // , React.createElement('img', { src: "/sportitupp-removebg-preview.png", alt: "SportItUp", className: "h-20", __self: this, __source: {fileName: _jsxFileName, lineNumber: 220}} )
// //               , React.createElement(Link, { href: "/", className: "flex items-center" },
// //   React.createElement('img', {
// //     src: "/sportitupp-removebg-preview.png",
// //     alt: "SportItUp",
// //     className: "h-20 cursor-pointer",
// //   })
// // )
// //             )
// //           )
// //           , React.createElement('div', { className: "flex items-center space-x-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}
// //             , React.createElement('span', { className: "text-sm text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}, "Welcome back!" )
// //             , React.createElement(Button, { variant: "ghost", size: "sm", className: "text-black hover:bg-green-50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}, "Profile"

// //             )
// //           )
// //         )
// //       )

// //       , React.createElement('div', { className: "container mx-auto px-4 py-8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}
// //         , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}
// //           /* Venue Info */
// //           , React.createElement('div', { className: "lg:col-span-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}
// //             , React.createElement(Card, { className: "mb-6 border-gray-200" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}
// //               , React.createElement('div', { className: "flex", __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
// //                 , React.createElement('div', { className: "relative w-48 h-32 overflow-hidden rounded-l-lg"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}
// //                   , React.createElement('img', { src: turf.image || "/placeholder.svg", alt: turf.name, className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 239}} )
// //                 )
// //                 , React.createElement('div', { className: "flex-1 p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}
// //                   , React.createElement('div', { className: "flex justify-between items-start mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}
// //                     , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}
// //                       , React.createElement(CardTitle, { className: "text-xl mb-1 text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}, turf.name)
// //                       , React.createElement(CardDescription, { className: "flex items-center gap-1 text-gray-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}}
// //                         , React.createElement(MapPin, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}} )
// //                         , turf.location
// //                       )
// //                     )
// //                     , React.createElement('div', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}
// //                       , React.createElement(Star, { className: "w-4 h-4 fill-yellow-400 text-yellow-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}} )
// //                       , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}, turf.rating)
// //                       , React.createElement('span', { className: "text-gray-600 text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}, "(", turf.reviews, ")")
// //                     )
// //                   )
// //                   , React.createElement('div', { className: "flex flex-wrap gap-1 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}
// //                     , turf.sports.map((sport, index) => (
// //                       React.createElement(Badge, { key: index, variant: "outline", className: "text-xs border-green-200 text-green-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 258}}
// //                         , sport
// //                       )
// //                     ))
// //                   )
// //                   , React.createElement('div', { className: "flex items-center gap-4 text-sm text-gray-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}
// //                     , React.createElement('div', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}
// //                       , React.createElement(Clock, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}} )
// //                       , turf.openTime, " - "  , turf.closeTime
// //                     )
// //                     , React.createElement('div', { className: "text-green-600 font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}, "₹", turf.pricePerHour, "/hr")
// //                     , turf.courts && turf.courts > 1 && React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}, turf.courts, " courts available"  )
// //                   )
// //                 )
// //               )
// //             )

// //             /* Booking Form */
// //             , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}
// //               /* Sport Selection */
// //               , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}
// //                 , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 279}}
// //                   , React.createElement(CardTitle, { className: "text-lg text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}, "Select Sport" )
// //                 )
// //                 , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}
// //                   , React.createElement(Select, { value: selectedSport, onValueChange: setSelectedSport, __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}
// //                     , React.createElement(SelectTrigger, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
// //                       , React.createElement(SelectValue, { placeholder: turf.sports.length === 1 ? turf.sports[0] : "Choose your sport", __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}} )
// //                     )
// //                     , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}
// //                       , turf.sports.map((sport) => (
// //                         React.createElement(SelectItem, { key: sport, value: sport, __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}}
// //                           , sport, " - ₹"  , turf.pricePerHour, "/hr"
// //                         )
// //                       ))
// //                     )
// //                   )
// //                   , turf.sports.length > 1 && !selectedSport && (
// //                     React.createElement('p', { className: "mt-2 text-xs text-gray-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}, "Please choose a sport to continue."     )
// //                   )
// //                 )
// //               )

// //               /* Date Selection */
// //               , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}
// //                 , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}
// //                   , React.createElement(CardTitle, { className: "text-lg flex items-center gap-2 text-black"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
// //                     , React.createElement(CalendarIcon, { className: "w-5 h-5 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}} ), "Select Date"

// //                   )
// //                 )
// //                 , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}
// //                   , React.createElement(Calendar, {
// //                     mode: "single",
// //                     selected: selectedDate,
// //                     onSelect: setSelectedDate,
// //                     disabled: (date) => date < new Date() || date < new Date("1900-01-01"),
// //                     className: "rounded-md border border-gray-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}
// //                   )
// //                 )
// //               )

// //               /* Time Slots */
// //               , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}
// //                 , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}
// //                   , React.createElement(CardTitle, { className: "text-lg flex items-center gap-2 text-black"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}
// //                     , React.createElement(Clock, { className: "w-5 h-5 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 324}} ), "Available Time Slots (1 Hour Each)"

// //                   )
// //                   , React.createElement(CardDescription, { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}
// //                     , selectedDate ? `Slots for ${selectedDate.toDateString()}` : "Please select a date first"
// //                   )
// //                 )
// //                 , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}
// //                   , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 332}}
// //                     , timeSlots.map((slot) => {
// //                       const disabled = blockedHours.has(slot.time)
// //                       // const isSelected = selectedTimeSlot === slot.time
// //                       const isSelected = selectedTimeSlots.has(slot.time)
// //                       return (
// //                         React.createElement(Button, {
// //                           key: slot.time,
// //                           variant: isSelected ? "default" : "outline",
// //                           className: `relative h-16 flex flex-col items-center justify-center ${
// //                             isSelected
// //                               ? "bg-green-600 hover:bg-green-700 text-white"
// //                               : "border-gray-200 hover:border-green-300 hover:bg-green-50"
// //                           } ${slot.peak ? "border-orange-200 hover:border-orange-300" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`,
// //                           onClick: () => toggleTimeSlot(slot.time),
// //                           disabled: disabled, __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}

// //                           , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}, slot.label)
// //                           , React.createElement('span', { className: "text-xs text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}, "₹", getCurrentPrice())
// //                           , slot.peak && (
// //                             React.createElement(Badge, { className: "absolute -top-1 -right-1 text-xs px-1 py-0 bg-orange-500"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}, "Peak")
// //                           )
// //                           , disabled && React.createElement('span', { className: "absolute bottom-1 text-[10px] text-gray-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}, "Booked")
// //                         )
// //                       )
// //                     })
// //                   )
// //                   , React.createElement('div', { className: "mt-4 flex items-center gap-4 text-sm text-gray-600"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 358}}
// //                     , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 359}}
// //                       , React.createElement('div', { className: "w-3 h-3 border border-gray-300 rounded"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 360}})
// //                       , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 361}}, "Available")
// //                     )
// //                     , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 363}}
// //                       , React.createElement('div', { className: "w-3 h-3 bg-green-600 rounded"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 364}})
// //                       , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 365}}, "Selected")
// //                     )
// //                   )
// //                 )
// //               )
// //             )
// //           )

// //           /* Booking Summary */
// //           , React.createElement('div', { className: "lg:col-span-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}
// //             , React.createElement(Card, { className: "sticky top-24 border-gray-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 375}}
// //               , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}
// //                 , React.createElement(CardTitle, { className: "text-lg text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}, "Booking Summary" )
// //               )
// //               , React.createElement(CardContent, { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}}
// //                 , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 380}}
// //                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 381}}
// //                     , React.createElement('span', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 382}}, "Venue:")
// //                     , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}, turf.name)
// //                   )
// //                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 385}}
// //                     , React.createElement('span', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 386}}, "Sport:")
// //                     , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 387}}, selectedSport || "Not selected")
// //                   )
// //                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}
// //                     , React.createElement('span', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}, "Date:")
// //                     , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}
// //                       , selectedDate ? selectedDate.toDateString() : "Not selected"
// //                     )
// //                   )
// //                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}
// //                     , React.createElement('span', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 396}}, "Time Slot:" )
// //                     , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 397}}
// //                       , selectedTimeSlot ? _optionalChain([timeSlots, 'access', _4 => _4.find, 'call', _5 => _5((s) => s.time === selectedTimeSlot), 'optionalAccess', _6 => _6.label]) : "Not selected"
// //                     )
// //                   )
// //                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 401}}
// //                     , React.createElement('span', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 402}}, "Duration:")
// //                     , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 403}}, "1 hour" )
// //                   )
// //                 )

// //                 , selectedTimeSlot && selectedSport && (
// //                   React.createElement('div', { className: "space-y-2 pt-2 border-t border-gray-200"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}
// //                     , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}}
// //                       , React.createElement('span', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}, "Total Amount:" )
// //                       , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}}, "₹", getCurrentPrice())
// //                     )
// //                     , React.createElement('div', { className: "flex justify-between text-sm text-green-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 413}}
// //                       , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 414}}, "Advance Payment (10%):"  )
// //                       , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 415}}, "₹", Math.round(getCurrentPrice() * 0.1))
// //                     )
// //                     , React.createElement('div', { className: "flex justify-between text-sm text-orange-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 417}}
// //                       , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}, "Pay at Venue:"  )
// //                       , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 419}}, "₹", getCurrentPrice() - Math.round(getCurrentPrice() * 0.1))
// //                     )
// //                   )
// //                 )

// //                 , React.createElement('div', { className: "pt-4 border-t border-gray-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
// //                   , React.createElement(Button, {
// //                     className: "w-full bg-green-600 hover:bg-green-700 text-white"   ,
// //                     size: "lg",
// //                     onClick: handleProceedToPayment,
// //                     disabled: !selectedTimeSlot || !selectedDate || (turf.sports.length > 1 && !selectedSport), __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}}

// //                     , React.createElement(CreditCard, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 431}} ), "Pay ₹"
// //                      , selectedSport || turf.sports.length === 1 ? Math.round(getCurrentPrice() * 0.1) : 0, " Advance"
// //                   )
// //                 )

// //                 , React.createElement('div', { className: "text-xs text-gray-600 pt-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}
// //                   , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}, "• Pay only 10% advance online"     )
// //                   , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}, "• Remaining 90% to be paid at venue"       )
// //                   , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 439}}, "• Booking confirmation via SMS/Email"    )
// //                   , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 440}}, "• Cancellation allowed up to 2 hours before slot"        )
// //                 )
// //               )
// //             )
// //           )
// //         )
// //       )
// //     )
// //   )
// // }

// "use client"
// import React from "react"
// const _jsxFileName = "app\\booking\\[turfId]\\page.tsx"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Calendar } from "@/components/ui/calendar"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { MapPin, Star, Clock, ArrowLeft, CalendarIcon, CreditCard } from "lucide-react"
// import Link from "next/link"
// import { useParams } from "next/navigation"
// import useSWR from "swr" // bring SWR to booking page for live availability

// const turfData = {
//   "super-six-turf": {
//     name: "Super Six Turf",
//     location: "Suncity, Batala Road, Amritsar",
//     rating: 4.8,
//     reviews: 156,
//     sports: ["Cricket"],
//     pricePerHour: 1000,
//     image: "/cricket-ground-amritsar-nets-practice.png",
//     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
//     openTime: "6:00 AM",
//     closeTime: "10:00 PM",
//     city: "amritsar",
//   },
//   theturfplay: {
//     name: "theturfplay",
//     location: "Loharka Road, Amritsar",
//     rating: 4.7,
//     reviews: 89,
//     sports: ["Cricket"],
//     pricePerHour: 1200,
//     image: "/cricket-ground-amritsar-nets-practice.png",
//     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
//     openTime: "6:00 AM",
//     closeTime: "10:00 PM",
//     city: "amritsar",
//   },
//   "the-pavilion-amritsar-cricket": {
//     name: "The Pavilion Amritsar",
//     location: "Loharka Road, Amritsar",
//     rating: 4.9,
//     reviews: 234,
//     sports: ["Cricket"],
//     pricePerHour: 1200,
//     image: "/cricket-ground-amritsar-nets-practice.png",
//     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
//     openTime: "6:00 AM",
//     closeTime: "11:59 PM",
//     city: "amritsar",
//   },
//   "pickleup-amritsar": {
//     name: "Pickleup Amritsar",
//     location: "Lumsden Club, Amritsar",
//     rating: 4.6,
//     reviews: 67,
//     sports: ["Pickleball"],
//     pricePerHour: 600,
//     courts: 2,
//     image: "/pickleball-court-amritsar-indoor-modern.png",
//     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
//     openTime: "6:00 AM",
//     closeTime: "11:00 PM",
//     city: "amritsar",
//   },
//   "the-pavilion-amritsar-pickleball": {
//     name: "The Pavilion Amritsar",
//     location: "Loharka Road, Amritsar",
//     rating: 4.8,
//     reviews: 145,
//     sports: ["Pickleball"],
//     pricePerHour: 1000,
//     courts: 2,
//     image: "/pickleball-court-amritsar-indoor-modern.png",
//     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
//     openTime: "6:00 AM",
//     closeTime: "11:59 PM",
//     city: "amritsar",
//   },
//   "box-cricket-patiala": {
//     name: "Box cricket Patiala",
//     location: "Sheesh Mahal Enclave, Patiala",
//     rating: 4.5,
//     reviews: 134,
//     sports: ["Cricket"],
//     pricePerHour: 1000,
//     image: "/sports-complex-patiala-multi-sport-facilities.png",
//     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
//     openTime: "6:00 AM",
//     closeTime: "10:00 PM",
//     city: "patiala",
//   },
//   "pickeball-patiala": {
//     name: "Pickeball Patiala",
//     location: "Leela Bhawan, Patiala",
//     rating: 4.4,
//     reviews: 45,
//     sports: ["Pickleball"],
//     pricePerHour: 600,
//     courts: 1,
//     image: "/pickleball-academy-patiala-coaching-courts.png",
//     amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
//     openTime: "10:00 AM",
//     closeTime: "10:00 PM",
//     city: "patiala",
//   },
// }

// const generateTimeSlots = (openTime, closeTime) => {
//   const slots = []
//   const parseTime = (timeStr) => {
//     const [time, period] = timeStr.split(" ")
//     let [hours] = time.split(":").map(Number)
//     if (period === "PM" && hours !== 12) hours += 12
//     if (period === "AM" && hours === 12) hours = 0
//     return hours
//   }

//   const openHour = parseTime(openTime)
//   const closeHour = parseTime(closeTime)

//   for (let hour = openHour; hour < closeHour; hour++) {
//     const time24 = hour.toString().padStart(2, "0") + ":00"
//     const time12 =
//       hour === 0 ? "12:00 AM" : hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`

//     slots.push({
//       time: time24,
//       label: time12,
//       available: true, // all slots available by default
//       peak: hour >= 16 && hour < 22, // 4 PM to 10 PM peak hours
//     })
//   }

//   return slots
// }

// export default function BookingPage() {
//   const params = useParams()
//   const turfId = params.turfId 
//   const turf = turfData[turfId ]

//   const [selectedDate, setSelectedDate] = useState(new Date())
//   // MULTI-SELECT: store many slots
//   const [selectedTimeSlots, setSelectedTimeSlots] = React.useState(new Set())
//   const [selectedSport, setSelectedSport] = useState("")

//   useEffect(() => {
//     if (_optionalChain([turf, 'optionalAccess', _ => _.sports, 'optionalAccess', _2 => _2.length]) === 1 && !selectedSport) {
//       setSelectedSport(turf.sports[0] )
//     }
//   }, [turf, selectedSport])

//   const dateKey = selectedDate ? selectedDate.toISOString().split("T")[0] : ""
//   const { data: avail, isLoading: availLoading } = useSWR(
//     selectedDate ? `/api/public/availability?turfId=${turfId}&date=${dateKey}` : null,
//     (url) => fetch(url).then((r) => r.json()),
//     { refreshInterval: 4000 },
//   )

//   if (!turf) {
//     return React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 163}}, "Turf not found"  )
//   }

//   const timeSlots = generateTimeSlots(turf.openTime, turf.closeTime)
//   const blockedHours = new Set(_optionalChain([avail, 'optionalAccess', _3 => _3.blockedHours]) || [])

//   // price per hour for display on each slot
//   const getCurrentPrice = () => turf.pricePerHour

//   // MULTI-SELECT toggler
//   const toggleTimeSlot = (time) => {
//     if (blockedHours.has(time)) return;
//     setSelectedTimeSlots(prev => {
//       const next = new Set(prev);
//       if (next.has(time)) next.delete(time); else next.add(time);
//       return next;
//     });
//   };

//   // Derived totals for multi-slot selection
//   const slotsCount = selectedTimeSlots.size;
//   const totalAmount = slotsCount * turf.pricePerHour;
//   const advanceAmount = Math.round(totalAmount * 0.1);
//   const remainingAmount = totalAmount - advanceAmount;

//   const handleProceedToPayment = () => {
//     const needsSportSelection = turf.sports.length > 1 && !selectedSport
//     if (slotsCount === 0 || !selectedDate || needsSportSelection) {
//       alert("Please select date, at least one time slot, and sport before proceeding")
//       return
//     }

//     const chosenSlots = Array.from(selectedTimeSlots)

//     const bookingData = {
//       turfId,
//       turfName: turf.name,
//       location: turf.location,
//       date: selectedDate.toISOString().split("T")[0],
//       timeSlots: chosenSlots, // <-- multiple
//       sport: selectedSport || turf.sports[0],
//       totalAmount,
//       advanceAmount,
//       remainingAmount,
//       courts: turf.courts || 1,
//     }

//     const queryParams = new URLSearchParams({
//       booking: JSON.stringify(bookingData),
//     }).toString()

//     window.location.href = `/payment?${queryParams}`
//   }

//   return (
//     React.createElement('div', { className: "min-h-screen bg-white" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 210}}
//       /* Header */
//       , React.createElement('header', { className: "border-b border-gray-200 bg-white sticky top-0 z-50"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 212}}
//         , React.createElement('div', { className: "container mx-auto px-4 py-4 flex items-center justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 213}}
//           , React.createElement('div', { className: "flex items-center space-x-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 214}}
//             , React.createElement(Link, { href: `/turfs/${turf.city}`, className: "flex items-center space-x-2 text-gray-600 hover:text-black"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 215}}
//               , React.createElement(ArrowLeft, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 216}} )
//               , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 217}}, "Back to Venues"  )
//             )
//             , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 219}}
//               , React.createElement(Link, { href: "/", className: "flex items-center" },
//                   React.createElement('img', {
//                     src: "/sportitupp-removebg-preview.png",
//                     alt: "SportItUp",
//                     className: "h-20 cursor-pointer",
//                   })
//                 )
//             )
//           )
//           , React.createElement('div', { className: "flex items-center space-x-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 223}}
//             , React.createElement('span', { className: "text-sm text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 224}}, "Welcome back!" )
//             , React.createElement(Button, { variant: "ghost", size: "sm", className: "text-black hover:bg-green-50" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 225}}, "Profile"

//             )
//           )
//         )
//       )

//       , React.createElement('div', { className: "container mx-auto px-4 py-8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 232}}
//         , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 233}}
//           /* Venue Info */
//           , React.createElement('div', { className: "lg:col-span-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 235}}
//             , React.createElement(Card, { className: "mb-6 border-gray-200" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 236}}
//               , React.createElement('div', { className: "flex", __self: this, __source: {fileName: _jsxFileName, lineNumber: 237}}
//                 , React.createElement('div', { className: "relative w-48 h-32 overflow-hidden rounded-l-lg"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 238}}
//                   , React.createElement('img', { src: turf.image || "/placeholder.svg", alt: turf.name, className: "w-full h-full object-cover"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 239}} )
//                 )
//                 , React.createElement('div', { className: "flex-1 p-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 241}}
//                   , React.createElement('div', { className: "flex justify-between items-start mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 242}}
//                     , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 243}}
//                       , React.createElement(CardTitle, { className: "text-xl mb-1 text-black"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 244}}, turf.name)
//                       , React.createElement(CardDescription, { className: "flex items-center gap-1 text-gray-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 245}}
//                         , React.createElement(MapPin, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 246}} )
//                         , turf.location
//                       )
//                     )
//                     , React.createElement('div', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 250}}
//                       , React.createElement(Star, { className: "w-4 h-4 fill-yellow-400 text-yellow-400"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 251}} )
//                       , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 252}}, turf.rating)
//                       , React.createElement('span', { className: "text-gray-600 text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 253}}, "(", turf.reviews, ")")
//                     )
//                   )
//                   , React.createElement('div', { className: "flex flex-wrap gap-1 mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 256}}
//                     , turf.sports.map((sport, index) => (
//                       React.createElement(Badge, { key: index, variant: "outline", className: "text-xs border-green-200 text-green-700"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 258}}
//                         , sport
//                       )
//                     ))
//                   )
//                   , React.createElement('div', { className: "flex items-center gap-4 text-sm text-gray-600"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 263}}
//                     , React.createElement('div', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 264}}
//                       , React.createElement(Clock, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 265}} )
//                       , turf.openTime, " - "  , turf.closeTime
//                     )
//                     , React.createElement('div', { className: "text-green-600 font-medium" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 268}}, "₹", turf.pricePerHour, "/hr")
//                     , turf.courts && turf.courts > 1 && React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 269}}, turf.courts, " courts available"  )
//                   )
//                 )
//               )
//             )

//             /* Booking Form */
//             , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 276}}
//               /* Sport Selection */
//               , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 278}}
//                 , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 279}}
//                   , React.createElement(CardTitle, { className: "text-lg text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 280}}, "Select Sport" )
//                 )
//                 , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 282}}
//                   , React.createElement(Select, { value: selectedSport, onValueChange: setSelectedSport, __self: this, __source: {fileName: _jsxFileName, lineNumber: 283}}
//                     , React.createElement(SelectTrigger, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 284}}
//                       , React.createElement(SelectValue, { placeholder: turf.sports.length === 1 ? turf.sports[0] : "Choose your sport", __self: this, __source: {fileName: _jsxFileName, lineNumber: 285}} )
//                     )
//                     , React.createElement(SelectContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 287}}
//                       , turf.sports.map((sport) => (
//                         React.createElement(SelectItem, { key: sport, value: sport, __self: this, __source: {fileName: _jsxFileName, lineNumber: 289}}
//                           , sport, " - ₹"  , turf.pricePerHour, "/hr"
//                         )
//                       ))
//                     )
//                   )
//                   , turf.sports.length > 1 && !selectedSport && (
//                     React.createElement('p', { className: "mt-2 text-xs text-gray-500"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 296}}, "Please choose a sport to continue."     )
//                   )
//                 )
//               )

//               /* Date Selection */
//               , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 302}}
//                 , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 303}}
//                   , React.createElement(CardTitle, { className: "text-lg flex items-center gap-2 text-black"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 304}}
//                     , React.createElement(CalendarIcon, { className: "w-5 h-5 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 305}} ), "Select Date"

//                   )
//                 )
//                 , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 309}}
//                   , React.createElement(Calendar, {
//                     mode: "single",
//                     selected: selectedDate,
//                     onSelect: setSelectedDate,
//                     disabled: (date) => date < new Date() || date < new Date("1900-01-01"),
//                     className: "rounded-md border border-gray-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 310}}
//                   )
//                 )
//               )

//               /* Time Slots */
//               , React.createElement(Card, { className: "border-gray-200", __self: this, __source: {fileName: _jsxFileName, lineNumber: 321}}
//                 , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 322}}
//                   , React.createElement(CardTitle, { className: "text-lg flex items-center gap-2 text-black"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 323}}
//                     , React.createElement(Clock, { className: "w-5 h-5 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 324}} ), "Available Time Slots (1 Hour Each)"

//                   )
//                   , React.createElement(CardDescription, { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 327}}
//                     , selectedDate ? `Slots for ${selectedDate.toDateString()}` : "Please select a date first"
//                   )
//                 )
//                 , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 331}}
//                   , React.createElement('div', { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 332}}
//                     , timeSlots.map((slot) => {
//                       const disabled = blockedHours.has(slot.time)
//                       const isSelected = selectedTimeSlots.has(slot.time)
//                       return (
//                         React.createElement(Button, {
//                           key: slot.time,
//                           variant: isSelected ? "default" : "outline",
//                           className: `relative h-16 flex flex-col items-center justify-center ${
//                             isSelected
//                               ? "bg-green-600 hover:bg-green-700 text-white"
//                               : "border-gray-200 hover:border-green-300 hover:bg-green-50"
//                           } ${slot.peak ? "border-orange-200 hover:border-orange-300" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`,
//                           onClick: () => toggleTimeSlot(slot.time),
//                           disabled: disabled, __self: this, __source: {fileName: _jsxFileName, lineNumber: 337}}

//                           , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}, slot.label)
//                           , React.createElement('span', { className: "text-xs text-gray-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}, "₹", getCurrentPrice())
//                           , slot.peak && (
//                             React.createElement(Badge, { className: "absolute -top-1 -right-1 text-xs px-1 py-0 bg-orange-500"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 351}}, "Peak")
//                           )
//                           , disabled && React.createElement('span', { className: "absolute bottom-1 text-[10px] text-gray-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}, "Booked")
//                         )
//                       )
//                     })
//                   )
//                   , React.createElement('div', { className: "mt-4 flex items-center gap-4 text-sm text-gray-600"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 358}}
//                     , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 359}}
//                       , React.createElement('div', { className: "w-3 h-3 border border-gray-300 rounded"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 360}})
//                       , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 361}}, "Available")
//                     )
//                     , React.createElement('div', { className: "flex items-center gap-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 363}}
//                       , React.createElement('div', { className: "w-3 h-3 bg-green-600 rounded"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 364}})
//                       , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 365}}, "Selected")
//                     )
//                   )
//                 )
//               )
//             )
//           )

//           /* Booking Summary */
//           , React.createElement('div', { className: "lg:col-span-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}
//             , React.createElement(Card, { className: "sticky top-24 border-gray-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 375}}
//               , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 376}}
//                 , React.createElement(CardTitle, { className: "text-lg text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 377}}, "Booking Summary" )
//               )
//               , React.createElement(CardContent, { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}}
//                 , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 380}}
//                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 381}}
//                     , React.createElement('span', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 382}}, "Venue:")
//                     , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}, turf.name)
//                   )
//                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 385}}
//                     , React.createElement('span', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 386}}, "Sport:")
//                     , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 387}}, selectedSport || "Not selected")
//                   )
//                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}
//                     , React.createElement('span', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}, "Date:")
//                     , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}
//                       , selectedDate ? selectedDate.toDateString() : "Not selected"
//                     )
//                   )
//                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 395}}
//                     , React.createElement('span', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 396}}, "Time Slots:" )
//                     , React.createElement('span', { className: "font-medium text-black text-right" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 397}}
//                       , slotsCount > 0
//                         ? Array.from(selectedTimeSlots).map(t => {
//                             const found = timeSlots.find(s => s.time === t);
//                             return found ? found.label : t;
//                           }).join(", ")
//                         : "Not selected"
//                     )
//                   )
//                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 401}}
//                     , React.createElement('span', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 402}}, "Duration:")
//                     , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 403}}, slotsCount || 0, " hour", slotsCount === 1 ? "" : "s" )
//                   )
//                 )

//                 , slotsCount > 0 && selectedSport && (
//                   React.createElement('div', { className: "space-y-2 pt-2 border-t border-gray-200"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}}
//                     , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}}
//                       , React.createElement('span', { className: "text-gray-600", __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}, "Total Amount:" )
//                       , React.createElement('span', { className: "font-medium text-black" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}}, "₹", totalAmount)
//                     )
//                     , React.createElement('div', { className: "flex justify-between text-sm text-green-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 413}}
//                       , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 414}}, "Advance Payment (10%):"  )
//                       , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 415}}, "₹", advanceAmount)
//                     )
//                     , React.createElement('div', { className: "flex justify-between text-sm text-orange-600"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 417}}
//                       , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 418}}, "Pay at Venue:"  )
//                       , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 419}}, "₹", remainingAmount)
//                     )
//                   )
//                 )

//                 , React.createElement('div', { className: "pt-4 border-t border-gray-200"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
//                   , React.createElement(Button, {
//                     className: "w-full bg-green-600 hover:bg-green-700 text-white"   ,
//                     size: "lg",
//                     onClick: handleProceedToPayment,
//                     disabled: slotsCount === 0 || !selectedDate || (turf.sports.length > 1 && !selectedSport), __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}}

//                     , React.createElement(CreditCard, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 431}} ), "Pay ₹"
//                      , (selectedSport || turf.sports.length === 1) ? advanceAmount : 0, " Advance"
//                   )
//                 )

//                 , React.createElement('div', { className: "text-xs text-gray-600 pt-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}
//                   , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 437}}, "• Pay only 10% advance online"     )
//                   , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 438}}, "• Remaining 90% to be paid at venue"       )
//                   , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 439}}, "• Booking confirmation via SMS/Email"    )
//                   , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 440}}, "• Cancellation allowed up to 2 hours before slot"        )
//                 )
//               )
//             )
//           )
//         )
//       )
//     )
//   )
// }

// app/booking/[turfId]/page.js
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR, { mutate } from "swr";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Clock, ArrowLeft, CalendarIcon, CreditCard } from "lucide-react";

const fetcher = (url) => fetch(url).then((r) => r.json());

/**
 * Local turf dataset (same as before)
 * If you fetch turfs remotely in your app, replace this with the remote call.
 */
const turfData = {
  "super-six-turf": {
    name: "Super Six Turf",
    location: "Suncity, Batala Road, Amritsar",
    rating: 4.8,
    reviews: 156,
    sports: ["Cricket"],
    pricePerHour: 1000,
    image: "/cricket-ground-amritsar-nets-practice.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "10:00 PM",
    city: "amritsar",
  },
  theturfplay: {
    name: "theturfplay",
    location: "Loharka Road, Amritsar",
    rating: 4.7,
    reviews: 89,
    sports: ["Cricket"],
    pricePerHour: 1200,
    image: "/cricket-ground-amritsar-nets-practice.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "10:00 PM",
    city: "amritsar",
  },
  "the-pavilion-amritsar-cricket": {
    name: "The Pavilion Amritsar",
    location: "Loharka Road, Amritsar",
    rating: 4.9,
    reviews: 234,
    sports: ["Cricket"],
    pricePerHour: 1200,
    image: "/cricket-ground-amritsar-nets-practice.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "11:59 PM",
    city: "amritsar",
  },
  "pickleup-amritsar": {
    name: "Pickleup Amritsar",
    location: "Lumsden Club, Amritsar",
    rating: 4.6,
    reviews: 67,
    sports: ["Pickleball"],
    pricePerHour: 600,
    courts: 2,
    image: "/pickleball-court-amritsar-indoor-modern.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "11:00 PM",
    city: "amritsar",
  },
  "the-pavilion-amritsar-pickleball": {
    name: "The Pavilion Amritsar",
    location: "Loharka Road, Amritsar",
    rating: 4.8,
    reviews: 145,
    sports: ["Pickleball"],
    pricePerHour: 1000,
    courts: 2,
    image: "/pickleball-court-amritsar-indoor-modern.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "11:59 PM",
    city: "amritsar",
  },
  "box-cricket-patiala": {
    name: "Box cricket Patiala",
    location: "Sheesh Mahal Enclave, Patiala",
    rating: 4.5,
    reviews: 134,
    sports: ["Cricket"],
    pricePerHour: 1000,
    image: "/sports-complex-patiala-multi-sport-facilities.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "10:00 PM",
    city: "patiala",
  },
  "pickeball-patiala": {
    name: "Pickeball Patiala",
    location: "Leela Bhawan, Patiala",
    rating: 4.4,
    reviews: 45,
    sports: ["Pickleball"],
    pricePerHour: 600,
    courts: 1,
    image: "/pickleball-academy-patiala-coaching-courts.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "10:00 AM",
    closeTime: "10:00 PM",
    city: "patiala",
  },
};

const generateTimeSlots = (openTime, closeTime) => {
  const slots = [];
  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    let [hours] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours;
  };

  const openHour = parseTime(openTime);
  const closeHour = parseTime(closeTime);

  for (let hour = openHour; hour < closeHour; hour++) {
    const time24 = hour.toString().padStart(2, "0") + ":00";
    const time12 =
      hour === 0 ? "12:00 AM" : hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`;

    slots.push({
      time: time24,
      label: time12,
      available: true,
      peak: hour >= 16 && hour < 22,
    });
  }

  return slots;
};

export default function BookingPage() {
  const params = useParams();
  const turfId = params?.turfId;
  const turf = turfData[turfId];

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTimeSlots, setSelectedTimeSlots] = useState(() => new Set());
  const [selectedSport, setSelectedSport] = useState("");

  useEffect(() => {
    if (turf?.sports?.length === 1 && !selectedSport) {
      setSelectedSport(turf.sports[0]);
    }
  }, [turf, selectedSport]);

  const dateKey = selectedDate ? selectedDate.toISOString().split("T")[0] : "";

  const availabilityUrl = dateKey
    ? `/api/public/availability?turfId=${encodeURIComponent(turfId)}&date=${encodeURIComponent(dateKey)}`
    : null;

  const { data: avail, error: availError } = useSWR(availabilityUrl, fetcher, {
    refreshInterval: 4000,
    revalidateOnFocus: false,
  });

  // set of blocked times from sheet
  const blockedHours = useMemo(() => new Set(avail?.blockedHours || []), [avail]);

  if (!turf) {
    return <div>Turf not found</div>;
  }

  const timeSlots = generateTimeSlots(turf.openTime, turf.closeTime);

  const toggleTimeSlot = (time) => {
    if (blockedHours.has(time)) return;
    setSelectedTimeSlots((prev) => {
      const next = new Set(prev);
      if (next.has(time)) next.delete(time);
      else next.add(time);
      return next;
    });
  };

  // Derived totals for multi-slot selection
  const slotsCount = selectedTimeSlots.size;
  const totalAmount = slotsCount * turf.pricePerHour;
  const advanceAmount = Math.round(totalAmount * 0.1);
  const remainingAmount = totalAmount - advanceAmount;

  // Before proceeding, re-check availability to prevent a stale booking race
  const handleProceedToPayment = async () => {
    const needsSportSelection = turf.sports.length > 1 && !selectedSport;
    if (slotsCount === 0 || !selectedDate || needsSportSelection) {
      alert("Please select date, at least one time slot, and sport before proceeding");
      return;
    }

    // refresh availability just prior to proceeding
    if (availabilityUrl) {
      try {
        const fresh = await fetch(availabilityUrl).then((r) => r.json());
        const freshBlocked = new Set(fresh?.blockedHours || []);
        const conflicts = Array.from(selectedTimeSlots).filter((s) => freshBlocked.has(s));
        if (conflicts.length > 0) {
          alert(`Sorry — these slots were just booked: ${conflicts.join(", ")}. Please reselect.`);
          // revalidate SWR so UI updates
          mutate(availabilityUrl);
          return;
        }
      } catch (err) {
        console.error("Failed to refresh availability:", err);
        // continue — but ideally block if we can't confirm
      }
    }

    const chosenSlots = Array.from(selectedTimeSlots);

    const bookingData = {
      turfId,
      turfName: turf.name,
      location: turf.location,
      date: selectedDate.toISOString().split("T")[0],
      timeSlots: chosenSlots,
      sport: selectedSport || turf.sports?.[0],
      totalAmount,
      advanceAmount,
      remainingAmount,
      courts: turf.courts || 1,
    };

    const queryParams = new URLSearchParams({
      booking: JSON.stringify(bookingData),
    }).toString();

    // navigate to payment with booking payload
    window.location.href = `/payment?${queryParams}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href={`/turfs/${turf.city}`} className="flex items-center space-x-2 text-gray-600 hover:text-black">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Venues</span>
            </Link>

            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center">
                <img src="/sportitupp-removebg-preview.png" alt="SportItUp" className="h-20 cursor-pointer" />
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Welcome back!</span>
            <Button variant="ghost" size="sm" className="text-black hover:bg-green-50">
              Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Venue Info + Booking Form */}
          <div className="lg:col-span-2">
            <Card className="mb-6 border-gray-200">
              <div className="flex">
                <div className="relative w-48 h-32 overflow-hidden rounded-l-lg">
                  <img src={turf.image || "/placeholder.svg"} alt={turf.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <CardTitle className="text-xl mb-1 text-black">{turf.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 text-gray-600">
                        <MapPin className="w-3 h-3" /> {turf.location}
                      </CardDescription>
                    </div>

                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium text-black">{turf.rating}</span>
                      <span className="text-gray-600 text-sm">({turf.reviews})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {turf.sports.map((sport, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-green-200 text-green-700">
                        {sport}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {turf.openTime} - {turf.closeTime}
                    </div>
                    <div className="text-green-600 font-medium">₹{turf.pricePerHour}/hr</div>
                    {turf.courts && turf.courts > 1 && <div>{turf.courts} courts available</div>}
                  </div>
                </div>
              </div>
            </Card>

            {/* Booking Form */}
            <div className="space-y-6">
              {/* Sport */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg text-black">Select Sport</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedSport} onValueChange={setSelectedSport}>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder={turf.sports.length === 1 ? turf.sports[0] : "Choose your sport"} />
                    </SelectTrigger>
                    <SelectContent>
                      {turf.sports.map((sport) => (
                        <SelectItem key={sport} value={sport}>
                          {sport} - ₹{turf.pricePerHour}/hr
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {turf.sports.length > 1 && !selectedSport && (
                    <p className="mt-2 text-xs text-gray-500">Please choose a sport to continue.</p>
                  )}
                </CardContent>
              </Card>

              {/* Date */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-black">
                    <CalendarIcon className="w-5 h-5 text-green-600" /> Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(d) => d < new Date() || d < new Date("1900-01-01")}
                    className="rounded-md border border-gray-200"
                  />
                </CardContent>
              </Card>

              {/* Time Slots */}
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-black">
                    <Clock className="w-5 h-5 text-green-600" /> Available Time Slots (1 Hour Each)
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {selectedDate ? `Slots for ${selectedDate.toDateString()}` : "Please select a date first"}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {timeSlots.map((slot) => {
                      const disabled = blockedHours.has(slot.time);
                      const isSelected = selectedTimeSlots.has(slot.time);
                      return (
                        <Button
                          key={slot.time}
                          variant={isSelected ? "default" : "outline"}
                          className={`relative h-16 flex flex-col items-center justify-center ${
                            isSelected
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                          } ${slot.peak ? "border-orange-200 hover:border-orange-300" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                          onClick={() => toggleTimeSlot(slot.time)}
                          disabled={disabled}
                        >
                          <span className="font-medium">{slot.label}</span>
                          <span className="text-xs text-gray-600">₹{turf.pricePerHour}</span>
                          {slot.peak && <Badge className="absolute -top-1 -right-1 text-xs px-1 py-0 bg-orange-500">Peak</Badge>}
                          {disabled && <span className="absolute bottom-1 text-[10px] text-gray-600">Booked</span>}
                        </Button>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border border-gray-300 rounded" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-600 rounded" />
                      <span>Selected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-black">Booking Summary</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Venue:</span>
                    <span className="font-medium text-black">{turf.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Sport:</span>
                    <span className="font-medium text-black">{selectedSport || "Not selected"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-black">{selectedDate ? selectedDate.toDateString() : "Not selected"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time Slots:</span>
                    <span className="font-medium text-black text-right">
                      {slotsCount > 0
                        ? Array.from(selectedTimeSlots)
                            .map((t) => {
                              const f = timeSlots.find((s) => s.time === t);
                              return f ? f.label : t;
                            })
                            .join(", ")
                        : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-black">{slotsCount || 0} hour{slotsCount === 1 ? "" : "s"}</span>
                  </div>
                </div>

                {slotsCount > 0 && selectedSport && (
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium text-black">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Advance Payment (10%):</span>
                      <span className="font-medium">₹{advanceAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Pay at Venue:</span>
                      <span className="font-medium">₹{remainingAmount}</span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                    onClick={handleProceedToPayment}
                    disabled={slotsCount === 0 || !selectedDate || (turf.sports.length > 1 && !selectedSport)}
                  >
                    <CreditCard className="w-4 h-4 mr-2 inline-block" /> Pay ₹{(selectedSport || turf.sports.length === 1) ? advanceAmount : 0} Advance
                  </Button>
                </div>

                <div className="text-xs text-gray-600 pt-2">
                  <p>• Pay only 10% advance online</p>
                  <p>• Remaining 90% to be paid at venue</p>
                  <p>• Booking confirmation via SMS/Email</p>
                  <p>• Cancellation allowed up to 2 hours before slot</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
