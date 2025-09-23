export async function getJSON<T>(url: string, headers: Record<string, string> = {}): Promise<T> {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.json() as Promise<T>;
}
