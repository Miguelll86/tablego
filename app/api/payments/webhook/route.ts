import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { handleApiError, AppError } from '@/app/lib/errorHandler';

export const runtime = 'nodejs';

// Stripe richiede il raw body per verificare la firma del webhook
export const config = {
  api: {
    bodyParser: false
  }
};

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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Stripe-Signature'
  };

  if (allowOrigin) headers['Access-Control-Allow-Origin'] = allowOrigin;

  return headers;
}

export async function OPTIONS(request: NextRequest) {
  const headers = buildCorsHeaders(request);
  return new NextResponse(null, { status: 204, headers });
}

async function readRawBody(request: NextRequest): Promise<string> {
  const arrayBuffer = await request.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer.toString('utf8');
}

export async function POST(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!stripeSecretKey || !webhookSecret) throw new AppError('Stripe non è configurato', 500);

    const stripe = new Stripe(stripeSecretKey);

    const signature = request.headers.get('stripe-signature');
    if (!signature) throw new AppError('Firma Stripe mancante', 400);

    const rawBody = await readRawBody(request);

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      throw new AppError('Firma del webhook non valida', 400);
    }

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.log('Pagamento riuscito:', intent.id, intent.metadata);
        break;
      }
      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.warn('Pagamento fallito:', intent.id, intent.last_payment_error?.message);
        break;
      }
      default:
        console.log('Evento Stripe non gestito:', event.type);
    }

    const headers = buildCorsHeaders(request);
    return NextResponse.json({ received: true }, { headers });

  } catch (error) {
    const { error: message, statusCode } = handleApiError(error);
    const headers = buildCorsHeaders(request);
    return NextResponse.json({ error: message }, { status: statusCode, headers });
  }
}


