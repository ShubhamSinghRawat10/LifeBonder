export function rateLimit({ windowMs, maxRequests }) {
  const requests = new Map();
  let operations = 0;

  return (req, res, next) => {
    const now = Date.now();
    operations += 1;
    if (operations % 1024 === 0) {
      for (const [address, item] of requests) {
        if (now >= item.resetAt) requests.delete(address);
      }
    }
    const key = req.ip || req.socket.remoteAddress || "unknown";
    let entry = requests.get(key);
    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      requests.set(key, entry);
    }
    entry.count += 1;
    res.setHeader("RateLimit-Limit", String(maxRequests));
    res.setHeader("RateLimit-Remaining", String(Math.max(0, maxRequests - entry.count)));
    if (entry.count > maxRequests) {
      return res.status(429).json({ message: "Too many requests. Please try again shortly." });
    }
    next();
  };
}
