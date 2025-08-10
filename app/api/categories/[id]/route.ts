import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

// GET - Ottieni una singola categoria
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
    
    const category = await prisma.category.findFirst({
      where: { 
        id,
        restaurantId
      }
    });
    
    if (!category) {
      return NextResponse.json({ success: false, error: 'Categoria non trovata' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('Errore nel recupero categoria:', error);
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 });
  }
}

// PUT - Aggiorna una categoria
export async function PUT(
  req: NextRequest,
  { params }: any
) {
  try {
    const { id } = params;
    const { name, description, displayOrder } = await req.json();
    
    if (!name) {
      return NextResponse.json({ success: false, error: 'Nome categoria obbligatorio' }, { status: 400 });
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

    // Verifica che la categoria esista e appartenga al ristorante dell'utente
    const existingCategory = await prisma.category.findFirst({
      where: { 
        id,
        restaurantId: userRestaurantId
      }
    });

    if (!existingCategory) {
      return NextResponse.json({ success: false, error: 'Categoria non trovata' }, { status: 404 });
    }
    
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        description: description || '',
        displayOrder: displayOrder || existingCategory.displayOrder
      }
    });
    
    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error('Errore nell\'aggiornamento categoria:', error);
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 });
  }
}

// DELETE - Elimina una categoria
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

    // Verifica che la categoria esista e appartenga al ristorante dell'utente
    const existingCategory = await prisma.category.findFirst({
      where: { 
        id,
        restaurantId: userRestaurantId
      }
    });

    if (!existingCategory) {
      return NextResponse.json({ success: false, error: 'Categoria non trovata' }, { status: 404 });
    }

    // Verifica se ci sono menu items associati a questa categoria
    const menuItemsCount = await prisma.menuItem.count({
      where: { categoryId: id }
    });

    if (menuItemsCount > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Impossibile eliminare la categoria. Ci sono ${menuItemsCount} piatti associati. Elimina prima i piatti.` 
      }, { status: 400 });
    }
    
    await prisma.category.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true, message: 'Categoria eliminata con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione categoria:', error);
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 });
  }
} 