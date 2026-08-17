// Shared date-math helper, used by both the EUDR and Battery Passport scope
// checkers/countdowns so it isn't duplicated or imported from a
// category-specific dates file.

export function daysUntil(isoDate: string): number {
  const target = new Date(`${isoDate}T00:00:00Z`).getTime();
  return Math.max(0, Math.ceil((target - Date.now()) / 86400000));
}
