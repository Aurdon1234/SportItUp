// app/booking/[turfId]/BookingClient.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import useSWR, { mutate } from "swr";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Star, Clock, ArrowLeft, CalendarIcon, CreditCard } from "lucide-react";

const fetcher = (url) =>
  fetch(url)
    .then((r) => {
      if (!r.ok) throw new Error(`fetch ${url} failed: ${r.status}`);
      return r.json();
    })
    .catch((err) => {
      console.error("fetcher error:", err);
      // return a safe shape so UI won't crash
      return { ok: false, blockedHours: [] };
    });

/** turf dataset (unchanged) */
const turfData = {
  // "super-six-turf": {
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
  //   city: "amritsar",
  // },
  // theturfplay: {
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
  //   city: "amritsar",
  // },
  // "the-pavilion-amritsar-cricket": {
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
  //   city: "amritsar",
  // },
  // "pickleup-amritsar": {
  //   name: "Pickleup Amritsar",
  //   location: "Lumsden Club, Amritsar",
  //   rating: 4.6,
  //   reviews: 67,
  //   sports: ["Pickleball"],
  //   pricePerHour: 600,
  //   courts: 2,
  //   image: "/pickleball-court-amritsar-indoor-modern.png",
  //   amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
  //   openTime: "6:00 AM",
  //   closeTime: "11:00 PM",
  //   city: "amritsar",
  // },
  "pavilion-amritsar": {
    name: "The Pavilion Amritsar",
    location: "Next to RB Estate, Loharka Road, Amritsar",
    rating: 4.6,
    reviews: 11,
    sports: ["Pickleball", "Cricket", "Football"],
    // pricePerHour: 800,
    pricing: {Pickleball: {normal: 1000,}, Cricket: {normal: 1200,}, Football: {normal: 1200,},},
    hasPeakPricing: false,
    courts: 6,
    image: "/pavilion-amritsar.jpeg",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "12:00 AM",
    city: "amritsar",
  },
  // "box-cricket-patiala": {
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
  //   city: "patiala",
  // },
  // "pickleball-patiala": {
  //   name: "Pickleball Patiala",
  //   location: "Sheesh Mahal Enclave, Patiala",
  //   rating: 4.9,
  //   reviews: 98,
  //   sports: ["Pickleball"],
  //   // pricePerHour: 600,
  //   priceNormal: 600,
  //   pricePeak: 600,
  //   courts: 2,
  //   image: "/pickleball-patiala.webp",
  //   amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
  //   openTime: "6:00 AM",
  //   closeTime: "10:00 PM",
  //   city: "patiala",
  // },
  "pinnacle-patiala": {
    name: "The Pinnacle Club",
    location: "Tiwana Chownk, Near Bhadson Rd, Patiala",
    rating: 5.0,
    reviews: 1,
    sports: ["Pickleball"],
    // priceNormal: 600,
    // pricePeak: 800,
    pricing: {Pickleball: {normal: 600, peak: 800,},},
    hasPeakPricing: true,
    courts: 2,
    image: "/pinnacle-patiala.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "11:00 PM",
    city: "patiala",
  },  
  "dmk-patiala": {
    name: "DMK Royal Cube",
    location: "434, Ranjit Nagar, Patiala",
    rating: 4.9,
    reviews: 87,
    sports: ["Cricket", "Tennis"],
    // priceNormal: 800,
    pricing: {Tennis: {normal: 800,}, Cricket: {normal: 1000,},},
    hasPeakPricing: false,
    courts: 1,
    image: "/dmk-patiala.png",
    amenities: ["Floodlights", "Equipment", "Washrooms", "Parking"],
    openTime: "6:00 AM",
    closeTime: "11:00 PM",
    city: "patiala",
  },  
};

const HARD_BLOCKED_HOURS_BY_TURF = {
  "dmk-patiala": ["15:00", "16:00", "17:00", "18:00"],
};

const SPORT_COURT_MAP = {
  "pavilion-amritsar": {
    Pickleball: ["1", "2", "3", "4"],
    Cricket: ["5", "6"],
    Football: ["6"],
  },
};

const FIXED_TOTAL_PRICING = {
  "pavilion-amritsar": {
    Cricket: {
      1: 1200,
      2: 2200,
      3: 3000,
      max: 3,
    },
    Football: {
      1: 1200,
      2: 2200,
      3: 3000,
      max: 3,
    },
  },
};

const TURF_BOOKING_RULES = {
  "pavilion-amritsar": {
    allowCoupon: false,
    advancePercent: 0,
  },
};

// defaults for all other turfs
const DEFAULT_BOOKING_RULES = {
  allowCoupon: true,
  advancePercent: 10,
};

const PEAK_START_HOUR = 16; // 4 PM
const PEAK_END_HOUR = 24;   // 12 AM

// function isPeakHour(timeHHMM) {
//   const hour = parseInt(timeHHMM.split(":")[0], 10);
//   return hour >= PEAK_START_HOUR && hour < PEAK_END_HOUR;
// }
function isPeakHour(turf, timeHHMM) {
  if (!turf?.hasPeakPricing) return false;

  const hour = parseInt(timeHHMM.split(":")[0], 10);
  return hour >= PEAK_START_HOUR && hour < PEAK_END_HOUR;
}

function getSlotPrice(turf, sport, timeHHMM) {
  if (!turf || !sport) return 0;

  const sportPricing = turf.pricing?.[sport];
  if (!sportPricing) return 0;

  const isPeak = isPeakHour(turf, timeHHMM);

  if (isPeak && sportPricing.peak) {
    return sportPricing.peak;
  }

  return sportPricing.normal;
}

// const generateTimeSlots = (turf, openTime, closeTime) => {
//   const slots = [];
//   const parseTime = (timeStr) => {
//     const [time, period] = timeStr.split(" ");
//     let [hours] = time.split(":").map(Number);
//     if (period === "PM" && hours !== 12) hours += 12;
//     if (period === "AM" && hours === 12) hours = 0;
//     return hours;
//   };

//   const openHour = parseTime(openTime);
//   const closeHour = parseTime(closeTime);

//   for (let hour = openHour; hour < closeHour; hour++) {
//     const time24 = hour.toString().padStart(2, "0") + ":00";
//     const time12 =
//       hour === 0 ? "12:00 AM" : hour < 12 ? `${hour}:00 AM` : hour === 12 ? "12:00 PM" : `${hour - 12}:00 PM`;

//     slots.push({
//       time: time24,
//       label: time12,
//       // peak: hour >= PEAK_START_HOUR && hour < PEAK_END_HOUR,
//       peak: turf?.hasPeakPricing && hour >= PEAK_START_HOUR && hour < PEAK_END_HOUR,
//     });
//   }

//   return slots;
// };
const generateTimeSlots = (turf, openTime, closeTime) => {
  const slots = [];

  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(" ");
    let [hours] = time.split(":").map(Number);
    if (period === "PM" && hours !== 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours;
  };

  const openHour = parseTime(openTime);
  let closeHour = parseTime(closeTime);

  // ✅ HANDLE OVERNIGHT (e.g. 6 AM → 2 AM)
  if (closeHour <= openHour) {
    closeHour += 24;
  }

  for (let hour = openHour; hour < closeHour; hour++) {
    const normalizedHour = hour % 24;

    const time24 = String(normalizedHour).padStart(2, "0") + ":00";

    const time12 =
      normalizedHour === 0
        ? "12:00 AM"
        : normalizedHour < 12
        ? `${normalizedHour}:00 AM`
        : normalizedHour === 12
        ? "12:00 PM"
        : `${normalizedHour - 12}:00 PM`;

    slots.push({
      time: time24,
      label: time12,
      peak:
        turf?.hasPeakPricing &&
        normalizedHour >= PEAK_START_HOUR &&
        normalizedHour < PEAK_END_HOUR,
    });
  }

  return slots;
};


export default function BookingClient({ turfId, initialDate, initialBlockedHours = [] }) {
  // defensive parse of props:
  const safeTurfId = typeof turfId === "string" ? turfId : String(turfId || "");
  const initialDateSafe = typeof initialDate === "string" ? initialDate : new Date().toISOString().split("T")[0];
  const seededBlocked = Array.isArray(initialBlockedHours) ? initialBlockedHours : [];

  // debug logs — these will appear in browser console
  useEffect(() => {
    console.log("[BookingClient] mounted", { turfId: safeTurfId, initialDate: initialDateSafe, seededBlocked });
  }, []);

  const turf = turfData[safeTurfId];
  const [selectedDate, setSelectedDate] = useState(() => new Date(initialDateSafe));
  const [selectedTimeSlots, setSelectedTimeSlots] = useState(() => new Set());
  const [selectedSport, setSelectedSport] = useState("");

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const bookingRules = {
  ...DEFAULT_BOOKING_RULES,
  ...(TURF_BOOKING_RULES[safeTurfId] || {}),
};

const { allowCoupon, advancePercent } = bookingRules;

  useEffect(() => {
    if (turf?.sports?.length === 1 && !selectedSport) setSelectedSport(turf.sports[0]);
  }, [turf, selectedSport]);

  //CHANGE FOR COURTS
  const courtsCount = turf?.courts || 1;
  const [selectedCourt, setSelectedCourt] = useState("1");

  useEffect(() => {
    setSelectedCourt("1");
    setSelectedTimeSlots(new Set());
  }, [safeTurfId]);

  const dateKey = selectedDate ? formatDateLocal(selectedDate) : "";
  // const availabilityUrl = dateKey ? `/api/public/availability?turfId=${encodeURIComponent(turfId)}&date=${encodeURIComponent(dateKey)}` : null;
  const availabilityUrl = dateKey
  ? `/api/public/availability?turfId=${encodeURIComponent(turfId)}&date=${encodeURIComponent(dateKey)}&court=${encodeURIComponent(selectedCourt)}`
  : null;

  const allowedCourtsForSport = useMemo(() => {
  if (!selectedSport) return null;

  return (
    SPORT_COURT_MAP[safeTurfId]?.[selectedSport] || null
  );
}, [safeTurfId, selectedSport]);

useEffect(() => {
  if (!allowedCourtsForSport) return;

  if (!allowedCourtsForSport.includes(selectedCourt)) {
    setSelectedCourt(allowedCourtsForSport[0]); // auto-pick first valid court
    setSelectedTimeSlots(new Set()); // reset slots
  }
}, [allowedCourtsForSport, selectedCourt]);

  const { data: avail, error: availError } = useSWR(availabilityUrl, fetcher, {
    refreshInterval: 4000,
    revalidateOnFocus: false,
  });

  // debug the availability payload
  useEffect(() => {
    console.log("[BookingClient] availability payload", { availabilityUrl, avail, availError });
  }, [availabilityUrl, avail, availError]);

  // normalize blockedHours into a Set for fast lookups
  // const blockedHoursSet = useMemo(() => {
  //   const bh = Array.isArray(avail?.blockedHours) ? avail.blockedHours : seededBlocked;
  //   // ensure elements are strings like "08:00"
  //   const normalized = bh.filter(Boolean).map((b) => String(b).padStart(5, "0"));
  //   return new Set(normalized);
  // }, [avail, seededBlocked]);
  const blockedHoursSet = useMemo(() => {
  const apiBlocked = Array.isArray(avail?.blockedHours)
    ? avail.blockedHours
    : seededBlocked;

  const hardBlocked = HARD_BLOCKED_HOURS_BY_TURF[safeTurfId] || [];

  const merged = [...apiBlocked, ...hardBlocked]
    .filter(Boolean)
    .map((b) => String(b).padStart(5, "0"));

  return new Set(merged);
}, [avail, seededBlocked, safeTurfId]);

  const getCourtLabel = (turfId, courtNumber) => {
  if (turfId === "pavilion-amritsar") {
    if (courtNumber === "5") return "Cricket";
    if (courtNumber === "6") return "Multisport";
  }
  return `Court ${courtNumber}`;
};

  if (!turf) {
    // show a user-friendly message; avoid throwing
    console.warn("[BookingClient] turf not found for id:", safeTurfId);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Turf not found</h2>
          <p className="text-sm text-gray-600 mt-2">Please go back to the venues list.</p>
          <Link href={`/turfs`}>Back to Venues</Link>
        </div>
      </div>
    );
  }

  const timeSlots = turf
    ? generateTimeSlots(turf, turf.openTime, turf.closeTime)
    : [];

  // debug the computed timeslots
  useEffect(() => {
    console.log("[BookingClient] timeSlots computed:", timeSlots.map((s) => s.time));
  }, [turf]);

//   const toggleTimeSlot = (time) => {
//   if (!time) return;
//   // if blocked by sheet -> no action
//   if (blockedHoursSet.has(time)) return;

//   // if slot is within 30 min or passed -> no action
//   if (isSlotTooCloseOrPast(selectedDate, time)) return;

//   setSelectedTimeSlots((prev) => {
//     const next = new Set(prev);
//     if (next.has(time)) next.delete(time);
//     else next.add(time);
//     return next;
//   });
// };
  const toggleTimeSlot = (time) => {
  if (!time) return;
  if (blockedHoursSet.has(time)) return;
  if (isSlotTooCloseOrPast(selectedDate, time)) return;

  const sport = selectedSport || turf.sports[0];
  const fixedPricing =
    FIXED_TOTAL_PRICING[safeTurfId]?.[sport];
  const maxSlots = fixedPricing?.max;

  setSelectedTimeSlots((prev) => {
    const next = new Set(prev);

    if (next.has(time)) {
      next.delete(time);
      return next;
    }

    if (maxSlots && next.size >= maxSlots) {
      alert(`Maximum ${maxSlots} slots allowed for ${sport}`);
      return prev;
    }

    next.add(time);
    return next;
  });
};

  const slotsCount = selectedTimeSlots.size;
  const sport = selectedSport || turf.sports[0];

  const fixedPricing =
  FIXED_TOTAL_PRICING[safeTurfId]?.[sport];
      // const totalAmount = Array.from(selectedTimeSlots).reduce((sum, t) => {
      //   return sum + getSlotPrice(turf, selectedSport || turf.sports[0], t);
      // }, 0);
  const totalAmount = fixedPricing
  ? fixedPricing[slotsCount] || 0
  : Array.from(selectedTimeSlots).reduce((sum, t) => {
      return sum + getSlotPrice(turf, sport, t);
    }, 0);

  // const advanceAmount = Math.round(totalAmount * 0.1);
  // const remainingAmount = totalAmount - advanceAmount;

  const advanceAmount = Math.round((totalAmount * advancePercent) / 100);
  const remainingAmount = totalAmount - advanceAmount;

  const DISCOUNT_PERCENT = 20;

  const discountAmount = couponApplied
    ? Math.round((totalAmount * DISCOUNT_PERCENT) / 100)
    : 0;

  const discountedTotal = totalAmount - discountAmount;

// Advance stays SAME
  const finalAdvanceAmount = advanceAmount;

// Pay at venue updates
  const finalRemainingAmount = discountedTotal - finalAdvanceAmount;

  const handleApplyCoupon = () => {
  if (couponCode.trim().toUpperCase() === "EARLYBIRD") {
    setCouponApplied(false);
    setCouponError("");
  } else {
    setCouponApplied(false);
    setCouponError("Invalid coupon code");
  }
};

  // 30 minutes before slot start -> disable
const DISABLE_BEFORE_MS = 30 * 60 * 1000;

// function slotDateTimeFor(selectedDate, timeHHMM) {
//   // selectedDate is a Date object
//   const d = new Date(selectedDate);
//   const [hh, mm] = timeHHMM.split(":").map(Number);
//   d.setHours(hh, mm, 0, 0);
//   return d;
// }

function slotDateTimeFor(selectedDate, timeHHMM) {
  // Build a local-time Date for the slot using the selected date's local Y/M/D.
  // This avoids UTC-midnight issues from parsing "YYYY-MM-DD" strings.
  const y = selectedDate.getFullYear();
  const m = selectedDate.getMonth(); // zero-based month
  const d = selectedDate.getDate();
  const [hh, mm] = timeHHMM.split(":").map(Number);
  return new Date(y, m, d, hh, mm, 0, 0); // local-time constructor
}


function formatDateLocal(date) {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`; // YYYY-MM-DD in local timezone
}


function isSlotTooCloseOrPast(selectedDate, timeHHMM) {
  const slotDt = slotDateTimeFor(selectedDate, timeHHMM);
  const now = new Date();
  return slotDt.getTime() - now.getTime() <= DISABLE_BEFORE_MS;
}


  // final check before payment — re-check availability via API
  const handleProceedToPayment = async () => {
    const needsSportSelection = turf.sports.length > 1 && !selectedSport;
    if (slotsCount === 0 || !selectedDate || needsSportSelection) {
      alert("Please select date, at least one time slot, and sport before proceeding");
      return;
    }

    if (!availabilityUrl) {
      alert("Unable to verify availability (missing URL). Try again.");
      return;
    }

    try {
      const fresh = await fetch(availabilityUrl).then((r) => (r.ok ? r.json() : { blockedHours: [] }));
      const freshBlocked = new Set(Array.isArray(fresh?.blockedHours) ? fresh.blockedHours : []);
      const conflicts = Array.from(selectedTimeSlots).filter((s) => freshBlocked.has(s));
      if (conflicts.length > 0) {
        alert(`Sorry — these slots were just booked: ${conflicts.join(", ")}. Please reselect.`);
        mutate(availabilityUrl);
        return;
      }
    } catch (err) {
      console.error("Failed to refresh availability:", err);
      // optionally block or continue. We'll continue but log.
    }

    const chosenSlots = Array.from(selectedTimeSlots);

    const conflictsByTime = chosenSlots.filter((s) => isSlotTooCloseOrPast(selectedDate, s));
if (conflictsByTime.length > 0) {
  alert(`These slots are too close to start or already started: ${conflictsByTime.join(", ")}. Please reselect.`);
  // revalidate availability UI
  if (availabilityUrl) mutate(availabilityUrl);
  return;
}

    const bookingData = {
      turfId: safeTurfId,
      turfName: turf.name,
      // CHANGE FOR COURTS
      court: selectedCourt,
      location: turf.location,
      date: formatDateLocal(selectedDate),
      timeSlots: chosenSlots,
      sport: selectedSport || turf.sports?.[0],
      // totalAmount,
      // advanceAmount,
      // remainingAmount,
  totalAmount: discountedTotal,
  advanceAmount: finalAdvanceAmount,
  remainingAmount: finalRemainingAmount,

  couponCode: couponApplied ? "EARLYBIRD" : null,
  discountAmount,
  
      courts: turf.courts || 1,
      tzOffsetMinutes: new Date().getTimezoneOffset(),
    };

    const queryParams = new URLSearchParams({
      booking: JSON.stringify(bookingData),
    }).toString();

    window.location.href = `/payment?${queryParams}`;
  };

  // UI render — mapping is safe because timeSlots is always an array
  return (
    <div className="min-h-screen bg-white">
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

        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                    {Array.isArray(turf.sports) &&
                      turf.sports.map((s, i) => (
                        <Badge key={`${s}-${i}`} variant="outline" className="text-xs border-green-200 text-green-700">
                          {s}
                        </Badge>
                      ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {turf.openTime} - {turf.closeTime}
                    </div>
                    <div className="text-green-600 font-medium">
  {selectedSport ? (
    <>
      ₹{turf.pricing[selectedSport].normal}/hr
      {turf.hasPeakPricing &&
        turf.pricing[selectedSport].peak &&
        turf.pricing[selectedSport].peak !== turf.pricing[selectedSport].normal && (
          <span className="ml-2 text-orange-600">
            (₹{turf.pricing[selectedSport].peak}/hr peak)
          </span>
        )}
    </>
  ) : (
    "Select a sport"
  )}
</div>

                    {/* <div className="text-green-600 font-medium">
  ₹{turf.priceNormal}/hr
  {turf.hasPeakPricing && turf.pricePeak && turf.pricePeak !== turf.priceNormal && (
    <span className="ml-2 text-orange-600">
      (₹{turf.pricePeak}/hr peak)
    </span>
  )}
</div> */}
                    {/* <div className="text-green-600 font-medium">
  ₹{turf.priceNormal}/hr
  {turf.pricePeak && turf.pricePeak !== turf.priceNormal && (
    <span className="ml-2 text-orange-600">
      (₹{turf.pricePeak}/hr peak)
    </span>
  )}
</div> */}
                    {turf.courts && turf.courts > 1 && <div>{turf.courts} Courts Available</div>}
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-6">
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
                      {Array.isArray(turf.sports) &&
                        turf.sports.map((sport) => (
                          <SelectItem key={sport} value={sport}>
                            {sport} : ₹{turf.pricing?.[sport]?.normal}
                            {turf.hasPeakPricing && turf.pricing?.[sport]?.peak && (
                              <> – ₹{turf.pricing[sport].peak}</>
                            )}/hr
                            {/* {sport} : ₹{turf.priceNormal}
{turf.hasPeakPricing && turf.pricePeak && turf.pricePeak !== turf.priceNormal && (
  <> – ₹{turf.pricePeak}</>
)}
/hr */}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {turf.sports.length > 1 && !selectedSport && (
                    <p className="mt-2 text-xs text-gray-500">Please choose a sport to continue.</p>
                  )}
                </CardContent>
              </Card>

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
                    onSelect={(d) => d && setSelectedDate(d)}
                    // disabled={(d) => d < new Date() || d < new Date("1900-01-01")}
                    disabled={(d) => {
  // disable any day strictly before local today (compare date-only)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const check = new Date(d);
  check.setHours(0, 0, 0, 0);
  return check < today;
}}
                    className="rounded-md border border-gray-200"
                  />
                </CardContent>
              </Card>
              {/* CHANGE FOR COURTS */}
              {courtsCount > 1 && (
                <Card className="border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-black">Select Court</CardTitle>
                  </CardHeader>
                <CardContent>
      <div className="flex gap-3">
        {Array.from({ length: courtsCount }).map((_, i) => {
          const court = `Court ${i + 1}`;
          const courtNumber = String(i + 1);

          const isAllowed = !allowedCourtsForSport || allowedCourtsForSport.includes(courtNumber);

          return (
            <Button
  key={courtNumber}
  variant={selectedCourt === courtNumber ? "default" : "outline"}
  className={`${
    selectedCourt === courtNumber
      ? "bg-green-600 text-white"
      : "border-gray-200"
  } ${!isAllowed ? "opacity-50 cursor-not-allowed" : ""}`}
  disabled={!isAllowed}
  onClick={() => {
    if (!isAllowed) return;
    setSelectedTimeSlots(new Set());
    setSelectedCourt(courtNumber);
  }}
>
  {/* Court {courtNumber} */}
  {getCourtLabel(safeTurfId, courtNumber)}
</Button>
//             <Button
//   key={courtNumber}
//   variant={selectedCourt === courtNumber ? "default" : "outline"}
//   className={
//     selectedCourt === courtNumber
//       ? "bg-green-600 text-white"
//       : "border-gray-200"
//   }
//   onClick={() => {
//     setSelectedTimeSlots(new Set()); // reset slots
//     setSelectedCourt(courtNumber);   // ✅ store ONLY number
//   }}
// >
//   Court {courtNumber} {/* UI label only */}
// </Button>

          );
        })}
      </div>
    </CardContent>
  </Card>
)}


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
                    {/* {timeSlots.map((slot) => {
                      // safe property access
                      const time = slot && slot.time ? String(slot.time) : null;
                      const label = slot && slot.label ? slot.label : time || "—";
                      const disabled = time ? blockedHoursSet.has(time) : true;
                      const isSelected = time ? selectedTimeSlots.has(time) : false;

                      return (
                        <Button
                          key={time || Math.random()}
                          variant={isSelected ? "default" : "outline"}
                          className={`relative h-16 flex flex-col items-center justify-center ${
                            isSelected
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                          } ${slot.peak ? "border-orange-200 hover:border-orange-300" : ""} ${
                            disabled ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-500" : ""
                          }`}
                          onClick={() => time && toggleTimeSlot(time)}
                          disabled={disabled}
                        >
                          <span className="font-medium">{label}</span>
                          <span className="text-xs text-gray-600">₹{turf.pricePerHour}</span>
                          {slot.peak && <Badge className="absolute -top-1 -right-1 text-xs px-1 py-0 bg-orange-500">Peak</Badge>}
                          {disabled && <span className="absolute bottom-1 text-[10px] text-gray-600"></span>}
                        </Button>
                      );
                    })} */}
                    {timeSlots.map((slot) => {
  const time = slot && slot.time ? String(slot.time) : null;
  const label = slot && slot.label ? slot.label : time || "—";

  const disabledBySheet = time ? blockedHoursSet.has(time) : true;
  const disabledByTime = time ? isSlotTooCloseOrPast(selectedDate, time) : false;
  const disabled = disabledBySheet || disabledByTime;

  const isSelected = time ? selectedTimeSlots.has(time) : false;

  return (
    <Button
      key={time || Math.random()}
      variant={isSelected ? "default" : "outline"}
      className={`relative h-16 flex flex-col items-center justify-center ${
        isSelected
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "border-gray-200 hover:border-green-300 hover:bg-green-50"
      } ${slot.peak ? "border-orange-200 hover:border-orange-300" : ""} ${
        disabled ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-500" : ""
      }`}
      onClick={() => time && toggleTimeSlot(time)}
      disabled={disabled}
    >
      <span className="font-medium">{label}</span>
      {/* <span className="text-xs text-gray-600">₹{isPeakHour(turf, time) ? turf.pricePeak : turf.priceNormal}</span> */}
      <span className="text-xs text-gray-600">₹{getSlotPrice(turf, selectedSport || turf.sports[0], time)}</span>


      {slot.peak && <Badge className="absolute -top-1 -right-1 text-xs px-1 py-0 bg-orange-500">Peak</Badge>}

      {/* Badge/label showing reason */}
      {disabledBySheet && <span className="absolute bottom-1 text-[10px] text-gray-600"></span>}
      {!disabledBySheet && disabledByTime && (
        <span className="absolute bottom-1 text-[10px] text-gray-600"></span>
      )}
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

          <div className="lg:col-span-1">
            {/* <Card className="sticky top-24 border-gray-200">
              <CardHeader>
                <CardTitle className="text-lg text-black">Booking Summary</CardTitle>
              </CardHeader> */}
              <Card className="sticky top-24 border-gray-200">
  <CardHeader className="space-y-3">
    <CardTitle className="text-lg text-black">Booking Summary</CardTitle>

    {/* Coupon Code */}
    {/* <div className="flex gap-2">
      <input
        type="text"
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
        disabled={couponApplied}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={handleApplyCoupon}
        disabled={couponApplied}
      >
        Apply
      </Button>
    </div>

    {couponApplied && (
      <p className="text-xs text-green-600">
        Coupon <strong>EARLYBIRD</strong> applied (20% off)
      </p>
    )}

    {couponError && (
      <p className="text-xs text-red-500">{couponError}</p>
    )} */}
    {allowCoupon && (
  <>
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Enter coupon code"
        value={couponCode}
        onChange={(e) => setCouponCode(e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
        disabled={couponApplied}
      />
      <Button
        size="sm"
        variant="outline"
        onClick={handleApplyCoupon}
        disabled={couponApplied}
      >
        Apply
      </Button>
    </div>

    {couponApplied && (
      <p className="text-xs text-green-600">
        Coupon <strong>EARLYBIRD</strong> applied (20% off)
      </p>
    )}

    {couponError && (
      <p className="text-xs text-red-500">{couponError}</p>
    )}
  </>
)}

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
                      <span className="font-medium text-black">{/*₹{totalAmount}*/}₹{discountedTotal}</span>
                    </div>
                    {couponApplied && (
  <div className="flex justify-between text-sm text-green-600">
    <span>Coupon Discount (20%):</span>
    <span className="font-medium">-₹{discountAmount}</span>
  </div>
)}

                    <div className="flex justify-between text-sm text-green-600">
                      <span>Advance Payment:</span>
                      <span className="font-medium">{/*₹{advanceAmount}*/}₹{finalAdvanceAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-orange-600">
                      <span>Pay at Venue:</span>
                      <span className="font-medium">{/*₹{remainingAmount}*/}₹{finalRemainingAmount}</span>
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
                    <CreditCard className="w-4 h-4 mr-2 inline-block" /> {/*Pay ₹{selectedSport || turf.sports.length === 1 ? advanceAmount : 0} Advance*/}Pay ₹{finalAdvanceAmount} Advance
                  </Button>
                </div>

                <div className="text-xs text-gray-600 pt-2">
                  <p>• Pay only 10% advance online</p>
                  <p>• Remaining 90% to be paid at venue</p>
                  {/* <p>• Booking confirmation via SMS/Email</p>
                  <p>• Cancellation allowed up to 2 hours before slot</p> */}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
