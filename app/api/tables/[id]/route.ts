import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: any
) {
  try {
    const tableId = params.id;
    const updateData = await req.json();

    // Verifica autenticazione
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

    // Verifica che il tavolo esista e appartenga all'utente
    const table = await prisma.table.findUnique({
      where: { id: tableId },
      include: {
        restaurant: {
          include: {
            user: true
          }
        }
      }
    });

    if (!table) {
      return NextResponse.json({ error: 'Tavolo non trovato' }, { status: 404 });
    }

    // Verifica che l'utente sia proprietario del ristorante
    if (table.restaurant.user.id !== actualUserId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    // Se è solo un aggiornamento di status (per occupare/liberare)
    if (updateData.status && Object.keys(updateData).length === 1) {
      const updatedTable = await prisma.table.update({
        where: { id: tableId },
        data: { 
          status: updateData.status,
          updatedAt: new Date()
        }
      });

      return NextResponse.json({
        success: true,
        table: updatedTable,
        message: `Tavolo ${updatedTable.number} ${updateData.status === 'OCCUPIED' ? 'occupato' : 'liberato'} con successo`
      });
    }

    // Altrimenti è una modifica completa del tavolo
    const { number, capacity, position, type, status } = updateData;
    
    if (!number || !capacity || !type) {
      return NextResponse.json({ error: 'Numero, capacità e tipo sono obbligatori' }, { status: 400 });
    }

    // Verifica che il numero tavolo non esista già (escludendo il tavolo corrente)
    const existingTable = await prisma.table.findFirst({
      where: {
        restaurantId: table.restaurantId,
        number,
        isActive: true,
        id: { not: tableId }
      }
    });

    if (existingTable) {
      return NextResponse.json({ error: `Tavolo numero ${number} già esistente` }, { status: 400 });
    }

    // Aggiorna il tavolo
    const updatedTable = await prisma.table.update({
      where: { id: tableId },
      data: { 
        number,
        capacity,
        position: position || '',
        type,
        status: status || 'AVAILABLE',
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      table: updatedTable,
      message: `${updatedTable.type === 'UMBRELLA' ? 'Ombrellone' : 'Tavolo'} ${updatedTable.number} aggiornato con successo`
    });

  } catch (error) {
    console.error('Errore aggiornamento tavolo:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  try {
    const tableId = params.id;

    // Verifica autenticazione
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

    // Verifica che il tavolo esista e appartenga all'utente
    const table = await prisma.table.findUnique({
      where: { id: tableId },
      include: {
        restaurant: {
          include: {
            user: true
          }
        }
      }
    });

    if (!table) {
      return NextResponse.json({ error: 'Tavolo non trovato' }, { status: 404 });
    }

    // Verifica che l'utente sia proprietario del ristorante
    if (table.restaurant.user.id !== actualUserId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    // Elimina il tavolo (soft delete)
    const deletedTable = await prisma.table.update({
      where: { id: tableId },
      data: { 
        isActive: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: `Tavolo ${deletedTable.number} eliminato con successo`
    });

  } catch (error) {
    console.error('Errore eliminazione tavolo:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
} 