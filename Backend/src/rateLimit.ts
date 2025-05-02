import type { Context, Next } from 'hono';

const rateLimit = (limit: number, windowMs: number) => {
  const requests: Record<string, { count: number; lastRequest: number }> = {};

  return async (c: Context, next: Next) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('remote-addr') || 'unknown';
    const currentTime = Date.now();

    if (!requests[ip]) {
      requests[ip] = { count: 1, lastRequest: currentTime };
    } else {
      const timePassed = currentTime - requests[ip].lastRequest;
      if (timePassed > windowMs) {
        requests[ip].count = 1;
        requests[ip].lastRequest = currentTime;
      } else {
        requests[ip].count++;
      }
    }

    if (requests[ip].count > limit) {
      return c.json({ durum: 'Başarısız', mesaj: 'Sınırlayıcıya takıldınız.'}, 429);
    }

    await next();
  };
};

export default rateLimit; 