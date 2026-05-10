const ipMap = new Map<string, { count: number; timestamp: number }>();

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

export function rateLimit(ip: string) {
  const now = Date.now();
  const record = ipMap.get(ip);

  if (!record) {
    ipMap.set(ip, { count: 1, timestamp: now });
    return { success: true };
  }

  // reset window
  if (now - record.timestamp > WINDOW_MS) {
    ipMap.set(ip, { count: 1, timestamp: now });
    return { success: true };
  }

  // within window
  if (record.count >= MAX_REQUESTS) {
    return { success: false };
  }

  record.count += 1;
  ipMap.set(ip, record);

  return { success: true };
}