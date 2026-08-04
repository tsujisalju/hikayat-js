export function createRateLimiter(limit, windowMs) {
    const hits = new Map(); // closure variable, persists across calls, private to this limiter instance
    return function rateLimit(req, res, next) {
        const key = req.ip;
        const now = Date.now();

        const record = hits.get(key) ?? { count: 0, windowStart: now };
        if (now - record.windowStart > windowMs) {
            record.count = 0;
            record.windowStart = now;
        }

        record.count += 1;
        hits.set(key, record);

        if (record.count > limit) {
          return res.status(429).json({ error: "Too many requests, slow down" });
        }

        next();
    }
}
