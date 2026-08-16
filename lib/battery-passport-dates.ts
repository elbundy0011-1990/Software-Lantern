// Single source of truth for the Battery Passport compliance date, so it
// can't drift out of sync between /battery-passport and
// /resources/regulations/battery-passport. Verified against Regulation (EU)
// 2023/1542, Article 77, corroborated across independent sources — see
// docs/PHASE-9-CHANGES.md for the verification record. Same pattern as
// lib/eudr-dates.ts.

export const BATTERY_PASSPORT_DEADLINE = {
  date: "2027-02-18",
  display: "18 February 2027",
  scope: "EV batteries, LMT batteries (e-bikes and e-scooters), and industrial batteries above 2 kWh",
} as const;
