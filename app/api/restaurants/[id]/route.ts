import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - Ottieni un ristorante specifico
export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {
    const restaurantId = params.id;
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

    const restaurant = await prisma.restaurant.findFirst({
      where: {
        id: restaurantId,
        userId: actualUserId
      },
      include: {
        categories: true,
        tables: true,
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!restaurant) {
      return NextResponse.json({ error: 'Ristorante non trovato' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      restaurant 
    });
  } catch (error) {
    console.error('Errore nel recupero ristorante:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

// PUT - Aggiorna un ristorante
export async function PUT(
  req: NextRequest,
  { params }: any
) {
  try {
    const restaurantId = params.id;
    const { name, address, phone, email, description, isActive, piva, codiceUnivoco } = await req.json();
    
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

    // Verifica che il ristorante appartenga all'utente
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: {
        id: restaurantId,
        userId: actualUserId
      }
    });

    if (!existingRestaurant) {
      return NextResponse.json({ error: 'Ristorante non trovato' }, { status: 404 });
    }

    // Aggiorna il ristorante
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: name || undefined,
        address: address || undefined,
        phone: phone || undefined,
        email: email || undefined,
        description: description || undefined,
        piva: piva || undefined,
        codiceUnivoco: codiceUnivoco || undefined,
        isActive: isActive !== undefined ? isActive : undefined
      }
    });

    return NextResponse.json({ 
      success: true, 
      restaurant: updatedRestaurant,
      message: 'Ristorante aggiornato con successo'
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento ristorante:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

// DELETE - Elimina un ristorante (soft delete)
export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  try {
    const restaurantId = params.id;
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

    // Verifica che il ristorante appartenga all'utente
    const existingRestaurant = await prisma.restaurant.findFirst({
      where: {
        id: restaurantId,
        userId: actualUserId
      }
    });

    if (!existingRestaurant) {
      return NextResponse.json({ error: 'Ristorante non trovato' }, { status: 404 });
    }

    // Soft delete - imposta isActive a false
    const deletedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { 
        isActive: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Ristorante ${deletedRestaurant.name} eliminato con successo`
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione ristorante:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
} 