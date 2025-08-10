import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

// GET - Ottieni tutti i ristoranti dell'utente
export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const sessionToken = req.cookies.get('session_token')?.value;
    
    if (!userId && !sessionToken) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    let actualUserId = userId;
    
    if (!actualUserId && sessionToken) {
      try {
        const sessionData = JSON.parse(sessionToken);
        actualUserId = sessionData.userId;
      } catch (error) {
        return NextResponse.json({ error: 'Sessione non valida' }, { status: 401 });
      }
    }

    if (!actualUserId) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: actualUserId },
      include: {
        restaurants: {
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true,
            piva: true,
            codiceUnivoco: true,
            isActive: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      restaurants: user.restaurants 
    });
  } catch (error) {
    console.error('Errore nel recupero ristoranti:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

// POST - Aggiungi un nuovo ristorante (solo per uso amministrativo)
export async function POST(req: NextRequest) {
  try {
    const { name, address, phone, email, description } = await req.json();
    
    if (!name || !address || !phone || !email) {
      return NextResponse.json({ error: 'Nome, indirizzo, telefono e email sono obbligatori' }, { status: 400 });
    }

    const userId = req.cookies.get('user_id')?.value;
    const sessionToken = req.cookies.get('session_token')?.value;
    
    if (!userId && !sessionToken) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    let actualUserId = userId;
    
    if (!actualUserId && sessionToken) {
      try {
        const sessionData = JSON.parse(sessionToken);
        actualUserId = sessionData.userId;
      } catch (error) {
        return NextResponse.json({ error: 'Sessione non valida' }, { status: 401 });
      }
    }

    if (!actualUserId) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    // Verifica che l'utente esista
    const user = await prisma.user.findUnique({
      where: { id: actualUserId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    // Crea il nuovo ristorante
    const newRestaurant = await prisma.restaurant.create({
      data: {
        name,
        address,
        phone,
        email,
        description: description || '',
        isActive: true,
        userId: actualUserId
      }
    });

    return NextResponse.json({ 
      success: true, 
      restaurant: newRestaurant,
      message: 'Ristorante aggiunto con successo'
    });
  } catch (error) {
    console.error('Errore nell\'aggiunta ristorante:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
} 