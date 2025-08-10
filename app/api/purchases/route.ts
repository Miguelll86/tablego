import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import { handleApiError } from '../../lib/errorHandler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID required' }, { status: 400 });
    }

    const purchases = await prisma.purchase.findMany({
      where: { restaurantId },
      orderBy: { purchaseDate: 'desc' }
    });

    return NextResponse.json({
      success: true,
      purchases
    });
  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { restaurantId, type, amount } = await request.json();

    if (!restaurantId || !type || !amount) {
      return NextResponse.json({ error: 'Restaurant ID, type and amount required' }, { status: 400 });
    }

    // Verifica se il ristorante ha già acquistato Tablo Pro
    if (type === 'ONE_TIME') {
      const existingPurchase = await prisma.purchase.findFirst({
        where: {
          restaurantId,
          type: 'ONE_TIME',
          status: 'COMPLETED'
        }
      });

      if (existingPurchase) {
        return NextResponse.json({ error: 'Tablo Pro già acquistato per questo ristorante' }, { status: 400 });
      }
    }

    // Calcola la data di scadenza per il supporto
    let supportExpiry = null;
    if (type === 'SUPPORT') {
      supportExpiry = new Date();
      supportExpiry.setFullYear(supportExpiry.getFullYear() + 1);
    }

    const purchase = await prisma.purchase.create({
      data: {
        restaurantId,
        type,
        amount,
        supportExpiry,
        status: 'COMPLETED'
      }
    });

    return NextResponse.json({
      success: true,
      purchase,
      message: type === 'ONE_TIME' 
        ? 'Tablo Pro acquistato con successo!' 
        : 'Supporto premium attivato per 1 anno!'
    });
  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
} 