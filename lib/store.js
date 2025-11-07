const owners = [
  {
    id: "owner-1",
    email: "owner@sportitup.in",
    name: "Demo Turf Owner",
    password: "OwN3r!2025#", // DEMO ONLY - strong, non-breached
  },
]

// Map public turfIds to owners for in-memory routing (all map to demo owner for now)
export const turfOwners = {
  "super-six-turf": "owner-1",
  theturfplay: "owner-1",
  "the-pavilion-amritsar-cricket": "owner-1",
  "pickleup-amritsar": "owner-1",
  "the-pavilion-amritsar-pickleball": "owner-1",
  "box-cricket-patiala": "owner-1",
  "pickeball-patiala": "owner-1",
}

// Store data in module scope
let bookings = []
let blocks = []

export const store = {
  owners,
  bookings,
  blocks,
  turfOwners,
  reset() {
    bookings = []
    blocks = []
    this.bookings = bookings
    this.blocks = blocks
  },
}
