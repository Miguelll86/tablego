import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    // Ottieni restaurantId dalla sessione
    const userId = req.cookies.get('user_id')?.value;
    const sessionToken = req.cookies.get('session_token')?.value;
    
    if (!userId && !sessionToken) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    let actualUserId = userId;
    
    // Se non abbiamo user_id ma abbiamo session_token, estraiamo l'ID da lì
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
      return NextResponse.json({ error: 'Ristorante non trovato' }, { status: 404 });
    }

    // Per ora usa il primo ristorante (compatibilità)
    const restaurantId = user.restaurants[0].id;
    
    const orders = await prisma.order.findMany({
      where: { 
        restaurantId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)) // Solo ordini di oggi
        }
      },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                category: true
              }
            }
          }
        },
        table: true
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Errore nel recupero ordini:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { tableId, items, totalAmount, notes } = await req.json();
    
    if (!tableId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Dati ordine incompleti' }, { status: 400 });
    }
    
    // Trova il ristorante dal tavolo
    const table = await prisma.table.findUnique({
      where: { id: tableId },
      include: { restaurant: true }
    });
    
    if (!table) {
      return NextResponse.json({ error: 'Tavolo non trovato' }, { status: 404 });
    }
    
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'DINE_IN',
        tableId,
        restaurantId: table.restaurantId,
        totalAmount,
        notes,
        status: 'PENDING',
        items: {
          create: items.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes
          }))
        }
      },
      include: {
        items: {
          include: {
            menuItem: {
              include: {
                category: true
              }
            }
          }
        },
        table: true
      }
    });
    
    return NextResponse.json(order);
  } catch (error) {
    console.error('Errore nella creazione ordine:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
} 