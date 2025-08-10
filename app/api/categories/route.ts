import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Verifica autenticazione
    const userId = req.cookies.get('user_id')?.value;
    const sessionToken = req.cookies.get('session_token')?.value;
    
    if (!userId && !sessionToken) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }

    let actualUserId = userId;
    
    if (!actualUserId && sessionToken) {
      try {
        const sessionData = JSON.parse(sessionToken);
        actualUserId = sessionData.userId;
      } catch (error) {
        return NextResponse.json({ success: false, error: 'Sessione non valida' }, { status: 401 });
      }
    }

    if (!actualUserId) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }

    // Trova l'utente e i suoi ristoranti
    const user = await prisma.user.findUnique({
      where: { id: actualUserId },
      include: {
        restaurants: {
          // Rimuovo take: 1 per supportare più ristoranti
          select: { id: true }
        }
      }
    });

    if (!user || !user.restaurants.length) {
      return NextResponse.json({ success: false, error: 'Ristorante non trovato' }, { status: 404 });
    }

    // Per ora usa il primo ristorante (compatibilità)
    const restaurantId = user.restaurants[0].id;

    const categories = await prisma.category.findMany({
      where: { 
        restaurantId,
        isActive: true 
      },
      orderBy: { displayOrder: 'asc' }
    });
    
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('Errore nel recupero categorie:', error);
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verifica autenticazione
    const userId = req.cookies.get('user_id')?.value;
    const sessionToken = req.cookies.get('session_token')?.value;
    
    if (!userId && !sessionToken) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }

    let actualUserId = userId;
    
    if (!actualUserId && sessionToken) {
      try {
        const sessionData = JSON.parse(sessionToken);
        actualUserId = sessionData.userId;
      } catch (error) {
        return NextResponse.json({ success: false, error: 'Sessione non valida' }, { status: 401 });
      }
    }

    if (!actualUserId) {
      return NextResponse.json({ success: false, error: 'Non autenticato' }, { status: 401 });
    }

    // Trova l'utente e i suoi ristoranti
    const user = await prisma.user.findUnique({
      where: { id: actualUserId },
      include: {
        restaurants: {
          // Rimuovo take: 1 per supportare più ristoranti
          select: { id: true }
        }
      }
    });

    if (!user || !user.restaurants.length) {
      return NextResponse.json({ success: false, error: 'Ristorante non trovato' }, { status: 404 });
    }

    // Per ora usa il primo ristorante (compatibilità)
    const restaurantId = user.restaurants[0].id;

    const { name, description, displayOrder } = await req.json();
    
    if (!name) {
      return NextResponse.json({ success: false, error: 'Nome categoria obbligatorio' }, { status: 400 });
    }
    
    const category = await prisma.category.create({
      data: {
        name,
        description: description || '',
        restaurantId,
        displayOrder: displayOrder || 0,
        isActive: true
      }
    });
    
    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Errore nella creazione categoria:', error);
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 });
  }
} 