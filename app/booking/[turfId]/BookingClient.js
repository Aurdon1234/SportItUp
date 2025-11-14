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
  "pickleball-patiala": {
    name: "Pickleball Patiala",
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
      peak: hour >= 16 && hour < 22,
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

  useEffect(() => {
    if (turf?.sports?.length === 1 && !selectedSport) setSelectedSport(turf.sports[0]);
  }, [turf, selectedSport]);

  const dateKey = selectedDate ? selectedDate.toISOString().split("T")[0] : "";

  const availabilityUrl = dateKey
    ? `/api/public/availability?turfId=${encodeURIComponent(safeTurfId)}&date=${encodeURIComponent(dateKey)}`
    : null;

  const { data: avail, error: availError } = useSWR(availabilityUrl, fetcher, {
    refreshInterval: 4000,
    revalidateOnFocus: false,
  });

  // debug the availability payload
  useEffect(() => {
    console.log("[BookingClient] availability payload", { availabilityUrl, avail, availError });
  }, [availabilityUrl, avail, availError]);

  // normalize blockedHours into a Set for fast lookups
  const blockedHoursSet = useMemo(() => {
    const bh = Array.isArray(avail?.blockedHours) ? avail.blockedHours : seededBlocked;
    // ensure elements are strings like "08:00"
    const normalized = bh.filter(Boolean).map((b) => String(b).padStart(5, "0"));
    return new Set(normalized);
  }, [avail, seededBlocked]);

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

  const timeSlots = Array.isArray(generateTimeSlots(turf.openTime, turf.closeTime))
    ? generateTimeSlots(turf.openTime, turf.closeTime)
    : [];

  // debug the computed timeslots
  useEffect(() => {
    console.log("[BookingClient] timeSlots computed:", timeSlots.map((s) => s.time));
  }, [turf]);

  // const toggleTimeSlot = (time) => {
  //   if (!time) return;
  //   if (blockedHoursSet.has(time)) return; // blocked => no action
  //   setSelectedTimeSlots((prev) => {
  //     const next = new Set(prev);
  //     if (next.has(time)) next.delete(time);
  //     else next.add(time);
  //     return next;
  //   });
  // };

  const toggleTimeSlot = (time) => {
  if (!time) return;
  // if blocked by sheet -> no action
  if (blockedHoursSet.has(time)) return;

  // if slot is within 30 min or passed -> no action
  if (isSlotTooCloseOrPast(selectedDate, time)) return;

  setSelectedTimeSlots((prev) => {
    const next = new Set(prev);
    if (next.has(time)) next.delete(time);
    else next.add(time);
    return next;
  });
};


  const slotsCount = selectedTimeSlots.size;
  const totalAmount = slotsCount * (turf.pricePerHour || 0);
  const advanceAmount = Math.round(totalAmount * 0.1);
  const remainingAmount = totalAmount - advanceAmount;
  // 30 minutes before slot start -> disable
const DISABLE_BEFORE_MS = 30 * 60 * 1000;

function slotDateTimeFor(selectedDate, timeHHMM) {
  // selectedDate is a Date object
  const d = new Date(selectedDate);
  const [hh, mm] = timeHHMM.split(":").map(Number);
  d.setHours(hh, mm, 0, 0);
  return d;
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
      location: turf.location,
      date: selectedDate.toISOString().split("T")[0],
      timeSlots: chosenSlots,
      sport: selectedSport || turf.sports?.[0],
      totalAmount,
      advanceAmount,
      remainingAmount,
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
                    <div className="text-green-600 font-medium">₹{turf.pricePerHour}/hr</div>
                    {turf.courts && turf.courts > 1 && <div>{turf.courts} courts available</div>}
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
                    disabled={(d) => d < new Date() || d < new Date("1900-01-01")}
                    className="rounded-md border border-gray-200"
                  />
                </CardContent>
              </Card>

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
      <span className="text-xs text-gray-600">₹{turf.pricePerHour}</span>
      {slot.peak && <Badge className="absolute -top-1 -right-1 text-xs px-1 py-0 bg-orange-500">Peak</Badge>}
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
                    <CreditCard className="w-4 h-4 mr-2 inline-block" /> Pay ₹{selectedSport || turf.sports.length === 1 ? advanceAmount : 0} Advance
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
