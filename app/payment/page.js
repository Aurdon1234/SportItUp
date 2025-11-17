// "use client";

// import React, { useMemo, useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Trophy,
//   CreditCard,
//   Smartphone,
//   Wallet,
//   Shield,
//   ArrowLeft,
//   CheckCircle,
//   Calendar as CalendarIcon,
//   Clock,
// } from "lucide-react";
// import UpiQr from "@/components/payment/upi-qr";

// const TIME_LABELS = {
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
// };

// function safeParseBooking(bookingParam) {
//   if (!bookingParam) return null;
//   try {
//     const parsed = JSON.parse(decodeURIComponent(bookingParam));
//     if (parsed.date) parsed.date = new Date(parsed.date);
//     if (parsed.timeSlot && !parsed.timeSlots) parsed.timeSlots = [parsed.timeSlot];
//     if (!Array.isArray(parsed.timeSlots)) parsed.timeSlots = [];
//     if (parsed.totalAmount != null) parsed.totalAmount = Number(parsed.totalAmount);
//     if (parsed.advanceAmount != null) parsed.advanceAmount = Number(parsed.advanceAmount);
//     if (parsed.pricePerHour != null) parsed.pricePerHour = Number(parsed.pricePerHour);
//     return parsed;
//   } catch (e) {
//     console.error("[payment] booking parse error:", e);
//     return null;
//   }
// }

// async function loadRazorpayScript() {
//   if (typeof window === "undefined") return;
//   if (window.Razorpay) return;
//   const id = "razorpay-checkout-js";
//   const existing = document.getElementById(id);
//   if (existing) {
//     await new Promise((res) => {
//       if (existing.readyState === "complete") return res();
//       existing.addEventListener("load", () => res(), { once: true });
//     });
//     return;
//   }
//   await new Promise((resolve, reject) => {
//     const s = document.createElement("script");
//     s.id = id;
//     s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.async = true;
//     s.onload = () => resolve();
//     s.onerror = () => reject(new Error("Failed to load Razorpay"));
//     document.body.appendChild(s);
//   });
// }

// export default function PaymentPage() {
//   const searchParams = useSearchParams();
//   const bookingParam = searchParams.get("booking");

//   const [paymentMethod, setPaymentMethod] = useState("upi");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isConfirming, setIsConfirming] = useState(false);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [detailsSaved, setDetailsSaved] = useState(false);
//   const [saveError, setSaveError] = useState(null);
//   const [confirmError, setConfirmError] = useState(null);

//   const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
//   const [formData, setFormData] = useState({
//     upiId: "",
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     cardholderName: "",
//     walletProvider: "paytm",
//   });

//   const booking = useMemo(() => safeParseBooking(bookingParam), [bookingParam]);

//   const timeSlots = Array.isArray(booking?.timeSlots) ? booking.timeSlots : [];
//   const durationHours =
//     booking?.duration && Number.isFinite(booking.duration)
//       ? booking.duration
//       : timeSlots.length > 0
//       ? timeSlots.length
//       : 1;

//   const totalAmount =
//     booking?.totalAmount ??
//     booking?.total ??
//     (booking?.pricePerHour ? Number(booking.pricePerHour) * Math.max(1, durationHours) : 0);

//   const advanceAmount = booking?.advanceAmount ?? Math.round(totalAmount * 0.1);
//   const remainingAmount = Math.max(totalAmount - advanceAmount, 0);

//   const RAZORPAY_KEY =
//     typeof process !== "undefined" ? process.env.NEXT_PUBLIC_RAZORPAY_KEY : undefined;

//   const handleInputChange = (field, value) =>
//     setFormData((prev) => ({ ...prev, [field]: value }));

//   // ⬇️ CHANGED: details are only validated & "saved" locally; no Google Sheet write here
//   const handleSaveDetails = async () => {
//     setSaveError(null);
//     if (!customer.name || !customer.phone || !customer.email) {
//       setSaveError("Please enter your name, phone and email.");
//       return;
//     }
//     setDetailsSaved(true);
//   };

//   // Call server to confirm booking AFTER successful payment
//   async function confirmBookingOnServer(paymentMeta) {
//     try {
//       setConfirmError(null);
//       setIsConfirming(true);

//       const dateStr =
//         booking?.date instanceof Date
//           ? booking.date.toISOString().split("T")[0]
//           : booking?.date || "";

//       const payload = {
//         // who & how much
//         name: customer.name,
//         phone: customer.phone,
//         email: customer.email,
//         totalAmount,
//         advanceAmount,
//         remainingAmount,

//         // what & when
//         turfId: booking?.turfId || "",
//         turfName: booking?.turfName || "Venue",
//         location: booking?.location || "-",
//         date: dateStr,
//         timeSlots,

//         // meta
//         sport: booking?.sport || "",
//         city: booking?.city || "",
//         paymentMethod,
//         paymentMeta, // includes razorpay ids or "simulated" flag
//       };

//       const res = await fetch("/api/public/booking/confirm", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const msg = await res.text();
//         throw new Error(msg || "Failed to record booking");
//       }
//     } catch (e) {
//       setConfirmError(e.message || "Failed to record booking");
//     } finally {
//       setIsConfirming(false);
//     }
//   }

//   const handlePayment = async () => {
//     setIsProcessing(true);

//     if (paymentMethod === "upi" && !formData.upiId) {
//       alert("Please enter your UPI ID");
//       setIsProcessing(false);
//       return;
//     }
//     if (paymentMethod === "card") {
//       const { cardNumber, expiryDate, cvv, cardholderName } = formData;
//       if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
//         alert("Please fill all card details");
//         setIsProcessing(false);
//         return;
//       }
//     }

//     try {
//       if (paymentMethod === "razorpay") {
//         if (!RAZORPAY_KEY) {
//           alert("Razorpay key is not configured. Set NEXT_PUBLIC_RAZORPAY_KEY.");
//           setIsProcessing(false);
//           return;
//         }

//         await loadRazorpayScript();
//         if (!window.Razorpay) {
//           alert("Failed to load Razorpay");
//           setIsProcessing(false);
//           return;
//         }

//         const orderResp = await fetch("/api/payments/razorpay/order", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             amount: advanceAmount, // ₹
//             currency: "INR",
//             notes: {
//               turfId: booking?.turfId || "",
//               turfName: booking?.turfName || "Venue",
//               date:
//                 booking?.date instanceof Date
//                   ? booking.date.toISOString().split("T")[0]
//                   : String(booking?.date || ""),
//               timeSlots: timeSlots.join(","),
//             },
//           }),
//         });

//         if (!orderResp.ok) {
//           const text = await orderResp.text();
//           throw new Error(text || "Failed to create order");
//         }

//         const order = await orderResp.json();

//         const rzp = new window.Razorpay({
//           key: RAZORPAY_KEY,
//           amount: order.amountInPaise || order.amount || advanceAmount * 100,
//           currency: order.currency || "INR",
//           name: "SportItUp",
//           description: `Booking: ${booking?.turfName || "Venue"}`,
//           image: "/placeholder.svg",
//           order_id: order.id,
//           handler: async (response) => {
//             // Payment succeeded -> record booking on server, THEN show success
//             await confirmBookingOnServer({
//               provider: "razorpay",
//               orderId: order.id,
//               amountInPaise: order.amountInPaise || order.amount,
//               payment_id: response?.razorpay_payment_id,
//               razorpay_order_id: response?.razorpay_order_id,
//               razorpay_signature: response?.razorpay_signature,
//             });
//             setIsProcessing(false);
//             setPaymentSuccess(true);
//           },
//           prefill: {
//             name: customer.name,
//             email: customer.email,
//             contact: customer.phone,
//           },
//           notes: {
//             turfId: booking?.turfId || "",
//             timeSlots: timeSlots.join(","),
//           },
//           theme: { color: "#16a34a" },
//         });

//         rzp.open();
//         return;
//       }

//       // Simulate success for UPI/Card/Wallet paths → then confirm on server
//       setTimeout(async () => {
//         await confirmBookingOnServer({
//           provider: paymentMethod,
//           simulated: true,
//           amount: advanceAmount,
//         });
//         setIsProcessing(false);
//         setPaymentSuccess(true);
//       }, 1000);
//     } catch (err) {
//       console.error("[payment] error:", err);
//       alert(err?.message || "Payment failed");
//       setIsProcessing(false);
//     }
//   };

//   // ---------- RENDER ----------

//   if (!booking) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Card className="w-full max-w-md text-center">
//           <CardContent className="pt-6">
//             <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">No booking data found</h3>
//             <p className="text-muted-foreground mb-4">
//               Please start your booking from the beginning.
//             </p>
//             <Button asChild>
//               <Link href="/locations">Start Booking</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const bookingDate =
//     booking.date instanceof Date ? booking.date : new Date(booking.date || Date.now());
//   const slotsLabel =
//     timeSlots.length > 0 ? timeSlots.map((t) => TIME_LABELS[t] || t).join(", ") : "—";

//   // Success screen
//   if (paymentSuccess) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center p-4">
//         <Card className="w-full max-w-2xl text-center">
//           <CardContent className="pt-8 pb-8">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-8 h-8 text-green-600" />
//             </div>
//             <h1 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
//             <p className="text-muted-foreground text-lg mb-6">
//               {isConfirming
//                 ? "Finalizing your booking..."
//                 : confirmError
//                 ? "Booked, but we couldn't log the record. We'll fix this shortly."
//                 : "You’ll receive a confirmation SMS and email shortly."}
//             </p>

//             <div className="bg-card p-6 rounded-lg border mb-6 text-left">
//               <h3 className="font-semibold mb-4">Booking Details</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Venue:</span>
//                   <span>{booking?.turfName || "Selected Venue"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Sport:</span>
//                   <span>{booking?.sport || "—"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Date:</span>
//                   <span>{bookingDate.toDateString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Time Slots:</span>
//                   <span>{slotsLabel}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Duration:</span>
//                   <span className="font-medium">{durationHours} hour(s)</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Total Amount:</span>
//                   <span className="font-medium">₹{totalAmount}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-green-700">Paid Online (10% advance):</span>
//                   <span className="font-semibold text-green-700">₹{advanceAmount}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-orange-600">Remaining (Pay at Venue):</span>
//                   <span className="font-semibold text-orange-600">₹{remainingAmount}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button asChild>
//                 <Link href="/locations">Book Another Venue</Link>
//               </Button>
//               <Button variant="outline" asChild>
//                 <Link href="/">Back to Home</Link>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Main payment page
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Link
//               href={`/booking/${booking.turfId}`}
//               className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               <span>Back to Booking</span>
//             </Link>
//             <Link href="/" className="flex items-center space-x-2">
//   <img
//     src="/sportitupp-removebg-preview.png"
//     alt="SportItUp"
//     className="h-20 w-auto cursor-pointer"
//   />
//   <span className="sr-only">SportItUp Home</span>
// </Link>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Shield className="w-4 h-4 text-green-600" />
//             <span className="text-sm text-muted-foreground">Secure Payment</span>
//           </div>
//         </div>
//       </header>

//       {/* Body */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left: forms */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Intro */}
//             <div>
//               <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Booking</h1>
//               <p className="text-muted-foreground">
//                 Enter your details, then choose a payment method to pay the 10% advance.
//               </p>
//             </div>

//             {/* Customer details */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Your Details</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="custName">Full Name</Label>
//                     <Input
//                       id="custName"
//                       type="text"
//                       placeholder="Your full name"
//                       value={customer.name}
//                       onChange={(e) => setCustomer((s) => ({ ...s, name: e.target.value }))}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="custPhone">Phone Number</Label>
//                     <Input
//                       id="custPhone"
//                       type="tel"
//                       placeholder="99999 99999"
//                       value={customer.phone}
//                       onChange={(e) => setCustomer((s) => ({ ...s, phone: e.target.value }))}
//                     />
//                   </div>
//                   <div className="space-y-2 md:col-span-2">
//                     <Label htmlFor="custEmail">Email</Label>
//                     <Input
//                       id="custEmail"
//                       type="email"
//                       placeholder="you@example.com"
//                       value={customer.email}
//                       onChange={(e) => setCustomer((s) => ({ ...s, email: e.target.value }))}
//                     />
//                   </div>
//                 </div>

//                 {saveError && <p className="text-sm text-red-600">{saveError}</p>}

//                 {!detailsSaved ? (
//                   <Button onClick={handleSaveDetails}>Save Details & Continue</Button>
//                 ) : (
//                   <div className="flex items-center gap-2 text-green-700">
//                     <CheckCircle className="w-4 h-4" />
//                     <span className="text-sm">Details saved. You can proceed to payment.</span>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Payment method */}
//             {detailsSaved && (
//               <>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-lg">Payment Method</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <RadioGroup
//                       value={paymentMethod}
//                       onValueChange={setPaymentMethod}
//                       className="space-y-4"
//                     >
//                       <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
//                         <RadioGroupItem value="upi" id="upi" />
//                         <div className="flex items-center space-x-3 flex-1">
//                           <Smartphone className="w-5 h-5 text-primary" />
//                           <div>
//                             <Label htmlFor="upi" className="font-medium">
//                               UPI
//                             </Label>
//                             <p className="text-sm text-muted-foreground">
//                               Google Pay, PhonePe, Paytm, etc.
//                             </p>
//                           </div>
//                         </div>
//                         <Badge variant="secondary" className="bg-green-100 text-green-700">
//                           Instant
//                         </Badge>
//                       </div>

//                       <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
//                         <RadioGroupItem value="card" id="card" />
//                         <div className="flex items-center space-x-3 flex-1">
//                           <CreditCard className="w-5 h-5 text-primary" />
//                           <div>
//                             <Label htmlFor="card" className="font-medium">
//                               Credit/Debit Card
//                             </Label>
//                             <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
//                         <RadioGroupItem value="wallet" id="wallet" />
//                         <div className="flex items-center space-x-3 flex-1">
//                           <Wallet className="w-5 h-5 text-primary" />
//                           <div>
//                             <Label htmlFor="wallet" className="font-medium">
//                               Digital Wallet
//                             </Label>
//                             <p className="text-sm text-muted-foreground">
//                               Paytm, Amazon Pay, MobiKwik
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
//                         <RadioGroupItem value="razorpay" id="razorpay" />
//                         <div className="flex items-center space-x-3 flex-1">
//                           <Shield className="w-5 h-5 text-primary" />
//                           <div>
//                             <Label htmlFor="razorpay" className="font-medium">
//                               Razorpay
//                             </Label>
//                             <p className="text-sm text-muted-foreground">
//                               {RAZORPAY_KEY ? "Secure payment gateway" : "Razorpay not configured"}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </RadioGroup>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-lg">Payment Details</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {paymentMethod === "upi" && (
//                       <>
//                         <div className="space-y-2">
//                           <Label htmlFor="upiId">Your UPI ID</Label>
//                           <Input
//                             id="upiId"
//                             type="text"
//                             placeholder="yourname@paytm"
//                             value={formData.upiId}
//                             onChange={(e) => handleInputChange("upiId", e.target.value)}
//                           />
//                         </div>
//                         {formData.upiId && (
//                           <UpiQr
//                             upiId={formData.upiId}
//                             amount={advanceAmount}
//                             merchantName={booking?.turfName || "SportItUp"}
//                           />
//                         )}
//                       </>
//                     )}

//                     {paymentMethod === "card" && (
//                       <div className="space-y-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="cardNumber">Card Number</Label>
//                           <Input
//                             id="cardNumber"
//                             type="text"
//                             placeholder="1234 5678 9012 3456"
//                             value={formData.cardNumber}
//                             onChange={(e) => handleInputChange("cardNumber", e.target.value)}
//                           />
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="expiryDate">Expiry Date</Label>
//                             <Input
//                               id="expiryDate"
//                               type="text"
//                               placeholder="MM/YY"
//                               value={formData.expiryDate}
//                               onChange={(e) => handleInputChange("expiryDate", e.target.value)}
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="cvv">CVV</Label>
//                             <Input
//                               id="cvv"
//                               type="password"
//                               placeholder="***"
//                               value={formData.cvv}
//                               onChange={(e) => handleInputChange("cvv", e.target.value)}
//                             />
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="cardholderName">Cardholder Name</Label>
//                           <Input
//                             id="cardholderName"
//                             type="text"
//                             placeholder="Name on card"
//                             value={formData.cardholderName}
//                             onChange={(e) => handleInputChange("cardholderName", e.target.value)}
//                           />
//                         </div>
//                       </div>
//                     )}

//                     {paymentMethod === "wallet" && (
//                       <div className="space-y-2">
//                         <Label htmlFor="walletProvider">Wallet</Label>
//                         <Input
//                           id="walletProvider"
//                           type="text"
//                           placeholder="paytm"
//                           value={formData.walletProvider}
//                           onChange={(e) => handleInputChange("walletProvider", e.target.value)}
//                         />
//                       </div>
//                     )}

//                     <Button
//                       className="w-full bg-green-600 hover:bg-green-700 text-white"
//                       size="lg"
//                       onClick={handlePayment}
//                       disabled={isProcessing || !detailsSaved}
//                     >
//                       {isProcessing ? "Processing..." : `Pay ₹${advanceAmount} Advance`}
//                     </Button>

//                     <p className="text-xs text-muted-foreground">
//                       You’ll pay ₹{advanceAmount} now and ₹{remainingAmount} at the venue. Total: ₹
//                       {totalAmount}.
//                     </p>
//                   </CardContent>
//                 </Card>
//               </>
//             )}
//           </div>

//           {/* Right: Booking Summary */}
//           <div className="lg:col-span-1">
//             <Card className="sticky top-24 border-gray-200">
//               <CardHeader>
//                 <CardTitle className="text-lg text-black">Booking Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Venue:</span>
//                     <span className="font-medium text-black">
//                       {booking?.turfName || "Selected Venue"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Location:</span>
//                     <span className="font-medium text-black">{booking?.location || "—"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Sport:</span>
//                     <span className="font-medium text-black">{booking?.sport || "—"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 flex items-center gap-1">
//                       <CalendarIcon className="w-4 h-4" />
//                       Date:
//                     </span>
//                     <span className="font-medium text-black">
//                       {bookingDate.toDateString()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 flex items-center gap-1">
//                       <Clock className="w-4 h-4" />
//                       Time Slots:
//                     </span>
//                     <span className="font-medium text-black">{slotsLabel}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Duration:</span>
//                     <span className="font-medium text-black">{durationHours} hour(s)</span>
//                   </div>
//                 </div>

//                 <div className="pt-2 border-t border-gray-200 space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Total Amount:</span>
//                     <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-green-700">
//                     <span>Paid Now (10% advance):</span>
//                     <span className="font-medium">₹{advanceAmount}</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-orange-600">
//                     <span>Pay at Venue:</span>
//                     <span className="font-medium">₹{remainingAmount}</span>
//                   </div>

//                   {confirmError && (
//                     <p className="text-xs text-red-600">Note: {confirmError}</p>
//                   )}
//                 </div>

//                 {!detailsSaved && (
//                   <p className="text-xs text-muted-foreground">
//                     Save your details first to enable payment options.
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import React, { useMemo, useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import PhoneOTP from "@/components/phoneOTP.js";

// import {
//   Trophy,
//   CreditCard,
//   Smartphone,
//   Wallet,
//   Shield,
//   ArrowLeft,
//   CheckCircle,
//   Calendar as CalendarIcon,
//   Clock,
// } from "lucide-react";
// import UpiQr from "@/components/payment/upi-qr";

// const TIME_LABELS = {
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
// };

// function safeParseBooking(bookingParam) {
//   if (!bookingParam) return null;
//   try {
//     const parsed = JSON.parse(decodeURIComponent(bookingParam));
//     if (parsed.date) parsed.date = new Date(parsed.date);
//     if (parsed.timeSlot && !parsed.timeSlots) parsed.timeSlots = [parsed.timeSlot];
//     if (!Array.isArray(parsed.timeSlots)) parsed.timeSlots = [];
//     if (parsed.totalAmount != null) parsed.totalAmount = Number(parsed.totalAmount);
//     if (parsed.advanceAmount != null) parsed.advanceAmount = Number(parsed.advanceAmount);
//     if (parsed.pricePerHour != null) parsed.pricePerHour = Number(parsed.pricePerHour);
//     return parsed;
//   } catch (e) {
//     console.error("[payment] booking parse error:", e);
//     return null;
//   }
// }

// async function loadRazorpayScript() {
//   if (typeof window === "undefined") return;
//   if (window.Razorpay) return;
//   const id = "razorpay-checkout-js";
//   const existing = document.getElementById(id);
//   if (existing) {
//     await new Promise((res) => {
//       if (existing.readyState === "complete") return res();
//       existing.addEventListener("load", () => res(), { once: true });
//     });
//     return;
//   }
//   await new Promise((resolve, reject) => {
//     const s = document.createElement("script");
//     s.id = id;
//     s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.async = true;
//     s.onload = () => resolve();
//     s.onerror = () => reject(new Error("Failed to load Razorpay"));
//     document.body.appendChild(s);
//   });
// }

// export default function PaymentPage() {
//   const searchParams = useSearchParams();
//   const bookingParam = searchParams.get("booking");

//   const [paymentMethod, setPaymentMethod] = useState("upi");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isConfirming, setIsConfirming] = useState(false);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [detailsSaved, setDetailsSaved] = useState(false);
//   const [saveError, setSaveError] = useState(null);
//   const [confirmError, setConfirmError] = useState(null);
//   const [phoneVerified, setPhoneVerified] = useState(false);
//   const [verifiedPhone, setVerifiedPhone] = useState("");

//   const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
//   const [formData, setFormData] = useState({
//     upiId: "",
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     cardholderName: "",
//     walletProvider: "paytm",
//   });

//   const booking = useMemo(() => safeParseBooking(bookingParam), [bookingParam]);

//   const timeSlots = Array.isArray(booking?.timeSlots) ? booking.timeSlots : [];
//   const durationHours =
//     booking?.duration && Number.isFinite(booking.duration)
//       ? booking.duration
//       : timeSlots.length > 0
//       ? timeSlots.length
//       : 1;

//   const totalAmount =
//     booking?.totalAmount ??
//     booking?.total ??
//     (booking?.pricePerHour ? Number(booking.pricePerHour) * Math.max(1, durationHours) : 0);

//   const advanceAmount = booking?.advanceAmount ?? Math.round(totalAmount * 0.1);
//   const remainingAmount = Math.max(totalAmount - advanceAmount, 0);

//   const RAZORPAY_KEY =
//     typeof process !== "undefined" ? process.env.NEXT_PUBLIC_RAZORPAY_KEY : undefined;

//   const handleInputChange = (field, value) =>
//     setFormData((prev) => ({ ...prev, [field]: value }));

//   // ⬇️ CHANGED: details are only validated & "saved" locally; no Google Sheet write here
//   const handleSaveDetails = async () => {
//     setSaveError(null);
//     if (!customer.name || !customer.phone || !customer.email) {
//       setSaveError("Please enter your name, phone and email.");
//       return;
//     }
//     setDetailsSaved(true);
//   };

//   // Call server to confirm booking AFTER successful payment
//   async function confirmBookingOnServer(paymentMeta) {
//     try {
//       setConfirmError(null);
//       setIsConfirming(true);

//       const dateStr =
//         booking?.date instanceof Date
//           ? booking.date.toISOString().split("T")[0]
//           : booking?.date || "";

//       const payload = {
//         // who & how much
//         name: customer.name,
//         phone: customer.phone,
//         email: customer.email,
//         totalAmount,
//         advanceAmount,
//         remainingAmount,

//         // what & when
//         turfId: booking?.turfId || "",
//         turfName: booking?.turfName || "Venue",
//         location: booking?.location || "-",
//         date: dateStr,
//         timeSlots,

//         // meta
//         sport: booking?.sport || "",
//         city: booking?.city || "",
//         paymentMethod,
//         paymentMeta, // includes razorpay ids or "simulated" flag
//       };

//       const res = await fetch("/api/public/booking/confirm", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const msg = await res.text();
//         throw new Error(msg || "Failed to record booking");
//       }
//     } catch (e) {
//       setConfirmError(e.message || "Failed to record booking");
//     } finally {
//       setIsConfirming(false);
//     }
//   }

//   const handlePayment = async () => {
//     setIsProcessing(true);

//     if (paymentMethod === "upi" && !formData.upiId) {
//       alert("Please enter your UPI ID");
//       setIsProcessing(false);
//       return;
//     }
//     if (paymentMethod === "card") {
//       const { cardNumber, expiryDate, cvv, cardholderName } = formData;
//       if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
//         alert("Please fill all card details");
//         setIsProcessing(false);
//         return;
//       }
//     }

//     try {
//       if (paymentMethod === "razorpay") {
//         if (!RAZORPAY_KEY) {
//           alert("Razorpay key is not configured. Set NEXT_PUBLIC_RAZORPAY_KEY.");
//           setIsProcessing(false);
//           return;
//         }

//         await loadRazorpayScript();
//         if (!window.Razorpay) {
//           alert("Failed to load Razorpay");
//           setIsProcessing(false);
//           return;
//         }

//         const orderResp = await fetch("/api/payments/razorpay/order", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             amount: advanceAmount, // ₹
//             currency: "INR",
//             notes: {
//               turfId: booking?.turfId || "",
//               turfName: booking?.turfName || "Venue",
//               date:
//                 booking?.date instanceof Date
//                   ? booking.date.toISOString().split("T")[0]
//                   : String(booking?.date || ""),
//               timeSlots: timeSlots.join(","),
//             },
//           }),
//         });

//         if (!orderResp.ok) {
//           const text = await orderResp.text();
//           throw new Error(text || "Failed to create order");
//         }

//         const order = await orderResp.json();

//         const rzp = new window.Razorpay({
//           key: RAZORPAY_KEY,
//           amount: order.amountInPaise || order.amount || advanceAmount * 100,
//           currency: order.currency || "INR",
//           name: "SportItUp",
//           description: `Booking: ${booking?.turfName || "Venue"}`,
//           image: "/placeholder.svg",
//           order_id: order.id,
//           handler: async (response) => {
//             // Payment succeeded -> record booking on server, THEN show success
//             await confirmBookingOnServer({
//               provider: "razorpay",
//               orderId: order.id,
//               amountInPaise: order.amountInPaise || order.amount,
//               payment_id: response?.razorpay_payment_id,
//               razorpay_order_id: response?.razorpay_order_id,
//               razorpay_signature: response?.razorpay_signature,
//             });
//             setIsProcessing(false);
//             setPaymentSuccess(true);
//           },
//           prefill: {
//             name: customer.name,
//             email: customer.email,
//             contact: customer.phone,
//           },
//           notes: {
//             turfId: booking?.turfId || "",
//             timeSlots: timeSlots.join(","),
//           },
//           theme: { color: "#16a34a" },
//         });

//         rzp.open();
//         return;
//       }

//       // Simulate success for UPI/Card/Wallet paths → then confirm on server
//       setTimeout(async () => {
//         await confirmBookingOnServer({
//           provider: paymentMethod,
//           simulated: true,
//           amount: advanceAmount,
//         });
//         setIsProcessing(false);
//         setPaymentSuccess(true);
//       }, 1000);
//     } catch (err) {
//       console.error("[payment] error:", err);
//       alert(err?.message || "Payment failed");
//       setIsProcessing(false);
//     }
//   };

//   // ---------- RENDER ----------

//   if (!booking) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Card className="w-full max-w-md text-center">
//           <CardContent className="pt-6">
//             <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">No booking data found</h3>
//             <p className="text-muted-foreground mb-4">
//               Please start your booking from the beginning.
//             </p>
//             <Button asChild>
//               <Link href="/locations">Start Booking</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const bookingDate =
//     booking.date instanceof Date ? booking.date : new Date(booking.date || Date.now());
//   const slotsLabel =
//     timeSlots.length > 0 ? timeSlots.map((t) => TIME_LABELS[t] || t).join(", ") : "—";

//   // Success screen
//   if (paymentSuccess) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center p-4">
//         <Card className="w-full max-w-2xl text-center">
//           <CardContent className="pt-8 pb-8">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-8 h-8 text-green-600" />
//             </div>
//             <h1 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
//             <p className="text-muted-foreground text-lg mb-6">
//               {isConfirming
//                 ? "Finalizing your booking..."
//                 : confirmError
//                 ? "Booked, but we couldn't log the record. We'll fix this shortly."
//                 : "You’ll receive a confirmation SMS and email shortly."}
//             </p>

//             <div className="bg-card p-6 rounded-lg border mb-6 text-left">
//               <h3 className="font-semibold mb-4">Booking Details</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Venue:</span>
//                   <span>{booking?.turfName || "Selected Venue"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Sport:</span>
//                   <span>{booking?.sport || "—"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Date:</span>
//                   <span>{bookingDate.toDateString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Time Slots:</span>
//                   <span>{slotsLabel}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Duration:</span>
//                   <span className="font-medium">{durationHours} hour(s)</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Total Amount:</span>
//                   <span className="font-medium">₹{totalAmount}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-green-700">Paid Online (10% advance):</span>
//                   <span className="font-semibold text-green-700">₹{advanceAmount}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-orange-600">Remaining (Pay at Venue):</span>
//                   <span className="font-semibold text-orange-600">₹{remainingAmount}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button asChild>
//                 <Link href="/locations">Book Another Venue</Link>
//               </Button>
//               <Button variant="outline" asChild>
//                 <Link href="/">Back to Home</Link>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Main payment page
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Link
//               href={`/booking/${booking.turfId}`}
//               className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               <span>Back to Booking</span>
//             </Link>
//             <Link href="/" className="flex items-center space-x-2">
//   <img
//     src="/sportitupp-removebg-preview.png"
//     alt="SportItUp"
//     className="h-20 w-auto cursor-pointer"
//   />
//   <span className="sr-only">SportItUp Home</span>
// </Link>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Shield className="w-4 h-4 text-green-600" />
//             <span className="text-sm text-muted-foreground">Secure Payment</span>
//           </div>
//         </div>
//       </header>

//       {/* Body */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left: forms */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Intro */}
//             <div>
//               <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Booking</h1>
//               <p className="text-muted-foreground">
//                 Enter your details, then choose a payment method to pay the 10% advance.
//               </p>
//             </div>

//             {/* Customer details */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Your Details</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="custName">Full Name</Label>
//                     <Input
//                       id="custName"
//                       type="text"
//                       placeholder="Your full name"
//                       value={customer.name}
//                       onChange={(e) => setCustomer((s) => ({ ...s, name: e.target.value }))}
//                     />
//                   </div>
//                   <div className="space-y-2">
//   <Label htmlFor="custPhone">Phone Number</Label>

//   {/* Firebase Phone OTP UI */}
//   <PhoneOTP
//     initialPhone={customer.phone}
//     onVerified={(phone) => {
//       setCustomer((prev) => ({ ...prev, phone }));
//       setPhoneVerified(true);
//       setVerifiedPhone(phone);
//     }}
//   />

//   {!phoneVerified && (
//     <p className="text-sm text-yellow-600">Please verify your phone number to continue.</p>
//   )}
//   {phoneVerified && (
//     <p className="text-sm text-green-600">✅ Phone number verified successfully.</p>
//   )}
// </div>

//                   <div className="space-y-2 md:col-span-2">
//                     <Label htmlFor="custEmail">Email</Label>
//                     <Input
//                       id="custEmail"
//                       type="email"
//                       placeholder="you@example.com"
//                       value={customer.email}
//                       onChange={(e) => setCustomer((s) => ({ ...s, email: e.target.value }))}
//                     />
//                   </div>
//                 </div>

//                 {saveError && <p className="text-sm text-red-600">{saveError}</p>}

//                 {!detailsSaved ? (
//                   <Button onClick={handleSaveDetails} disabled={!phoneVerified || !customer.name || !customer.email}>Save Details & Continue</Button>
//                 ) : (
//                   <div className="flex items-center gap-2 text-green-700">
//                     <CheckCircle className="w-4 h-4" />
//                     <span className="text-sm">Details saved. You can proceed to payment.</span>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Payment method */}
//             {detailsSaved && (
//               <>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-lg">Payment Method</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <RadioGroup
//                       value={paymentMethod}
//                       onValueChange={setPaymentMethod}
//                       className="space-y-4"
//                     >
//                       <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
//                         <RadioGroupItem value="upi" id="upi" />
//                         <div className="flex items-center space-x-3 flex-1">
//                           <Smartphone className="w-5 h-5 text-primary" />
//                           <div>
//                             <Label htmlFor="upi" className="font-medium">
//                               UPI
//                             </Label>
//                             <p className="text-sm text-muted-foreground">
//                               Google Pay, PhonePe, Paytm, etc.
//                             </p>
//                           </div>
//                         </div>
//                         <Badge variant="secondary" className="bg-green-100 text-green-700">
//                           Instant
//                         </Badge>
//                       </div>

//                       <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
//                         <RadioGroupItem value="card" id="card" />
//                         <div className="flex items-center space-x-3 flex-1">
//                           <CreditCard className="w-5 h-5 text-primary" />
//                           <div>
//                             <Label htmlFor="card" className="font-medium">
//                               Credit/Debit Card
//                             </Label>
//                             <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
//                         <RadioGroupItem value="wallet" id="wallet" />
//                         <div className="flex items-center space-x-3 flex-1">
//                           <Wallet className="w-5 h-5 text-primary" />
//                           <div>
//                             <Label htmlFor="wallet" className="font-medium">
//                               Digital Wallet
//                             </Label>
//                             <p className="text-sm text-muted-foreground">
//                               Paytm, Amazon Pay, MobiKwik
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
//                         <RadioGroupItem value="razorpay" id="razorpay" />
//                         <div className="flex items-center space-x-3 flex-1">
//                           <Shield className="w-5 h-5 text-primary" />
//                           <div>
//                             <Label htmlFor="razorpay" className="font-medium">
//                               Razorpay
//                             </Label>
//                             <p className="text-sm text-muted-foreground">
//                               {RAZORPAY_KEY ? "Secure payment gateway" : "Razorpay not configured"}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </RadioGroup>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-lg">Payment Details</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {paymentMethod === "upi" && (
//                       <>
//                         <div className="space-y-2">
//                           <Label htmlFor="upiId">Your UPI ID</Label>
//                           <Input
//                             id="upiId"
//                             type="text"
//                             placeholder="yourname@paytm"
//                             value={formData.upiId}
//                             onChange={(e) => handleInputChange("upiId", e.target.value)}
//                           />
//                         </div>
//                         {formData.upiId && (
//                           <UpiQr
//                             upiId={formData.upiId}
//                             amount={advanceAmount}
//                             merchantName={booking?.turfName || "SportItUp"}
//                           />
//                         )}
//                       </>
//                     )}

//                     {paymentMethod === "card" && (
//                       <div className="space-y-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="cardNumber">Card Number</Label>
//                           <Input
//                             id="cardNumber"
//                             type="text"
//                             placeholder="1234 5678 9012 3456"
//                             value={formData.cardNumber}
//                             onChange={(e) => handleInputChange("cardNumber", e.target.value)}
//                           />
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="expiryDate">Expiry Date</Label>
//                             <Input
//                               id="expiryDate"
//                               type="text"
//                               placeholder="MM/YY"
//                               value={formData.expiryDate}
//                               onChange={(e) => handleInputChange("expiryDate", e.target.value)}
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="cvv">CVV</Label>
//                             <Input
//                               id="cvv"
//                               type="password"
//                               placeholder="***"
//                               value={formData.cvv}
//                               onChange={(e) => handleInputChange("cvv", e.target.value)}
//                             />
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="cardholderName">Cardholder Name</Label>
//                           <Input
//                             id="cardholderName"
//                             type="text"
//                             placeholder="Name on card"
//                             value={formData.cardholderName}
//                             onChange={(e) => handleInputChange("cardholderName", e.target.value)}
//                           />
//                         </div>
//                       </div>
//                     )}

//                     {paymentMethod === "wallet" && (
//                       <div className="space-y-2">
//                         <Label htmlFor="walletProvider">Wallet</Label>
//                         <Input
//                           id="walletProvider"
//                           type="text"
//                           placeholder="paytm"
//                           value={formData.walletProvider}
//                           onChange={(e) => handleInputChange("walletProvider", e.target.value)}
//                         />
//                       </div>
//                     )}

//                     <Button
//                       className="w-full bg-green-600 hover:bg-green-700 text-white"
//                       size="lg"
//                       onClick={handlePayment}
//                       disabled={isProcessing || !detailsSaved}
//                     >
//                       {isProcessing ? "Processing..." : `Pay ₹${advanceAmount} Advance`}
//                     </Button>

//                     <p className="text-xs text-muted-foreground">
//                       You’ll pay ₹{advanceAmount} now and ₹{remainingAmount} at the venue. Total: ₹
//                       {totalAmount}.
//                     </p>
//                   </CardContent>
//                 </Card>
//               </>
//             )}
//           </div>

//           {/* Right: Booking Summary */}
//           <div className="lg:col-span-1">
//             <Card className="sticky top-24 border-gray-200">
//               <CardHeader>
//                 <CardTitle className="text-lg text-black">Booking Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Venue:</span>
//                     <span className="font-medium text-black">
//                       {booking?.turfName || "Selected Venue"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Location:</span>
//                     <span className="font-medium text-black">{booking?.location || "—"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Sport:</span>
//                     <span className="font-medium text-black">{booking?.sport || "—"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 flex items-center gap-1">
//                       <CalendarIcon className="w-4 h-4" />
//                       Date:
//                     </span>
//                     <span className="font-medium text-black">
//                       {bookingDate.toDateString()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 flex items-center gap-1">
//                       <Clock className="w-4 h-4" />
//                       Time Slots:
//                     </span>
//                     <span className="font-medium text-black">{slotsLabel}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Duration:</span>
//                     <span className="font-medium text-black">{durationHours} hour(s)</span>
//                   </div>
//                 </div>

//                 <div className="pt-2 border-t border-gray-200 space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Total Amount:</span>
//                     <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-green-700">
//                     <span>Paid Now (10% advance):</span>
//                     <span className="font-medium">₹{advanceAmount}</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-orange-600">
//                     <span>Pay at Venue:</span>
//                     <span className="font-medium">₹{remainingAmount}</span>
//                   </div>

//                   {confirmError && (
//                     <p className="text-xs text-red-600">Note: {confirmError}</p>
//                   )}
//                 </div>

//                 {!detailsSaved && (
//                   <p className="text-xs text-muted-foreground">
//                     Save your details first to enable payment options.
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// // }

// "use client";

// import React, { useMemo, useState } from "react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import {
//   Trophy,
//   CreditCard,
//   Smartphone,
//   Wallet,
//   Shield,
//   ArrowLeft,
//   CheckCircle,
//   Calendar as CalendarIcon,
//   Clock,
// } from "lucide-react";
// import UpiQr from "@/components/payment/upi-qr";

// const TIME_LABELS = {
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
// };

// function safeParseBooking(bookingParam) {
//   if (!bookingParam) return null;
//   try {
//     const parsed = JSON.parse(decodeURIComponent(bookingParam));
//     if (parsed.date) parsed.date = new Date(parsed.date);
//     if (parsed.timeSlot && !parsed.timeSlots) parsed.timeSlots = [parsed.timeSlot];
//     if (!Array.isArray(parsed.timeSlots)) parsed.timeSlots = [];
//     if (parsed.totalAmount != null) parsed.totalAmount = Number(parsed.totalAmount);
//     if (parsed.advanceAmount != null) parsed.advanceAmount = Number(parsed.advanceAmount);
//     if (parsed.pricePerHour != null) parsed.pricePerHour = Number(parsed.pricePerHour);
//     return parsed;
//   } catch (e) {
//     console.error("[payment] booking parse error:", e);
//     return null;
//   }
// }

// async function loadRazorpayScript() {
//   if (typeof window === "undefined") return;
//   if (window.Razorpay) return;
//   const id = "razorpay-checkout-js";
//   const existing = document.getElementById(id);
//   if (existing) {
//     await new Promise((res) => {
//       if (existing.readyState === "complete") return res();
//       existing.addEventListener("load", () => res(), { once: true });
//     });
//     return;
//   }
//   await new Promise((resolve, reject) => {
//     const s = document.createElement("script");
//     s.id = id;
//     s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.async = true;
//     s.onload = () => resolve();
//     s.onerror = () => reject(new Error("Failed to load Razorpay"));
//     document.body.appendChild(s);
//   });
// }

// export default function PaymentPage() {
//   const searchParams = useSearchParams();
//   const bookingParam = searchParams.get("booking");

//   const [paymentMethod, setPaymentMethod] = useState("upi");
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isConfirming, setIsConfirming] = useState(false);
//   const [paymentSuccess, setPaymentSuccess] = useState(false);
//   const [detailsSaved, setDetailsSaved] = useState(false);
//   const [saveError, setSaveError] = useState(null);
//   const [confirmError, setConfirmError] = useState(null);
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [otpVerified, setOtpVerified] = useState(false);
//   const [otpLoading, setOtpLoading] = useState(false);


//   const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
//   const [formData, setFormData] = useState({
//     upiId: "",
//     cardNumber: "",
//     expiryDate: "",
//     cvv: "",
//     cardholderName: "",
//     walletProvider: "paytm",
//   });

//   const booking = useMemo(() => safeParseBooking(bookingParam), [bookingParam]);

//   const timeSlots = Array.isArray(booking?.timeSlots) ? booking.timeSlots : [];
//   const durationHours =
//     booking?.duration && Number.isFinite(booking.duration)
//       ? booking.duration
//       : timeSlots.length > 0
//       ? timeSlots.length
//       : 1;

//   const totalAmount =
//     booking?.totalAmount ??
//     booking?.total ??
//     (booking?.pricePerHour ? Number(booking.pricePerHour) * Math.max(1, durationHours) : 0);

//   const advanceAmount = booking?.advanceAmount ?? Math.round(totalAmount * 0.1);
//   const remainingAmount = Math.max(totalAmount - advanceAmount, 0);

//   const RAZORPAY_KEY =
//     typeof process !== "undefined" ? process.env.NEXT_PUBLIC_RAZORPAY_KEY : undefined;

//   const handleInputChange = (field, value) =>
//     setFormData((prev) => ({ ...prev, [field]: value }));

//   // ⬇️ CHANGED: details are only validated & "saved" locally; no Google Sheet write here
//   const handleSaveDetails = async () => {
//     setSaveError(null);
//     if (!customer.name || !customer.phone || !customer.email) {
//       setSaveError("Please enter your name, phone and email.");
//       return;
//     }
//     setDetailsSaved(true);
//   };

//   // Call server to confirm booking AFTER successful payment
//   async function confirmBookingOnServer(paymentMeta) {
//     try {
//       setConfirmError(null);
//       setIsConfirming(true);

//       const dateStr =
//         booking?.date instanceof Date
//           ? booking.date.toISOString().split("T")[0]
//           : booking?.date || "";

//       const payload = {
//         // who & how much
//         name: customer.name,
//         phone: customer.phone,
//         email: customer.email,
//         totalAmount,
//         advanceAmount,
//         remainingAmount,

//         // what & when
//         turfId: booking?.turfId || "",
//         turfName: booking?.turfName || "Venue",
//         location: booking?.location || "-",
//         date: dateStr,
//         timeSlots,

//         // meta
//         sport: booking?.sport || "",
//         city: booking?.city || "",
//         paymentMethod,
//         paymentMeta, // includes razorpay ids or "simulated" flag
//       };

//       const res = await fetch("/api/public/booking/confirm", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const msg = await res.text();
//         throw new Error(msg || "Failed to record booking");
//       }
//     } catch (e) {
//       setConfirmError(e.message || "Failed to record booking");
//     } finally {
//       setIsConfirming(false);
//     }
//   }

//   const handlePayment = async () => {
//     setIsProcessing(true);

//     if (paymentMethod === "upi" && !formData.upiId) {
//       alert("Please enter your UPI ID");
//       setIsProcessing(false);
//       return;
//     }
//     if (paymentMethod === "card") {
//       const { cardNumber, expiryDate, cvv, cardholderName } = formData;
//       if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
//         alert("Please fill all card details");
//         setIsProcessing(false);
//         return;
//       }
//     }

//     try {
//       if (paymentMethod === "razorpay") {
//         if (!RAZORPAY_KEY) {
//           alert("Razorpay key is not configured. Set NEXT_PUBLIC_RAZORPAY_KEY.");
//           setIsProcessing(false);
//           return;
//         }

//         await loadRazorpayScript();
//         if (!window.Razorpay) {
//           alert("Failed to load Razorpay");
//           setIsProcessing(false);
//           return;
//         }

//         const orderResp = await fetch("/api/payments/razorpay/order", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             amount: advanceAmount, // ₹
//             currency: "INR",
//             notes: {
//               turfId: booking?.turfId || "",
//               turfName: booking?.turfName || "Venue",
//               date:
//                 booking?.date instanceof Date
//                   ? booking.date.toISOString().split("T")[0]
//                   : String(booking?.date || ""),
//               timeSlots: timeSlots.join(","),
//             },
//           }),
//         });

//         if (!orderResp.ok) {
//           const text = await orderResp.text();
//           throw new Error(text || "Failed to create order");
//         }

//         const order = await orderResp.json();

//         const rzp = new window.Razorpay({
//           key: RAZORPAY_KEY,
//           amount: order.amountInPaise || order.amount || advanceAmount * 100,
//           currency: order.currency || "INR",
//           name: "SportItUp",
//           description: `Booking: ${booking?.turfName || "Venue"}`,
//           image: "/placeholder.svg",
//           order_id: order.id,
//           handler: async (response) => {
//             // Payment succeeded -> record booking on server, THEN show success
//             await confirmBookingOnServer({
//               provider: "razorpay",
//               orderId: order.id,
//               amountInPaise: order.amountInPaise || order.amount,
//               payment_id: response?.razorpay_payment_id,
//               razorpay_order_id: response?.razorpay_order_id,
//               razorpay_signature: response?.razorpay_signature,
//             });
//             setIsProcessing(false);
//             setPaymentSuccess(true);
//           },
//           prefill: {
//             name: customer.name,
//             email: customer.email,
//             contact: customer.phone,
//           },
//           notes: {
//             turfId: booking?.turfId || "",
//             timeSlots: timeSlots.join(","),
//           },
//           theme: { color: "#16a34a" },
//         });

//         rzp.open();
//         return;
//       }

//       // Simulate success for UPI/Card/Wallet paths → then confirm on server
//       setTimeout(async () => {
//         await confirmBookingOnServer({
//           provider: paymentMethod,
//           simulated: true,
//           amount: advanceAmount,
//         });
//         setIsProcessing(false);
//         setPaymentSuccess(true);
//       }, 1000);
//     } catch (err) {
//       console.error("[payment] error:", err);
//       alert(err?.message || "Payment failed");
//       setIsProcessing(false);
//     }
//   };

//   // ---------- RENDER ----------

//   if (!booking) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <Card className="w-full max-w-md text-center">
//           <CardContent className="pt-6">
//             <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
//             <h3 className="text-lg font-semibold mb-2">No booking data found</h3>
//             <p className="text-muted-foreground mb-4">
//               Please start your booking from the beginning.
//             </p>
//             <Button asChild>
//               <Link href="/locations">Start Booking</Link>
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const bookingDate =
//     booking.date instanceof Date ? booking.date : new Date(booking.date || Date.now());
//   const slotsLabel =
//     timeSlots.length > 0 ? timeSlots.map((t) => TIME_LABELS[t] || t).join(", ") : "—";

//   // Success screen
//   if (paymentSuccess) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center p-4">
//         <Card className="w-full max-w-2xl text-center">
//           <CardContent className="pt-8 pb-8">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//               <CheckCircle className="w-8 h-8 text-green-600" />
//             </div>
//             <h1 className="text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
//             <p className="text-muted-foreground text-lg mb-6">
//               {isConfirming
//                 ? "Finalizing your booking..."
//                 : confirmError
//                 ? "Booked, but we couldn't log the record. We'll fix this shortly."
//                 : "You’ll receive a confirmation SMS and email shortly."}
//             </p>

//             <div className="bg-card p-6 rounded-lg border mb-6 text-left">
//               <h3 className="font-semibold mb-4">Booking Details</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Venue:</span>
//                   <span>{booking?.turfName || "Selected Venue"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Sport:</span>
//                   <span>{booking?.sport || "—"}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Date:</span>
//                   <span>{bookingDate.toDateString()}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Time Slots:</span>
//                   <span>{slotsLabel}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Duration:</span>
//                   <span className="font-medium">{durationHours} hour(s)</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-muted-foreground">Total Amount:</span>
//                   <span className="font-medium">₹{totalAmount}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-green-700">Paid Online (10% advance):</span>
//                   <span className="font-semibold text-green-700">₹{advanceAmount}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-orange-600">Remaining (Pay at Venue):</span>
//                   <span className="font-semibold text-orange-600">₹{remainingAmount}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <Button asChild>
//                 <Link href="/locations">Book Another Venue</Link>
//               </Button>
//               <Button variant="outline" asChild>
//                 <Link href="/">Back to Home</Link>
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Main payment page
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Link
//               href={`/booking/${booking.turfId}`}
//               className="flex items-center space-x-2 text-muted-foreground hover:text-foreground"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               <span>Back to Booking</span>
//             </Link>
//             <Link href="/" className="flex items-center space-x-2">
//   <img
//     src="/sportitupp-removebg-preview.png"
//     alt="SportItUp"
//     className="h-20 w-auto cursor-pointer"
//   />
//   <span className="sr-only">SportItUp Home</span>
// </Link>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Shield className="w-4 h-4 text-green-600" />
//             <span className="text-sm text-muted-foreground">Secure Payment</span>
//           </div>
//         </div>
//       </header>

//       {/* Body */}
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left: forms */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Intro */}
//             <div>
//               <h1 className="text-3xl font-bold text-foreground mb-2">Complete Your Booking</h1>
//               <p className="text-muted-foreground">
//                 Enter your details, then choose a payment method to pay the 10% advance.
//               </p>
//             </div>

//             {/* Customer details */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-lg">Your Details</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="custName">Full Name</Label>
//                     <Input
//                       id="custName"
//                       type="text"
//                       placeholder="Your full name"
//                       value={customer.name}
//                       onChange={(e) => setCustomer((s) => ({ ...s, name: e.target.value }))}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="custPhone">Phone Number</Label>
//                     <Input
//                       id="custPhone"
//                       type="tel"
//                       placeholder="99999 99999"
//                       value={customer.phone}
//                       onChange={(e) => setCustomer((s) => ({ ...s, phone: e.target.value }))}
//                     />
//                   </div>
//                   <div className="space-y-2 md:col-span-2">
//                     <Label htmlFor="custEmail">Email</Label>
//                     <Input
//                       id="custEmail"
//                       type="email"
//                       placeholder="you@example.com"
//                       value={customer.email}
//                       onChange={(e) => setCustomer((s) => ({ ...s, email: e.target.value }))}
//                     />
//                   </div>
//                   <div className="flex flex-col gap-2 mt-3">
//   <label className="text-sm text-gray-600">Phone Number</label>
//   <input
//     type="tel"
//     value={customer.phone}
//     onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
//     className="border p-2 rounded-md"
//     placeholder="Enter 10-digit number"
//   />

//   {!otpSent ? (
//     <button
//       onClick={async () => {
//         setOtpLoading(true);
//         const res = await fetch("/api/otp/send-otp", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ phone: customer.phone }),
//         });
//         const data = await res.json();
//         setOtpLoading(false);
//         if (data.ok) {
//           setOtpSent(true);
//           alert("OTP sent successfully!");
//         } else {
//           alert("Failed to send OTP. Please check your number.");
//         }
//       }}
//       disabled={!customer.phone || otpLoading}
//       className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
//     >
//       {otpLoading ? "Sending..." : "Send OTP"}
//     </button>
//   ) : (
//     <>
//       <input
//         type="text"
//         value={otp}
//         onChange={(e) => setOtp(e.target.value)}
//         placeholder="Enter OTP"
//         className="border p-2 rounded-md"
//       />
//       <button
//         onClick={async () => {
//           const res = await fetch("/api/otp/verify-otp", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ phone: customer.phone, code: otp }),
//           });
//           const data = await res.json();
//           if (data.ok) {
//             setOtpVerified(true);
//             alert("OTP verified successfully!");
//           } else {
//             alert(data.error || "Invalid OTP");
//           }
//         }}
//         className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
//       >
//         Verify OTP
//       </button>
//     </>
//   )}
// </div>

//                 </div>

//                 {saveError && <p className="text-sm text-red-600">{saveError}</p>}

//                 {!detailsSaved ? (
//                   <Button
//   onClick={handleSaveDetails}
//   disabled={isProcessing || !otpVerified || !customer.phone || !customer.email || !customer.name}
//   className={`${otpVerified ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
// >
//   {otpVerified ? "Save Details & Continue" : "Verify OTP to Continue"}
// </Button>

//                 ) : (
//                   <div className="flex items-center gap-2 text-green-700">
//                     <CheckCircle className="w-4 h-4" />
//                     <span className="text-sm">Details saved. You can proceed to payment.</span>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             {/* Payment method */}
//             {detailsSaved && (
//               <>
//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-lg">Payment Method</CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <RadioGroup
//                       value={paymentMethod}
//                       onValueChange={setPaymentMethod}
//                       className="space-y-4"
//                     >
//                       <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
//                         <RadioGroupItem value="upi" id="upi" />
//                         <div className="flex items-center space-x-3 flex-1">
//                           <Smartphone className="w-5 h-5 text-primary" />
//                           <div>
//                             <Label htmlFor="upi" className="font-medium">
//                               UPI
//                             </Label>
//                             <p className="text-sm text-muted-foreground">
//                               Google Pay, PhonePe, Paytm, etc.
//                             </p>
//                           </div>
//                         </div>
//                         <Badge variant="secondary" className="bg-green-100 text-green-700">
//                           Instant
//                         </Badge>
//                       </div>

//                       <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
//                         <RadioGroupItem value="card" id="card" />
//                         <div className="flex items-center space-x-3 flex-1">
//                           <CreditCard className="w-5 h-5 text-primary" />
//                           <div>
//                             <Label htmlFor="card" className="font-medium">
//                               Credit/Debit Card
//                             </Label>
//                             <p className="text-sm text-muted-foreground">Visa, Mastercard, RuPay</p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
//                         <RadioGroupItem value="wallet" id="wallet" />
//                         <div className="flex items-center space-x-3 flex-1">
//                           <Wallet className="w-5 h-5 text-primary" />
//                           <div>
//                             <Label htmlFor="wallet" className="font-medium">
//                               Digital Wallet
//                             </Label>
//                             <p className="text-sm text-muted-foreground">
//                               Paytm, Amazon Pay, MobiKwik
//                             </p>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
//                         <RadioGroupItem value="razorpay" id="razorpay" />
//                         <div className="flex items-center space-x-3 flex-1">
//                           <Shield className="w-5 h-5 text-primary" />
//                           <div>
//                             <Label htmlFor="razorpay" className="font-medium">
//                               Razorpay
//                             </Label>
//                             <p className="text-sm text-muted-foreground">
//                               {RAZORPAY_KEY ? "Secure payment gateway" : "Razorpay not configured"}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </RadioGroup>
//                   </CardContent>
//                 </Card>

//                 <Card>
//                   <CardHeader>
//                     <CardTitle className="text-lg">Payment Details</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {paymentMethod === "upi" && (
//                       <>
//                         <div className="space-y-2">
//                           <Label htmlFor="upiId">Your UPI ID</Label>
//                           <Input
//                             id="upiId"
//                             type="text"
//                             placeholder="yourname@paytm"
//                             value={formData.upiId}
//                             onChange={(e) => handleInputChange("upiId", e.target.value)}
//                           />
//                         </div>
//                         {formData.upiId && (
//                           <UpiQr
//                             upiId={formData.upiId}
//                             amount={advanceAmount}
//                             merchantName={booking?.turfName || "SportItUp"}
//                           />
//                         )}
//                       </>
//                     )}

//                     {paymentMethod === "card" && (
//                       <div className="space-y-4">
//                         <div className="space-y-2">
//                           <Label htmlFor="cardNumber">Card Number</Label>
//                           <Input
//                             id="cardNumber"
//                             type="text"
//                             placeholder="1234 5678 9012 3456"
//                             value={formData.cardNumber}
//                             onChange={(e) => handleInputChange("cardNumber", e.target.value)}
//                           />
//                         </div>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label htmlFor="expiryDate">Expiry Date</Label>
//                             <Input
//                               id="expiryDate"
//                               type="text"
//                               placeholder="MM/YY"
//                               value={formData.expiryDate}
//                               onChange={(e) => handleInputChange("expiryDate", e.target.value)}
//                             />
//                           </div>
//                           <div className="space-y-2">
//                             <Label htmlFor="cvv">CVV</Label>
//                             <Input
//                               id="cvv"
//                               type="password"
//                               placeholder="***"
//                               value={formData.cvv}
//                               onChange={(e) => handleInputChange("cvv", e.target.value)}
//                             />
//                           </div>
//                         </div>
//                         <div className="space-y-2">
//                           <Label htmlFor="cardholderName">Cardholder Name</Label>
//                           <Input
//                             id="cardholderName"
//                             type="text"
//                             placeholder="Name on card"
//                             value={formData.cardholderName}
//                             onChange={(e) => handleInputChange("cardholderName", e.target.value)}
//                           />
//                         </div>
//                       </div>
//                     )}

//                     {paymentMethod === "wallet" && (
//                       <div className="space-y-2">
//                         <Label htmlFor="walletProvider">Wallet</Label>
//                         <Input
//                           id="walletProvider"
//                           type="text"
//                           placeholder="paytm"
//                           value={formData.walletProvider}
//                           onChange={(e) => handleInputChange("walletProvider", e.target.value)}
//                         />
//                       </div>
//                     )}

//                     <Button
//                       className="w-full bg-green-600 hover:bg-green-700 text-white"
//                       size="lg"
//                       onClick={handlePayment}
//                       disabled={isProcessing || !detailsSaved}
//                     >
//                       {isProcessing ? "Processing..." : `Pay ₹${advanceAmount} Advance`}
//                     </Button>

//                     <p className="text-xs text-muted-foreground">
//                       You’ll pay ₹{advanceAmount} now and ₹{remainingAmount} at the venue. Total: ₹
//                       {totalAmount}.
//                     </p>
//                   </CardContent>
//                 </Card>
//               </>
//             )}
//           </div>

//           {/* Right: Booking Summary */}
//           <div className="lg:col-span-1">
//             <Card className="sticky top-24 border-gray-200">
//               <CardHeader>
//                 <CardTitle className="text-lg text-black">Booking Summary</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Venue:</span>
//                     <span className="font-medium text-black">
//                       {booking?.turfName || "Selected Venue"}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Location:</span>
//                     <span className="font-medium text-black">{booking?.location || "—"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Sport:</span>
//                     <span className="font-medium text-black">{booking?.sport || "—"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 flex items-center gap-1">
//                       <CalendarIcon className="w-4 h-4" />
//                       Date:
//                     </span>
//                     <span className="font-medium text-black">
//                       {bookingDate.toDateString()}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600 flex items-center gap-1">
//                       <Clock className="w-4 h-4" />
//                       Time Slots:
//                     </span>
//                     <span className="font-medium text-black">{slotsLabel}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Duration:</span>
//                     <span className="font-medium text-black">{durationHours} hour(s)</span>
//                   </div>
//                 </div>

//                 <div className="pt-2 border-t border-gray-200 space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Total Amount:</span>
//                     <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-green-700">
//                     <span>Paid Now (10% advance):</span>
//                     <span className="font-medium">₹{advanceAmount}</span>
//                   </div>
//                   <div className="flex justify-between text-sm text-orange-600">
//                     <span>Pay at Venue:</span>
//                     <span className="font-medium">₹{remainingAmount}</span>
//                   </div>

//                   {confirmError && (
//                     <p className="text-xs text-red-600">Note: {confirmError}</p>
//                   )}
//                 </div>

//                 {!detailsSaved && (
//                   <p className="text-xs text-muted-foreground">
//                     Save your details first to enable payment options.
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import PhoneOTP from "@/components/phoneOTP.js";

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
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verifiedPhone, setVerifiedPhone] = useState("");


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
  async function confirmBookingOnServer(paymentMeta) {
    try {
      setConfirmError(null);
      setIsConfirming(true);

      const dateStr =
        booking?.date instanceof Date
          ? booking.date.toISOString().split("T")[0]
          : booking?.date || "";

      const payload = {
        // who & how much
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        totalAmount,
        advanceAmount,
        remainingAmount,

        // what & when
        turfId: booking?.turfId || "",
        turfName: booking?.turfName || "Venue",
        location: booking?.location || "-",
        date: dateStr,
        timeSlots,

        // meta
        sport: booking?.sport || "",
        city: booking?.city || "",
        paymentMethod,
        paymentMeta, // includes razorpay ids or "simulated" flag
      };

      const res = await fetch("/api/public/booking/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to record booking");
      }
    } catch (e) {
      setConfirmError(e.message || "Failed to record booking");
    } finally {
      setIsConfirming(false);
    }
  }

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
  <Label htmlFor="custPhone">Phone Number (OTP)</Label>
  <PhoneOTP
    initialPhone={customer.phone}
    onVerified={(phone) => {
      setCustomer((s) => ({ ...s, phone }));
      setPhoneVerified(true);
      setVerifiedPhone(phone);
    }}
  />
  {!phoneVerified ? (
    <p className="text-sm text-yellow-600">Please verify your phone number to continue.</p>
  ) : (
    <p className="text-sm text-green-600">✅ Phone verified</p>
  )}
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
                  {/* <div className="flex flex-col gap-2 mt-3">
  <label className="text-sm text-gray-600">Phone Number</label>
  <input
    type="tel"
    value={customer.phone}
    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
    className="border p-2 rounded-md"
    placeholder="Enter 10-digit number"
  />

  {!otpSent ? (
    <button
      onClick={async () => {
        setOtpLoading(true);
        const res = await fetch("/api/otp/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: customer.phone }),
        });
        const data = await res.json();
        setOtpLoading(false);
        if (data.ok) {
          setOtpSent(true);
          alert("OTP sent successfully!");
        } else {
          alert("Failed to send OTP. Please check your number.");
        }
      }}
      disabled={!customer.phone || otpLoading}
      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
    >
      {otpLoading ? "Sending..." : "Send OTP"}
    </button>
  ) : (
    <>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="border p-2 rounded-md"
      />
      <button
        onClick={async () => {
          const res = await fetch("/api/otp/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: customer.phone, code: otp }),
          });
          const data = await res.json();
          if (data.ok) {
            setOtpVerified(true);
            alert("OTP verified successfully!");
          } else {
            alert(data.error || "Invalid OTP");
          }
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
      >
        Verify OTP
      </button>
    </>
  )}
</div> */}

                </div>

                {saveError && <p className="text-sm text-red-600">{saveError}</p>}

                {!detailsSaved ? (
                  <Button onClick={handleSaveDetails} disabled={!phoneVerified || !customer.name || !customer.email}>
  Save Details & Continue
</Button>


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
                      {/* <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
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
                      </div> */}

                      {/* <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
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
                      </div> */}

                      {/* <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-card/50">
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
                      </div> */}

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
                    {/* {paymentMethod === "upi" && (
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
                    )} */}

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