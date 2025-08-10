import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

class RateLimiter {
  private requests = new Map<string, { count: number; resetTime: number }>();

  constructor(private config: RateLimitConfig) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const record = this.requests.get(identifier);

    if (!record || now > record.resetTime) {
      // Reset o nuova richiesta
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.config.windowMs
      });
      return true;
    }

    if (record.count >= this.config.maxRequests) {
      return false;
    }

    record.count++;
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const record = this.requests.get(identifier);
    if (!record) return this.config.maxRequests;
    return Math.max(0, this.config.maxRequests - record.count);
  }
}

// Rate limiters per diversi endpoint
const authLimiter = new RateLimiter({ windowMs: 15 * 60 * 1000, maxRequests: 5 }); // 5 tentativi in 15 min
const apiLimiter = new RateLimiter({ windowMs: 60 * 1000, maxRequests: 100 }); // 100 richieste al minuto

export function getClientIdentifier(request: NextRequest): string {
  // Usa IP + User-Agent come identificatore
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `${ip}-${userAgent}`;
}

export function checkRateLimit(request: NextRequest, type: 'auth' | 'api' = 'api'): boolean {
  const identifier = getClientIdentifier(request);
  const limiter = type === 'auth' ? authLimiter : apiLimiter;
  return limiter.isAllowed(identifier);
}

export function getRateLimitHeaders(request: NextRequest, type: 'auth' | 'api' = 'api'): Record<string, string> {
  const identifier = getClientIdentifier(request);
  const limiter = type === 'auth' ? authLimiter : apiLimiter;
  const remaining = limiter.getRemainingRequests(identifier);
  
  return {
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(Date.now() + 60000).toISOString()
  };
} 