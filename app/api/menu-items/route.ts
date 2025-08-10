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

    // Trova l'utente e il suo ristorante
    const user = await prisma.user.findUnique({
      where: { id: actualUserId },
      include: {
        restaurants: {
          take: 1,
          select: { id: true }
        }
      }
    });

    if (!user || !user.restaurants[0]) {
      return NextResponse.json({ success: false, error: 'Ristorante non trovato' }, { status: 404 });
    }

    const restaurantId = user.restaurants[0].id;
    
    const menuItems = await prisma.menuItem.findMany({
      where: { 
        category: {
          restaurantId: restaurantId
        },
        isAvailable: true 
      },
      include: {
        category: true
      },
      orderBy: [
        { category: { displayOrder: 'asc' } },
        { displayOrder: 'asc' }
      ]
    });
    
    return NextResponse.json({ success: true, menuItems });
  } catch (error) {
    console.error('Errore nel recupero menu items:', error);
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

    const { name, description, price, categoryId, image, isAvailable } = await req.json();
    
    if (!name || !price || !categoryId) {
      return NextResponse.json({ success: false, error: 'Nome, prezzo e categoria sono obbligatori' }, { status: 400 });
    }

    // Trova l'utente e il suo ristorante
    const user = await prisma.user.findUnique({
      where: { id: actualUserId },
      include: {
        restaurants: {
          take: 1,
          select: { id: true }
        }
      }
    });

    if (!user || !user.restaurants[0]) {
      return NextResponse.json({ success: false, error: 'Ristorante non trovato' }, { status: 404 });
    }

    const userRestaurantId = user.restaurants[0].id;

    // Verifica che la categoria appartenga al ristorante dell'utente
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category || category.restaurantId !== userRestaurantId) {
      return NextResponse.json({ success: false, error: 'Categoria non trovata o non autorizzata' }, { status: 403 });
    }
    
    const menuItem = await prisma.menuItem.create({
      data: {
        name,
        description: description || '',
        price,
        categoryId,
        image: image || '',
        isAvailable: isAvailable !== false,
        displayOrder: 0
      },
      include: {
        category: true
      }
    });
    
    return NextResponse.json({ success: true, menuItem });
  } catch (error) {
    console.error('Errore nella creazione menu item:', error);
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 });
  }
} 