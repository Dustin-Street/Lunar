export function computeCommonMood(entries) {
  const counts = {};

  for (const e of entries) {
    counts[e.mood] = (counts[e.mood] || 0) + 1;
  }

  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}
