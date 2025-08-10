import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { restaurantId } = await request.json();

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID required' }, { status: 400 });
    }

    // Simula un test di connessione Stripe
    const testResult = {
      success: true,
      message: 'Connessione Stripe testata con successo',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(testResult);
  } catch (error) {
    console.error('Errore test Stripe:', error);
    return NextResponse.json({ 
      error: 'Errore durante il test di Stripe' 
    }, { status: 500 });
  }
} 