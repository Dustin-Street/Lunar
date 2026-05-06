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
    if (!e.rawDate) continue; 
    const day = new Date(e.rawDate).getDay(); 
    counts[day] = (counts[day] || 0) + 1;
  }

  const entriesArr = Object.entries(counts);
  if (entriesArr.length === 0) return null; 

  const most = entriesArr.sort((a, b) => b[1] - a[1])[0];

  return weekDays[most[0]] || null;
}
