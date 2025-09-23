export function windowBounds(days: number) {
  const now = new Date();
  const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { since, sinceISO: since.toISOString(), now };
}
