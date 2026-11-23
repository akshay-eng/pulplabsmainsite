/* Where PulpLabs works. One source for the hero chips, the "Where we work"
 * section, the contact page, the footer and the assistant, so the list can't
 * drift between them.
 *
 * Deliberately regions and time zones only — no cities or office addresses
 * until those are confirmed. `tz` is an IANA zone used for the live clock;
 * Canada and Europe span several zones, so each shows its main business zone
 * and lists the others in `zones`. */
export const regions = [
  {
    id: 'india',
    name: 'India',
    tz: 'Asia/Kolkata',
    zones: 'IST · UTC+5:30',
  },
  {
    id: 'canada',
    name: 'Canada',
    tz: 'America/Toronto',
    zones: 'ET · PT and everything between',
  },
  {
    id: 'europe',
    name: 'Europe',
    tz: 'Europe/Berlin',
    zones: 'CET · GMT · EET',
  },
]

export const regionNames = regions.map((r) => r.name)
// "India, Canada and Europe"
export const regionList = `${regionNames.slice(0, -1).join(', ')} and ${regionNames.at(-1)}`
