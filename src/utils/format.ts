export function formatUptime(seconds: number): string {
  const units: [string, number][] = [
    ["d", 86400],
    ["h", 3600],
    ["m", 60],
    ["s", 1],
  ];

  let remaining = Math.floor(seconds);
  const parts: string[] = [];

  for (const [label, size] of units) {
    const amount = Math.floor(remaining / size);
    remaining -= amount * size;
    if (amount > 0) parts.push(`${amount}${label}`);
  }

  return parts.join(" ") || "0s";
}
