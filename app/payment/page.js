// "use client"
// import React from "react"
// const _jsxFileName = "app\\payment\\page.tsx"; function _nullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }

// import { useState, useMemo } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { Separator } from "@/components/ui/separator"
// import { MapPin, Trophy, CreditCard, Smartphone, Wallet, Shield, ArrowLeft, CheckCircle } from "lucide-react"
// import Link from "next/link"
// import { useSearchParams } from "next/navigation"
// import UpiQr from "@/components/payment/upi-qr"

// const turfData = {
//   "sports-arena-mumbai": {
//     name: "Mumbai Sports Arena",
//     location: "Bandra West, Mumbai",
//     image: "/mumbai-sports-arena-cricket-ground.png",
//   },
// }

// const timeSlotLabels = {
//   "06:00": "6:00 AM",
//   "07:00": "7:00 AM",
//   "08:00": "8:00 AM",
//   "09:00": "9:00 AM",
//   "10:00": "10:00 AM",
//   "11:00": "11:00 AM",
//   "12:00": "12:00 PM",
//   "13:00": "1:00 PM",
//   "14:00": "2:00 PM",
//   "15:00": "3:00 PM",
//   "16:00": "4:00 PM",
//   "17:00": "5:00 PM",
//   "18:00": "6:00 PM",
//   "19:00": "7:00 PM",
//   "20:00": "8:00 PM",
//   "21:00": "9:00 PM",
//   "22:00": "10:00 PM",
// }







// async function loadRazorpayScript() {
//   if (typeof window === "undefined") return
//   if (window.Razorpay) return
//   const existing = document.getElementById("razorpay-checkout-js")
//   if (existing) {
//     // already loading/loaded
//     return new Promise((resolve) => {
//       existing.addEventListener("load", () => resolve(), { once: true })
//       // if it was already loaded before we attached the listener, resolve on next tick
//       if ((existing ).readyState === "complete") resolve()
//     })
//   }
//   await new Promise((resolve, reject) => {
//     const s = document.createElement("script")
//     s.id = "razorpay-checkout-js"
//     s.src = "https://checkout.razorpay.com/v1/checkout.js"
//     s.async = true
//     s.onload = () => resolve()
//     s.onerror = () => reject(new Error("Failed to load Razorpay"))
//     document.body.appendChild(s)
//   })
// }

// export default function PaymentPage() {
//   const searchParams = useSearchParams()
//   const [paymentMethod, setPaymentMethod] = useState("upi")
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [paymentSuccess, setPaymentSuccess] = useState(false)
//   const [detailsSaved, setDetailsSaved] = useState(false)
//   const [customer, setCustomer] = useState({
//     name: "",
//     phone: "",
//     email: "",
//   })
//   const [savingDetails, setSavingDetails] = useState(false)
//   const [saveError, setSaveError] = useState(null)

//   const [formData, setFormData] = useState({
//     upiId: "",
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     cardholderName: "",
//     walletProvider: "paytm",
//   })

//   const bookingParam = searchParams.get("booking")

//   const bookingData = useMemo(() => {
//     if (!bookingParam) return null
//     try {
//       const parsed = JSON.parse(decodeURIComponent(bookingParam))
//       if (_optionalChain([parsed, 'optionalAccess', _ => _.date])) parsed.date = new Date(parsed.date)
//       return parsed 
//     } catch (err) {
//       console.error("[v0] Failed to parse booking param:", err)
//       return null
//     }
//   }, [bookingParam])

//   const turf = turfData[_optionalChain([bookingData, 'optionalAccess', _2 => _2.turfId]) ]
//   const bookingDate = _optionalChain([bookingData, 'optionalAccess', _3 => _3.date]) ? new Date(bookingData.date ) : new Date()

//   const durationHours =
//     _nullishCoalesce(_optionalChain([(bookingData ), 'optionalAccess', _4 => _4.duration]), () => (
//     (Array.isArray(_optionalChain([(bookingData ), 'optionalAccess', _5 => _5.timeSlots])) ? (bookingData ).timeSlots.length : 1)))

//   const totalDisplay =
//     _nullishCoalesce(_nullishCoalesce(_optionalChain([(bookingData ), 'optionalAccess', _6 => _6.totalAmount]), () => (
//     _optionalChain([(bookingData ), 'optionalAccess', _7 => _7.total]))), () => (
//     (typeof _optionalChain([(bookingData ), 'optionalAccess', _8 => _8.advanceAmount]) === "number" ? (bookingData ).advanceAmount : 0)))

//   const handleInputChange = (field, value) => {
//     setFormData((prev) => ({ ...prev, [field]: value }))
//   }

//   const handlePayment = async () => {
//     setIsProcessing(true)

//     if (paymentMethod === "upi" && !formData.upiId) {
//       alert("Please enter your UPI ID")
//       setIsProcessing(false)
//       return
//     }

//     if (paymentMethod === "card") {
//       if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
//         alert("Please fill all card details")
//         setIsProcessing(false)
//         return
//       }
//     }

//     if (paymentMethod === "razorpay") {
//       await loadRazorpayScript()
//       if (!window.Razorpay) {
//         alert("Failed to load Razorpay")
//         setIsProcessing(false)
//         return
//       }

//       const options = {
//         key: "YOUR_KEY_HERE", // Enter the Key ID generated from the Dashboard
//         amount: payNowAmount * 100, // Amount is in currency subunits. Hence, 29935 refers to 29935 paise or INR 299.35.
//         currency: "INR",
//         name: "SportItUp",
//         description: "Sports Venue Booking Payment",
//         image: "/placeholder.svg",
//         order_id: "order_9A33XWu1A5Lw34", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
//         handler: (response) => {
//           console.log(response)
//           setIsProcessing(false)
//           setPaymentSuccess(true)
//         },
//         prefill: {
//           name: customer.name,
//           email: customer.email,
//           contact: customer.phone,
//         },
//         notes: {
//           address: "Razorpay Corporate Office",
//         },
//         theme: {
//           color: "#3399cc",
//         },
//       }

//       const rzp1 = new window.Razorpay(options)
//       rzp1.open()
//       return
//     }

//     setTimeout(() => {
//       console.log("[v0] Payment processed:", {
//         bookingData,
//         paymentMethod,
//         formData,
//       })
//       setIsProcessing(false)
//       setPaymentSuccess(true)
//     }, 3000)
//   }

//   const handleSaveDetails = async () => {
//     setSaveError(null)
//     if (!customer.name || !customer.phone || !customer.email) {
//       setSaveError("Please enter your name, phone and email.")
//       return
//     }
//     try {
//       setSavingDetails(true)
//       const dateStr =
//         _optionalChain([(bookingData ), 'optionalAccess', _9 => _9.date]) || (_optionalChain([bookingData, 'optionalAccess', _10 => _10.date]) ? new Date(bookingData.date).toISOString().split("T")[0] : "")
//       const timeSlot =
//         Array.isArray(_optionalChain([bookingData, 'optionalAccess', _11 => _11.timeSlots])) && _optionalChain([bookingData, 'optionalAccess', _12 => _12.timeSlots, 'access', _13 => _13.length]) > 0
//           ? _optionalChain([bookingData, 'optionalAccess', _14 => _14.timeSlots, 'access', _15 => _15[0]])
//           : _optionalChain([(bookingData ), 'optionalAccess', _16 => _16.timeSlot]) || ""

//       // 1) Save to Google Sheets
//       const saveRes = await fetch("/api/public/lead", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: customer.name,
//           phone: customer.phone,
//           email: customer.email,
//           turfId: _optionalChain([bookingData, 'optionalAccess', _17 => _17.turfId]),
//           turfName: _optionalChain([(bookingData ), 'optionalAccess', _18 => _18.turfName]) || _optionalChain([turf, 'optionalAccess', _19 => _19.name]) || "Selected Venue",
//           location: _optionalChain([(bookingData ), 'optionalAccess', _20 => _20.location]) || _optionalChain([turf, 'optionalAccess', _21 => _21.location]) || "-",
//           date: dateStr,
//           timeSlot,
//           duration: durationHours, // include duration in Google Sheet
//           amount: _nullishCoalesce(_nullishCoalesce(_optionalChain([(bookingData ), 'optionalAccess', _22 => _22.advanceAmount]), () => ( _optionalChain([bookingData, 'optionalAccess', _23 => _23.total]))), () => ( 0)),
//         }),
//       })
//       if (!saveRes.ok) {
//         const msg = await saveRes.text()
//         throw new Error(msg || "Failed to save details")
//       }
//       setDetailsSaved(true)

//       // 2) Create Razorpay order on server
//       const orderAmount =
//         _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_optionalChain([(bookingData ), 'optionalAccess', _24 => _24.advanceAmount]), () => ( _optionalChain([(bookingData ), 'optionalAccess', _25 => _25.totalAmount]))), () => ( _optionalChain([bookingData, 'optionalAccess', _26 => _26.total]))), () => ( 0))
//       const orderRes = await fetch("/api/payments/razorpay/order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           amount: Number(orderAmount),
//           currency: "INR",
//           notes: {
//             turfId: _optionalChain([bookingData, 'optionalAccess', _27 => _27.turfId]) || "",
//             turfName: _optionalChain([(bookingData ), 'optionalAccess', _28 => _28.turfName]) || _optionalChain([turf, 'optionalAccess', _29 => _29.name]) || "Selected Venue",
//             date: dateStr,
//             timeSlot,
//             duration: durationHours,
//             customerName: customer.name,
//             customerPhone: customer.phone,
//             customerEmail: customer.email,
//           },
//         }),
//       })
//       if (!orderRes.ok) {
//         const t = await orderRes.text()
//         throw new Error(t || "Failed to create order")
//       }
//       const order = await orderRes.json()

//       // 3) Lazy-load Razorpay script
//       await loadRazorpayScript()
//       if (!window.Razorpay) throw new Error("Razorpay not available")

//       // 4) Open Checkout
//       const rzp = new window.Razorpay({
//         key: order.keyId,
//         amount: order.amount,
//         currency: order.currency,
//         name: "SportItUp",
//         description: `Booking: ${_optionalChain([(bookingData ), 'optionalAccess', _30 => _30.turfName]) || _optionalChain([turf, 'optionalAccess', _31 => _31.name]) || "Selected Venue"}`,
//         order_id: order.orderId,
//         prefill: {
//           name: customer.name,
//           email: customer.email,
//           contact: customer.phone,
//         },
//         notes: {
//           turfId: _optionalChain([bookingData, 'optionalAccess', _32 => _32.turfId]) || "",
//           date: dateStr,
//           timeSlot,
//           duration: durationHours,
//         },
//         handler: async (response) => {
//           // Optional: append payment response to Google Sheets as a new row
//           try {
//             await fetch("/api/public/lead", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 name: customer.name,
//                 phone: customer.phone,
//                 email: customer.email,
//                 turfId: _optionalChain([bookingData, 'optionalAccess', _33 => _33.turfId]),
//                 turfName: _optionalChain([(bookingData ), 'optionalAccess', _34 => _34.turfName]) || _optionalChain([turf, 'optionalAccess', _35 => _35.name]) || "Selected Venue",
//                 location: _optionalChain([(bookingData ), 'optionalAccess', _36 => _36.location]) || _optionalChain([turf, 'optionalAccess', _37 => _37.location]) || "-",
//                 date: dateStr,
//                 timeSlot,
//                 duration: durationHours,
//                 amount: orderAmount,
//                 razorpayPaymentId: _optionalChain([response, 'optionalAccess', _38 => _38.razorpay_payment_id]) || "",
//                 razorpayOrderId: _optionalChain([response, 'optionalAccess', _39 => _39.razorpay_order_id]) || "",
//                 razorpaySignature: _optionalChain([response, 'optionalAccess', _40 => _40.razorpay_signature]) || "",
//               }),
//             })
//           } catch (e) {
//             // non-blocking
//             console.log("[v0] Failed to append payment row:", e)
//           }
//           setPaymentSuccess(true)
//         },
//         theme: { color: "#16a34a" },
//       })
//       rzp.open()
//     } catch (e) {
//       setSaveError(e.message || "Failed to continue to payment")
//     } finally {
//       setSavingDetails(false)
//     }
//   }

//   const displaySlots =
//     Array.isArray(_optionalChain([bookingData, 'optionalAccess', _41 => _41.timeSlots])) && _optionalChain([bookingData, 'optionalAccess', _42 => _42.timeSlots, 'access', _43 => _43.length]) > 0
//       ? _optionalChain([bookingData, 'optionalAccess', _44 => _44.timeSlots])
//       : _optionalChain([(bookingData ), 'optionalAccess', _45 => _45.timeSlot])
//         ? [(bookingData ).timeSlot]
//         : []

//   const payNowAmount =
//     _nullishCoalesce(_nullishCoalesce(_nullishCoalesce(_optionalChain([(bookingData ), 'optionalAccess', _46 => _46.advanceAmount]), () => ( _optionalChain([(bookingData ), 'optionalAccess', _47 => _47.totalAmount]))), () => ( _optionalChain([bookingData, 'optionalAccess', _48 => _48.total]))), () => ( 0))
//   const turfName = _nullishCoalesce(_optionalChain([(bookingData ), 'optionalAccess', _49 => _49.turfName]), () => ( (_optionalChain([turf, 'optionalAccess', _50 => _50.name]) || "Selected Venue")))
//   const turfLocation = _nullishCoalesce(_optionalChain([(bookingData ), 'optionalAccess', _51 => _51.location]), () => ( (_optionalChain([turf, 'optionalAccess', _52 => _52.location]) || "-")))

//   if (paymentSuccess) {
//     return (
//       React.createElement('div', { className: "min-h-screen bg-background flex items-center justify-center p-4"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 342}}
//         , React.createElement(Card, { className: "w-full max-w-2xl text-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 343}}
//           , React.createElement(CardContent, { className: "pt-8 pb-8" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 344}}
//             , React.createElement('div', { className: "w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"        , __self: this, __source: {fileName: _jsxFileName, lineNumber: 345}}
//               , React.createElement(CheckCircle, { className: "w-8 h-8 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 346}} )
//             )
//             , React.createElement('h1', { className: "text-3xl font-bold text-foreground mb-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 348}}, "Booking Confirmed!" )
//             , React.createElement('p', { className: "text-muted-foreground text-lg mb-6"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 349}}, "Your sports venue has been successfully booked. You'll receive a confirmation SMS and email shortly."

//             )

//             , React.createElement('div', { className: "bg-card p-6 rounded-lg border mb-6 text-left"     , __self: this, __source: {fileName: _jsxFileName, lineNumber: 353}}
//               , React.createElement('h3', { className: "font-semibold mb-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 354}}, "Booking Details" )
//               , React.createElement('div', { className: "space-y-2 text-sm" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 355}}
//                 , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 356}}
//                   , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 357}}, "Booking ID:" )
//                   , React.createElement('span', { className: "font-mono", __self: this, __source: {fileName: _jsxFileName, lineNumber: 358}}, "SPT", Date.now().toString().slice(-6))
//                 )
//                 , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 360}}
//                   , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 361}}, "Venue:")
//                   , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 362}}, turfName)
//                 )
//                 , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 364}}
//                   , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 365}}, "Sport:")
//                   , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 366}}, _optionalChain([bookingData, 'optionalAccess', _53 => _53.sport]))
//                 )
//                 , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 368}}
//                   , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 369}}, "Date:")
//                   , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 370}}, bookingDate.toDateString())
//                 )
//                 , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 372}}
//                   , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 373}}, "Time Slots:" )
//                   , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 374}}
//                     , displaySlots.map((slot) => timeSlotLabels[slot ] || slot).join(", ")
//                   )
//                 )
//                 , React.createElement('div', { className: "flex justify-between" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 378}}
//                   , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 379}}, "Duration:")
//                   , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 380}}, durationHours, " hour(s)" )
//                 )
//                 , React.createElement('div', { className: "flex justify-between font-semibold"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 382}}
//                   , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 383}}, "Total Paid:" )
//                   , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 384}}, "₹", totalDisplay)
//                 )
//               )
//             )

//             , React.createElement('div', { className: "flex flex-col sm:flex-row gap-4 justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 389}}
//               , React.createElement(Button, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 390}}
//                 , React.createElement(Link, { href: "/locations", __self: this, __source: {fileName: _jsxFileName, lineNumber: 391}}, "Book Another Venue"  )
//               )
//               , React.createElement(Button, { variant: "outline", asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 393}}
//                 , React.createElement(Link, { href: "/", __self: this, __source: {fileName: _jsxFileName, lineNumber: 394}}, "Back to Home"  )
//               )
//             )
//           )
//         )
//       )
//     )
//   }

//   if (!bookingData) {
//     return (
//       React.createElement('div', { className: "min-h-screen bg-background flex items-center justify-center"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 405}}
//         , React.createElement(Card, { className: "w-full max-w-md text-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 406}}
//           , React.createElement(CardContent, { className: "pt-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 407}}
//             , React.createElement(Trophy, { className: "w-12 h-12 text-muted-foreground mx-auto mb-4"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 408}} )
//             , React.createElement('h3', { className: "text-lg font-semibold mb-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 409}}, "No booking data found"   )
//             , React.createElement('p', { className: "text-muted-foreground mb-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 410}}, "Please start your booking from the beginning."      )
//             , React.createElement(Button, { asChild: true, __self: this, __source: {fileName: _jsxFileName, lineNumber: 411}}
//               , React.createElement(Link, { href: "/locations", __self: this, __source: {fileName: _jsxFileName, lineNumber: 412}}, "Start Booking" )
//             )
//           )
//         )
//       )
//     )
//   }

//   return (
//     React.createElement('div', { className: "min-h-screen bg-background" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 421}}
//       , React.createElement('header', { className: "border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 422}}
//         , React.createElement('div', { className: "container mx-auto px-4 py-4 flex items-center justify-between"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 423}}
//           , React.createElement('div', { className: "flex items-center space-x-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 424}}
//             , React.createElement(Link, {
//               href: `/booking/${bookingData.turfId}`,
//               className: "flex items-center space-x-2 text-muted-foreground hover:text-foreground"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 425}}

//               , React.createElement(ArrowLeft, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 429}} )
//               , React.createElement('span', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 430}}, "Back to Booking"  )
//             )
//             , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 432}}
//               , React.createElement('div', { className: "w-8 h-8 bg-primary rounded-full flex items-center justify-center"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 433}}
//                 , React.createElement(Trophy, { className: "w-5 h-5 text-primary-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 434}} )
//               )
//               , React.createElement('span', { className: "text-xl font-bold text-foreground"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 436}}, "SportItUp")
//             )
//           )
//           , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 439}}
//             , React.createElement(Shield, { className: "w-4 h-4 text-green-600"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 440}} )
//             , React.createElement('span', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 441}}, "Secure Payment" )
//           )
//         )
//       )

//       , React.createElement('div', { className: "container mx-auto px-4 py-8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 446}}
//         , React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-8"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 447}}
//           , React.createElement('div', { className: "lg:col-span-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 448}}
//             , React.createElement('div', { className: "space-y-6", __self: this, __source: {fileName: _jsxFileName, lineNumber: 449}}
//               , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 450}}
//                 , React.createElement('h1', { className: "text-3xl font-bold text-foreground mb-2"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 451}}, "Complete Your Booking"  )
//                 , React.createElement('p', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 452}}, "First enter your details. After saving, you can proceed to payment."

//                 )
//               )

//               , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 457}}
//                 , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 458}}
//                   , React.createElement(CardTitle, { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 459}}, "Your Details" )
//                 )
//                 , React.createElement(CardContent, { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 461}}
//                   , React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 462}}
//                     , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 463}}
//                       , React.createElement(Label, { htmlFor: "custName", __self: this, __source: {fileName: _jsxFileName, lineNumber: 464}}, "Full Name" )
//                       , React.createElement(Input, {
//                         id: "custName",
//                         type: "text",
//                         placeholder: "Your full name"  ,
//                         value: customer.name,
//                         onChange: (e) => setCustomer((s) => ({ ...s, name: e.target.value })), __self: this, __source: {fileName: _jsxFileName, lineNumber: 465}}
//                       )
//                     )
//                     , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 473}}
//                       , React.createElement(Label, { htmlFor: "custPhone", __self: this, __source: {fileName: _jsxFileName, lineNumber: 474}}, "Phone Number" )
//                       , React.createElement(Input, {
//                         id: "custPhone",
//                         type: "tel",
//                         placeholder: "99999 99999" ,
//                         value: customer.phone,
//                         onChange: (e) => setCustomer((s) => ({ ...s, phone: e.target.value })), __self: this, __source: {fileName: _jsxFileName, lineNumber: 475}}
//                       )
//                     )
//                     , React.createElement('div', { className: "space-y-2 md:col-span-2" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 483}}
//                       , React.createElement(Label, { htmlFor: "custEmail", __self: this, __source: {fileName: _jsxFileName, lineNumber: 484}}, "Email")
//                       , React.createElement(Input, {
//                         id: "custEmail",
//                         type: "email",
//                         placeholder: "you@example.com",
//                         value: customer.email,
//                         onChange: (e) => setCustomer((s) => ({ ...s, email: e.target.value })), __self: this, __source: {fileName: _jsxFileName, lineNumber: 485}}
//                       )
//                     )
//                   )
//                   , saveError && React.createElement('p', { className: "text-sm text-red-600" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 494}}, saveError)
//                   , !detailsSaved ? (
//                     React.createElement(Button, { onClick: handleSaveDetails, disabled: savingDetails, __self: this, __source: {fileName: _jsxFileName, lineNumber: 496}}
//                       , savingDetails ? "Saving..." : "Save Details & Continue"
//                     )
//                   ) : (
//                     React.createElement('div', { className: "flex items-center gap-2 text-green-700"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 500}}
//                       , React.createElement(CheckCircle, { className: "w-4 h-4" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 501}} )
//                       , React.createElement('span', { className: "text-sm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 502}}, "Details saved. You can proceed to payment."      )
//                     )
//                   )
//                 )
//               )

//               , detailsSaved && (
//                 React.createElement(React.Fragment, null
//                   , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 510}}
//                     , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 511}}
//                       , React.createElement(CardTitle, { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 512}}, "Payment Method" )
//                     )
//                     , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 514}}
//                       , React.createElement(RadioGroup, { value: paymentMethod, onValueChange: setPaymentMethod, className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 515}}
//                         , React.createElement('div', { className: "flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 516}}
//                           , React.createElement(RadioGroupItem, { value: "upi", id: "upi", __self: this, __source: {fileName: _jsxFileName, lineNumber: 517}} )
//                           , React.createElement('div', { className: "flex items-center space-x-3 flex-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 518}}
//                             , React.createElement(Smartphone, { className: "w-5 h-5 text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 519}} )
//                             , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 520}}
//                               , React.createElement(Label, { htmlFor: "upi", className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 521}}, "UPI"

//                               )
//                               , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 524}}, "Pay using Google Pay, PhonePe, Paytm, etc."

//                               )
//                             )
//                           )
//                           , React.createElement(Badge, { variant: "secondary", className: "bg-green-100 text-green-700" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 529}}, "Instant"

//                           )
//                         )

//                         , React.createElement('div', { className: "flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 534}}
//                           , React.createElement(RadioGroupItem, { value: "card", id: "card", __self: this, __source: {fileName: _jsxFileName, lineNumber: 535}} )
//                           , React.createElement('div', { className: "flex items-center space-x-3 flex-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 536}}
//                             , React.createElement(CreditCard, { className: "w-5 h-5 text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 537}} )
//                             , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 538}}
//                               , React.createElement(Label, { htmlFor: "card", className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 539}}, "Credit/Debit Card"

//                               )
//                               , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 542}}, "Visa, Mastercard, RuPay"  )
//                             )
//                           )
//                         )

//                         , React.createElement('div', { className: "flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 547}}
//                           , React.createElement(RadioGroupItem, { value: "wallet", id: "wallet", __self: this, __source: {fileName: _jsxFileName, lineNumber: 548}} )
//                           , React.createElement('div', { className: "flex items-center space-x-3 flex-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 549}}
//                             , React.createElement(Wallet, { className: "w-5 h-5 text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 550}} )
//                             , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 551}}
//                               , React.createElement(Label, { htmlFor: "wallet", className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 552}}, "Digital Wallet"

//                               )
//                               , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 555}}, "Paytm, Amazon Pay, MobiKwik"   )
//                             )
//                           )
//                         )

//                         , React.createElement('div', { className: "flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50"      , __self: this, __source: {fileName: _jsxFileName, lineNumber: 560}}
//                           , React.createElement(RadioGroupItem, { value: "razorpay", id: "razorpay", __self: this, __source: {fileName: _jsxFileName, lineNumber: 561}} )
//                           , React.createElement('div', { className: "flex items-center space-x-3 flex-1"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 562}}
//                             , React.createElement(Shield, { className: "w-5 h-5 text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 563}} )
//                             , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 564}}
//                               , React.createElement(Label, { htmlFor: "razorpay", className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 565}}, "Razorpay"

//                               )
//                               , React.createElement('p', { className: "text-sm text-muted-foreground" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 568}}, "Secure payment gateway"  )
//                             )
//                           )
//                         )
//                       )
//                     )
//                   )

//                   , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 576}}
//                     , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 577}}
//                       , React.createElement(CardTitle, { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 578}}, "Payment Details" )
//                     )
//                     , React.createElement(CardContent, { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 580}}
//                       , paymentMethod === "upi" && (
//                         React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 582}}
//                           , React.createElement(Label, { htmlFor: "upiId", __self: this, __source: {fileName: _jsxFileName, lineNumber: 583}}, "UPI ID" )
//                           , React.createElement(Input, {
//                             id: "upiId",
//                             type: "text",
//                             placeholder: "yourname@paytm",
//                             value: formData.upiId,
//                             onChange: (e) => handleInputChange("upiId", e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 584}}
//                           )
//                         )
//                       )

//                       , paymentMethod === "card" && (
//                         React.createElement('div', { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 595}}
//                           , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 596}}
//                             , React.createElement(Label, { htmlFor: "cardNumber", __self: this, __source: {fileName: _jsxFileName, lineNumber: 597}}, "Card Number" )
//                             , React.createElement(Input, {
//                               id: "cardNumber",
//                               type: "text",
//                               placeholder: "1234 5678 9012 3456"   ,
//                               value: formData.cardNumber,
//                               onChange: (e) => handleInputChange("cardNumber", e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 598}}
//                             )
//                           )
//                           , React.createElement('div', { className: "grid grid-cols-2 gap-4"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 606}}
//                             , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 607}}
//                               , React.createElement(Label, { htmlFor: "expiryDate", __self: this, __source: {fileName: _jsxFileName, lineNumber: 608}}, "Expiry Date" )
//                               , React.createElement(Input, {
//                                 id: "expiryDate",
//                                 type: "text",
//                                 placeholder: "MM/YY",
//                                 value: formData.expiryDate,
//                                 onChange: (e) => handleInputChange("expiryDate", e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 609}}
//                               )
//                             )
//                             , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 617}}
//                               , React.createElement(Label, { htmlFor: "cvv", __self: this, __source: {fileName: _jsxFileName, lineNumber: 618}}, "CVV")
//                               , React.createElement(Input, {
//                                 id: "cvv",
//                                 type: "text",
//                                 placeholder: "123",
//                                 value: formData.cvv,
//                                 onChange: (e) => handleInputChange("cvv", e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 619}}
//                               )
//                             )
//                           )
//                           , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 628}}
//                             , React.createElement(Label, { htmlFor: "cardholderName", __self: this, __source: {fileName: _jsxFileName, lineNumber: 629}}, "Cardholder Name" )
//                             , React.createElement(Input, {
//                               id: "cardholderName",
//                               type: "text",
//                               placeholder: "John Doe" ,
//                               value: formData.cardholderName,
//                               onChange: (e) => handleInputChange("cardholderName", e.target.value), __self: this, __source: {fileName: _jsxFileName, lineNumber: 630}}
//                             )
//                           )
//                         )
//                       )

//                       , paymentMethod === "wallet" && (
//                         React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 642}}
//                           , React.createElement(Label, { htmlFor: "walletProvider", __self: this, __source: {fileName: _jsxFileName, lineNumber: 643}}, "Select Wallet" )
//                           , React.createElement(RadioGroup, {
//                             value: formData.walletProvider,
//                             onValueChange: (value) => handleInputChange("walletProvider", value),
//                             className: "flex flex-col space-y-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 644}}

//                             , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 649}}
//                               , React.createElement(RadioGroupItem, { value: "paytm", id: "paytm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 650}} )
//                               , React.createElement(Label, { htmlFor: "paytm", __self: this, __source: {fileName: _jsxFileName, lineNumber: 651}}, "Paytm")
//                             )
//                             , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 653}}
//                               , React.createElement(RadioGroupItem, { value: "amazonpay", id: "amazonpay", __self: this, __source: {fileName: _jsxFileName, lineNumber: 654}} )
//                               , React.createElement(Label, { htmlFor: "amazonpay", __self: this, __source: {fileName: _jsxFileName, lineNumber: 655}}, "Amazon Pay" )
//                             )
//                             , React.createElement('div', { className: "flex items-center space-x-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 657}}
//                               , React.createElement(RadioGroupItem, { value: "mobikwik", id: "mobikwik", __self: this, __source: {fileName: _jsxFileName, lineNumber: 658}} )
//                               , React.createElement(Label, { htmlFor: "mobikwik", __self: this, __source: {fileName: _jsxFileName, lineNumber: 659}}, "MobiKwik")
//                             )
//                           )
//                         )
//                       )
//                     )
//                   )

//                   , React.createElement(Card, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 667}}
//                     , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 668}}
//                       , React.createElement(CardTitle, { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 669}}, "Scan to Pay (UPI)"   )
//                     )
//                     , React.createElement(CardContent, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 671}}
//                       , React.createElement(UpiQr, {
//                         upiId: "9988993456@pthdfc",
//                         amount: payNowAmount,
//                         merchantName: "SportItUp",
//                         qrImageUrl: "/images/upi-qr.jpg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 672}}
//                       )
//                       , React.createElement('p', { className: "text-xs text-muted-foreground mt-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 678}}, "Scan the QR in your UPI app or copy the UPI ID above. After successful payment, click Pay to confirm."


//                       )
//                     )
//                   )
//                 )
//               )
//             )
//           )

//           , React.createElement('div', { className: "lg:col-span-1", __self: this, __source: {fileName: _jsxFileName, lineNumber: 689}}
//             , React.createElement(Card, { className: "sticky top-24" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 690}}
//               , React.createElement(CardHeader, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 691}}
//                 , React.createElement(CardTitle, { className: "text-lg", __self: this, __source: {fileName: _jsxFileName, lineNumber: 692}}, "Booking Summary" )
//               )
//               , React.createElement(CardContent, { className: "space-y-4", __self: this, __source: {fileName: _jsxFileName, lineNumber: 694}}
//                 , React.createElement('div', { className: "flex items-center space-x-3"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 695}}
//                   , React.createElement('img', {
//                     src: _optionalChain([turf, 'optionalAccess', _54 => _54.image]) || "/placeholder.svg",
//                     alt: turfName,
//                     className: "w-12 h-12 rounded-lg object-cover"   , __self: this, __source: {fileName: _jsxFileName, lineNumber: 696}}
//                   )
//                   , React.createElement('div', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 701}}
//                     , React.createElement('h4', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 702}}, turfName)
//                     , React.createElement('p', { className: "text-sm text-muted-foreground flex items-center gap-1"    , __self: this, __source: {fileName: _jsxFileName, lineNumber: 703}}
//                       , React.createElement(MapPin, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 704}} )
//                       , turfLocation
//                     )
//                   )
//                 )

//                 , React.createElement(Separator, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 710}} )

//                 , React.createElement('div', { className: "space-y-2", __self: this, __source: {fileName: _jsxFileName, lineNumber: 712}}
//                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 713}}
//                     , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 714}}, "Sport:")
//                     , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 715}}, _optionalChain([bookingData, 'optionalAccess', _55 => _55.sport]))
//                   )
//                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 717}}
//                     , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 718}}, "Date:")
//                     , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 719}}, bookingDate.toDateString())
//                   )
//                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 721}}
//                     , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 722}}, "Time:")
//                     , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 723}}
//                       , displaySlots
//                         .map((slot) => timeSlotLabels[slot ] || slot)
//                         .join(", ")
//                     )
//                   )
//                   , React.createElement('div', { className: "flex justify-between text-sm"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 729}}
//                     , React.createElement('span', { className: "text-muted-foreground", __self: this, __source: {fileName: _jsxFileName, lineNumber: 730}}, "Duration:")
//                     , React.createElement('span', { className: "font-medium", __self: this, __source: {fileName: _jsxFileName, lineNumber: 731}}, durationHours, " hour(s)" )
//                   )
//                 )

//                 , React.createElement(Separator, {__self: this, __source: {fileName: _jsxFileName, lineNumber: 735}} )

//                 , React.createElement('div', { className: "flex justify-between items-center"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 737}}
//                   , React.createElement('span', { className: "font-semibold", __self: this, __source: {fileName: _jsxFileName, lineNumber: 738}}, "Total Amount:" )
//                   , React.createElement('span', { className: "text-2xl font-bold text-primary"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 739}}, "₹", totalDisplay)
//                 )

//                 , detailsSaved && (
//                   React.createElement(Button, { className: "w-full", size: "lg", onClick: handlePayment, disabled: isProcessing, __self: this, __source: {fileName: _jsxFileName, lineNumber: 743}}
//                     , isProcessing ? (
//                       React.createElement(React.Fragment, null
//                         , React.createElement('div', { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"       , __self: this, __source: {fileName: _jsxFileName, lineNumber: 746}}), "Processing..."

//                       )
//                     ) : (
//                       React.createElement(React.Fragment, null
//                         , React.createElement(CreditCard, { className: "w-4 h-4 mr-2"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 751}} ), "Pay ₹"
//                          , payNowAmount
//                       )
//                     )
//                   )
//                 )

//                 , React.createElement('div', { className: "text-xs text-muted-foreground space-y-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 758}}
//                   , React.createElement('p', { className: "flex items-center gap-1"  , __self: this, __source: {fileName: _jsxFileName, lineNumber: 759}}
//                     , React.createElement(Shield, { className: "w-3 h-3" , __self: this, __source: {fileName: _jsxFileName, lineNumber: 760}} ), "Your payment is secured with 256-bit SSL encryption"

//                   )
//                   , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 763}}, "• Instant confirmation via SMS & Email"      )
//                   , React.createElement('p', {__self: this, __source: {fileName: _jsxFileName, lineNumber: 764}}, "• 100% refund on cancellation (T&C apply)"      )
//                 )
//               )
//             )
//           )
//         )
//       )
//     )
//   )
// }

"use client";

/**
 * Payment Page (Next.js App Router, JavaScript)
 * - Reads booking from ?booking=...
 * - Supports multiple timeSlots
 * - Charges 10% advance via Razorpay (server route: /api/payments/razorpay/order)
 * - ⬇️ CHANGED: Google Sheet is updated only AFTER payment success via /api/public/booking/confirm
 */

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Trophy,
  CreditCard,
  Smartphone,
  Wallet,
  Shield,
  ArrowLeft,
  CheckCircle,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import UpiQr from "@/components/payment/upi-qr";

const TIME_LABELS = {
  "06:00": "6:00 AM",
  "07:00": "7:00 AM",
  "08:00": "8:00 AM",
  "09:00": "9:00 AM",
  "10:00": "10:00 AM",
  "11:00": "11:00 AM",
  "12:00": "12:00 PM",
  "13:00": "1:00 PM",
  "14:00": "2:00 PM",
  "15:00": "3:00 PM",
  "16:00": "4:00 PM",
  "17:00": "5:00 PM",
  "18:00": "6:00 PM",
  "19:00": "7:00 PM",
  "20:00": "8:00 PM",
  "21:00": "9:00 PM",
  "22:00": "10:00 PM",
};

function safeParseBooking(bookingParam) {
  if (!bookingParam) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(bookingParam));
    if (parsed.date) parsed.date = new Date(parsed.date);
    if (parsed.timeSlot && !parsed.timeSlots) parsed.timeSlots = [parsed.timeSlot];
    if (!Array.isArray(parsed.timeSlots)) parsed.timeSlots = [];
    if (parsed.totalAmount != null) parsed.totalAmount = Number(parsed.totalAmount);
    if (parsed.advanceAmount != null) parsed.advanceAmount = Number(parsed.advanceAmount);
    if (parsed.pricePerHour != null) parsed.pricePerHour = Number(parsed.pricePerHour);
    return parsed;
  } catch (e) {
    console.error("[payment] booking parse error:", e);
    return null;
  }
}

async function loadRazorpayScript() {
  if (typeof window === "undefined") return;
  if (window.Razorpay) return;
  const id = "razorpay-checkout-js";
  const existing = document.getElementById(id);
  if (existing) {
    await new Promise((res) => {
      if (existing.readyState === "complete") return res();
      existing.addEventListener("load", () => res(), { once: true });
    });
    return;
  }
  await new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.id = id;
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(s);
  });
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const bookingParam = searchParams.get("booking");

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [detailsSaved, setDetailsSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [confirmError, setConfirmError] = useState(null);

  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [formData, setFormData] = useState({
    upiId: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    walletProvider: "paytm",
  });

  const booking = useMemo(() => safeParseBooking(bookingParam), [bookingParam]);

  const timeSlots = Array.isArray(booking?.timeSlots) ? booking.timeSlots : [];
  const durationHours =
    booking?.duration && Number.isFinite(booking.duration)
      ? booking.duration
      : timeSlots.length > 0
      ? timeSlots.length
      : 1;

  const totalAmount =
    booking?.totalAmount ??
    booking?.total ??
    (booking?.pricePerHour ? Number(booking.pricePerHour) * Math.max(1, durationHours) : 0);

  const advanceAmount = booking?.advanceAmount ?? Math.round(totalAmount * 0.1);
  const remainingAmount = Math.max(totalAmount - advanceAmount, 0);

  const RAZORPAY_KEY =
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_RAZORPAY_KEY : undefined;

  const handleInputChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  // ⬇️ CHANGED: details are only validated & "saved" locally; no Google Sheet write here
  const handleSaveDetails = async () => {
    setSaveError(null);
    if (!customer.name || !customer.phone || !customer.email) {
      setSaveError("Please enter your name, phone and email.");
      return;
    }
    setDetailsSaved(true);
  };

  // Call server to confirm booking AFTER successful payment
  // async function confirmBookingOnServer(paymentMeta) {
  //   try {
  //     setConfirmError(null);
  //     setIsConfirming(true);

  //     const dateStr =
  //       booking?.date instanceof Date
  //         ? booking.date.toISOString().split("T")[0]
  //         : booking?.date || "";

  //     const payload = {
  //       // who & how much
  //       name: customer.name,
  //       phone: customer.phone,
  //       email: customer.email,
  //       totalAmount,
  //       advanceAmount,
  //       remainingAmount,

  //       // what & when
  //       turfId: booking?.turfId || "",
  //       turfName: booking?.turfName || "Venue",
  //       location: booking?.location || "-",
  //       date: dateStr,
  //       timeSlots,

  //       // meta
  //       sport: booking?.sport || "",
  //       city: booking?.city || "",
  //       paymentMethod,
  //       paymentMeta, // includes razorpay ids or "simulated" flag
  //     };

  //     const res = await fetch("/api/public/booking/confirm", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!res.ok) {
  //       const msg = await res.text();
  //       throw new Error(msg || "Failed to record booking");
  //     }
  //   } catch (e) {
  //     setConfirmError(e.message || "Failed to record booking");
  //   } finally {
  //     setIsConfirming(false);
  //   }
  // }

  const handlePayment = async () => {
    setIsProcessing(true);

    if (paymentMethod === "upi" && !formData.upiId) {
      alert("Please enter your UPI ID");
      setIsProcessing(false);
      return;
    }
    if (paymentMethod === "card") {
      const { cardNumber, expiryDate, cvv, cardholderName } = formData;
      if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        alert("Please fill all card details");
        setIsProcessing(false);
        return;
      }
    }

    try {
      if (paymentMethod === "razorpay") {
        if (!RAZORPAY_KEY) {
          alert("Razorpay key is not configured. Set NEXT_PUBLIC_RAZORPAY_KEY.");
          setIsProcessing(false);
          return;
        }

        await loadRazorpayScript();
        if (!window.Razorpay) {
          alert("Failed to load Razorpay");
          setIsProcessing(false);
          return;
        }

        const orderResp = await fetch("/api/payments/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: advanceAmount, // ₹
            currency: "INR",
            notes: {
              turfId: booking?.turfId || "",
              turfName: booking?.turfName || "Venue",
              date:
                booking?.date instanceof Date
                  ? booking.date.toISOString().split("T")[0]
                  : String(booking?.date || ""),
              timeSlots: timeSlots.join(","),
            },
          }),
        });

        if (!orderResp.ok) {
          const text = await orderResp.text();
          throw new Error(text || "Failed to create order");
        }

        const order = await orderResp.json();

        const rzp = new window.Razorpay({
          key: RAZORPAY_KEY,
          amount: order.amountInPaise || order.amount || advanceAmount * 100,
          currency: order.currency || "INR",
          name: "SportItUp",
          description: `Booking: ${booking?.turfName || "Venue"}`,
          image: "/placeholder.svg",
          order_id: order.id,
          handler: async (response) => {
            // Payment succeeded -> record booking on server, THEN show success
            await confirmBookingOnServer({
              provider: "razorpay",
              orderId: order.id,
              amountInPaise: order.amountInPaise || order.amount,
              payment_id: response?.razorpay_payment_id,
              razorpay_order_id: response?.razorpay_order_id,
              razorpay_signature: response?.razorpay_signature,
            });
            setIsProcessing(false);
            setPaymentSuccess(true);
          },
          prefill: {
            name: customer.name,
            email: customer.email,
            contact: customer.phone,
          },
          notes: {
            turfId: booking?.turfId || "",
            timeSlots: timeSlots.join(","),
          },
          theme: { color: "#16a34a" },
        });

        rzp.open();
        return;
      }

      // Simulate success for UPI/Card/Wallet paths → then confirm on server
      setTimeout(async () => {
        await confirmBookingOnServer({
          provider: paymentMethod,
          simulated: true,
          amount: advanceAmount,
        });
        setIsProcessing(false);
        setPaymentSuccess(true);
      }, 1000);
    } catch (err) {
      console.error("[payment] error:", err);
      alert(err?.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  // ---------- RENDER ----------

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No booking data found</h3>
            <p className="text-muted-foreground mb-4">
              Please start your booking from the beginning.
            </p>
            <Button asChild>
              <Link href="/locations">Start Booking</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bookingDate =
    booking.date instanceof Date ? booking.date : new Date(booking.date || Date.now());
  const slotsLabel =
    timeSlots.length > 0 ? timeSlots.map((t) => TIME_LABELS[t] || t).join(", ") : "—";

  // Success screen
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg mb-6">
              {isConfirming
                ? "Finalizing your booking..."
                : confirmError
                ? "Booked, but we couldn't log the record. We'll fix this shortly."
                : "You’ll receive a confirmation SMS and email shortly."}
            </p>

            <div className="bg-card p-6 rounded-lg border mb-6 text-left">
              <h3 className="font-semibold mb-4">Booking Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue:</span>
                  <span>{booking?.turfName || "Selected Venue"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sport:</span>
                  <span>{booking?.sport || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{bookingDate.toDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Slots:</span>
                  <span>{slotsLabel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-medium">{durationHours} hour(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-medium">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Paid Online (10% advance):</span>
                  <span className="font-semibold text-green-700">₹{advanceAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-600">Remaining (Pay at Venue):</span>
                  <span className="font-semibold text-orange-600">₹{remainingAmount}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link href="/locations">Book Another Venue</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main payment page
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href={`/booking/${booking.turfId}`}
              className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Booking</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2">
  <img
    src="/sportitupp-removebg-preview.png"
    alt="SportItUp"
    className="h-20 w-auto cursor-pointer"
  />
  <span className="sr-only">SportItUp Home</span>
</Link>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-green-600" />
            <span className="text-sm text-muted-foreground">Secure Payment</span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Intro */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Booking</h1>
              <p className="text-muted-foreground">
                Enter your details, then choose a payment method to pay the 10% advance.
              </p>
            </div>

            {/* Customer details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="custName">Full Name</Label>
                    <Input
                      id="custName"
                      type="text"
                      placeholder="Your full name"
                      value={customer.name}
                      onChange={(e) => setCustomer((s) => ({ ...s, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="custPhone">Phone Number</Label>
                    <Input
                      id="custPhone"
                      type="tel"
                      placeholder="99999 99999"
                      value={customer.phone}
                      onChange={(e) => setCustomer((s) => ({ ...s, phone: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="custEmail">Email</Label>
                    <Input
                      id="custEmail"
                      type="email"
                      placeholder="you@example.com"
                      value={customer.email}
                      onChange={(e) => setCustomer((s) => ({ ...s, email: e.target.value }))}
                    />
                  </div>
                </div>

                {saveError && <p className="text-sm text-red-600">{saveError}</p>}

                {!detailsSaved ? (
                  <Button onClick={handleSaveDetails}>Save Details & Continue</Button>
                ) : (
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Details saved. You can proceed to payment.</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment method */}
            {detailsSaved && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                      className="space-y-4"
                    >
                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
                        <RadioGroupItem value="upi" id="upi" />
                        <div className="flex items-center space-x-3 flex-1">
                          <Smartphone className="w-5 h-5 text-primary" />
                          <div>
                            <Label htmlFor="upi" className="font-medium">
                              UPI
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Google Pay, PhonePe, Paytm, etc.
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          Instant
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
                        <RadioGroupItem value="card" id="card" />
                        <div className="flex items-center space-x-3 flex-1">
                          <CreditCard className="w-5 h-5 text-primary" />
                          <div>
                            <Label htmlFor="card" className="font-medium">
                              Credit/Debit Card
                            </Label>
                            <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
                        <RadioGroupItem value="wallet" id="wallet" />
                        <div className="flex items-center space-x-3 flex-1">
                          <Wallet className="w-5 h-5 text-primary" />
                          <div>
                            <Label htmlFor="wallet" className="font-medium">
                              Digital Wallet
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Paytm, Amazon Pay, MobiKwik
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
                        <RadioGroupItem value="razorpay" id="razorpay" />
                        <div className="flex items-center space-x-3 flex-1">
                          <Shield className="w-5 h-5 text-primary" />
                          <div>
                            <Label htmlFor="razorpay" className="font-medium">
                              Razorpay
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {RAZORPAY_KEY ? "Secure payment gateway" : "Razorpay not configured"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </RadioGroup>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {paymentMethod === "upi" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="upiId">Your UPI ID</Label>
                          <Input
                            id="upiId"
                            type="text"
                            placeholder="yourname@paytm"
                            value={formData.upiId}
                            onChange={(e) => handleInputChange("upiId", e.target.value)}
                          />
                        </div>
                        {formData.upiId && (
                          <UpiQr
                            upiId={formData.upiId}
                            amount={advanceAmount}
                            merchantName={booking?.turfName || "SportItUp"}
                          />
                        )}
                      </>
                    )}

                    {paymentMethod === "card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              type="text"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              type="password"
                              placeholder="***"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange("cvv", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardholderName">Cardholder Name</Label>
                          <Input
                            id="cardholderName"
                            type="text"
                            placeholder="Name on card"
                            value={formData.cardholderName}
                            onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "wallet" && (
                      <div className="space-y-2">
                        <Label htmlFor="walletProvider">Wallet</Label>
                        <Input
                          id="walletProvider"
                          type="text"
                          placeholder="paytm"
                          value={formData.walletProvider}
                          onChange={(e) => handleInputChange("walletProvider", e.target.value)}
                        />
                      </div>
                    )}

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      size="lg"
                      onClick={handlePayment}
                      disabled={isProcessing || !detailsSaved}
                    >
                      {isProcessing ? "Processing..." : `Pay ₹${advanceAmount} Advance`}
                    </Button>

                    <p className="text-xs text-muted-foreground">
                      You’ll pay ₹{advanceAmount} now and ₹{remainingAmount} at the venue. Total: ₹
                      {totalAmount}.
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Right: Booking Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-black">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Venue:</span>
                    <span className="font-medium text-black">
                      {booking?.turfName || "Selected Venue"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-black">{booking?.location || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sport:</span>
                    <span className="font-medium text-black">{booking?.sport || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      Date:
                    </span>
                    <span className="font-medium text-black">
                      {bookingDate.toDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Time Slots:
                    </span>
                    <span className="font-medium text-black">{slotsLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-black">{durationHours} hour(s)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-700">
                    <span>Paid Now (10% advance):</span>
                    <span className="font-medium">₹{advanceAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-orange-600">
                    <span>Pay at Venue:</span>
                    <span className="font-medium">₹{remainingAmount}</span>
                  </div>

                  {confirmError && (
                    <p className="text-xs text-red-600">Note: {confirmError}</p>
                  )}
                </div>

                {!detailsSaved && (
                  <p className="text-xs text-muted-foreground">
                    Save your details first to enable payment options.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
