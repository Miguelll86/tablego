import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// POST - Aggiungi un nuovo ristorante per un utente esistente (solo per uso amministrativo)
export async function POST(req: NextRequest) {
  try {
    const { userId, name, address, phone, email, description, piva, codiceUnivoco } = await req.json();
    
    if (!userId || !name || !address || !phone || !email) {
      return NextResponse.json({ 
        error: 'User ID, nome, indirizzo, telefono e email sono obbligatori' 
      }, { status: 400 });
    }

    // Verifica che l'utente esista
    const user = await prisma.user.findUnique({
      where: { id: userId }
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
        piva: piva || null,
        codiceUnivoco: codiceUnivoco || null,
        isActive: true,
        userId: userId
      }
    });

    return NextResponse.json({ 
      success: true, 
      restaurant: newRestaurant,
      message: `Ristorante "${name}" aggiunto con successo all'utente ${user.name}`
    });
  } catch (error) {
    console.error('Errore nell\'aggiunta ristorante amministrativa:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

// GET - Ottieni tutti i ristoranti di un utente (solo per uso amministrativo)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID richiesto' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
            createdAt: true,
            updatedAt: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      restaurants: user.restaurants 
    });
  } catch (error) {
    console.error('Errore nel recupero ristoranti amministrativo:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
} 