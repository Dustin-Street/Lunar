/**
 *
 * @param {*} entries
 *
 * @returns the most common day the user has made an entry in that month by referencing the rawDate property in the JournalEntry schema.
 */

export function computeCommonDay(entries) {
  const counts = {};

  const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  for (const e of entries) {
    const day = e.rawDate.getDay(); // 0–6
    counts[day] = (counts[day] || 0) + 1;
  }

  const most = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];

  return weekDays[most[0]] || null;
}
