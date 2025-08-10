import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - Ottieni un singolo menu item
export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {
    const { id } = params;
    
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
    
    const menuItem = await prisma.menuItem.findFirst({
      where: { 
        id,
        category: {
          restaurantId: restaurantId
        }
      },
      include: {
        category: true
      }
    });
    
    if (!menuItem) {
      return NextResponse.json({ success: false, error: 'Menu item non trovato' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, menuItem });
  } catch (error) {
    console.error('Errore nel recupero menu item:', error);
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 });
  }
}

// PUT - Aggiorna un menu item
export async function PUT(
  req: NextRequest,
  { params }: any
) {
  try {
    const { id } = params;
    const { name, description, price, categoryId, image, isAvailable, isVegetarian, isGlutenFree, allergens } = await req.json();
    
    if (!name || !price || !categoryId) {
      return NextResponse.json({ success: false, error: 'Nome, prezzo e categoria sono obbligatori' }, { status: 400 });
    }

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

    const userRestaurantId = user.restaurants[0].id;

    // Verifica che il menu item esista e appartenga al ristorante dell'utente
    const existingMenuItem = await prisma.menuItem.findFirst({
      where: { 
        id,
        category: {
          restaurantId: userRestaurantId
        }
      }
    });

    if (!existingMenuItem) {
      return NextResponse.json({ success: false, error: 'Menu item non trovato' }, { status: 404 });
    }

    // Verifica che la categoria appartenga al ristorante dell'utente
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category || category.restaurantId !== userRestaurantId) {
      return NextResponse.json({ success: false, error: 'Categoria non trovata o non autorizzata' }, { status: 403 });
    }
    
    const updatedMenuItem = await prisma.menuItem.update({
      where: { id },
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        categoryId,
        image: image || '',
        isAvailable: isAvailable !== false,
        isVegetarian: isVegetarian || false,
        isGlutenFree: isGlutenFree || false,
        allergens: allergens || null
      },
      include: {
        category: true
      }
    });
    
    return NextResponse.json({ success: true, menuItem: updatedMenuItem });
  } catch (error) {
    console.error('Errore nell\'aggiornamento menu item:', error);
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 });
  }
}

// DELETE - Elimina un menu item
export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  try {
    const { id } = params;
    
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

    const userRestaurantId = user.restaurants[0].id;

    // Verifica che il menu item esista e appartenga al ristorante dell'utente
    const existingMenuItem = await prisma.menuItem.findFirst({
      where: { 
        id,
        category: {
          restaurantId: userRestaurantId
        }
      }
    });

    if (!existingMenuItem) {
      return NextResponse.json({ success: false, error: 'Menu item non trovato' }, { status: 404 });
    }
    
    await prisma.menuItem.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true, message: 'Menu item eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione menu item:', error);
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 });
  }
} 