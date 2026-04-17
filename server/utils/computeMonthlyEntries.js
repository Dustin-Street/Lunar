/**
 *
 * @param {*} entries
 *
 * @returns the parsed number of entries the user has made in that month by referencing the rawDate property in the JournalEntry schema.
 */
export function computeMonthlyEntries(entries) {
  const now = new Date();
  return entries.filter(
    (e) =>
      e.rawDate.getMonth() === now.getMonth() &&
      e.rawDate.getFullYear() === now.getFullYear(),
  ).length;
}
