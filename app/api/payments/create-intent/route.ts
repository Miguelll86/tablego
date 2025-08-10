import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { checkRateLimit, getRateLimitHeaders } from '@/app/lib/rateLimit';
import { AppError, handleApiError, validateRequired } from '@/app/lib/errorHandler';

export const runtime = 'nodejs';

function buildCorsHeaders(request: NextRequest): Record<string, string> {
  const requestOrigin = request.headers.get('origin') || '';
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
  const isDev = process.env.NODE_ENV !== 'production';

  const allowOrigin = isDev
    ? requestOrigin || '*'
    : (allowedOrigins.includes(requestOrigin) ? requestOrigin : '');

  const headers: Record<string, string> = {
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  };

  if (allowOrigin) headers['Access-Control-Allow-Origin'] = allowOrigin;

  return headers;
}

export async function OPTIONS(request: NextRequest) {
  const headers = buildCorsHeaders(request);
  return new NextResponse(null, { status: 204, headers });
}

export async function POST(request: NextRequest) {
  try {
    if (!checkRateLimit(request, 'api')) {
      const headers = { ...getRateLimitHeaders(request, 'api'), ...buildCorsHeaders(request) };
      return NextResponse.json({ error: 'Troppe richieste, riprova più tardi.' }, { status: 429, headers });
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) throw new AppError('Stripe non è configurato', 500);

    const stripe = new Stripe(stripeSecretKey);

    const body = await request.json();
    validateRequired(body, ['amount']);

    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount <= 0) throw new AppError('Importo non valido', 400);

    const currency = (body.currency || 'eur').toString().toLowerCase();
    const metadata = {
      restaurantId: body.restaurantId || 'unknown',
      orderId: body.orderId || 'unknown'
    } as Record<string, string>;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency,
      automatic_payment_methods: { enabled: true },
      metadata
    });

    const headers = { ...getRateLimitHeaders(request, 'api'), ...buildCorsHeaders(request) };
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    }, { headers });

  } catch (error) {
    const { error: message, statusCode } = handleApiError(error);
    const headers = buildCorsHeaders(request);
    return NextResponse.json({ error: message }, { status: statusCode, headers });
  }
}


