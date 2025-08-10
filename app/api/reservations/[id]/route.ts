import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: any
) {
  try {
    const reservationId = params.id;
    const updateData = await req.json();

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

    // Verifica che la prenotazione esista e appartenga all'utente
    const existingReservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        table: {
          include: {
            restaurant: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!existingReservation) {
      return NextResponse.json({ error: 'Prenotazione non trovata' }, { status: 404 });
    }

    // Verifica che l'utente sia proprietario del ristorante
    if (existingReservation.table.restaurant.user.id !== actualUserId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    // Prepara i dati per l'aggiornamento
    const updateFields: any = {};
    
    if (updateData.customerName) updateFields.customerName = updateData.customerName;
    if (updateData.customerPhone) updateFields.customerPhone = updateData.customerPhone;
    if (updateData.customerEmail !== undefined) updateFields.customerEmail = updateData.customerEmail;
    if (updateData.date) updateFields.date = new Date(updateData.date);
    if (updateData.time) updateFields.startTime = updateData.time;
    if (updateData.partySize) updateFields.guests = parseInt(updateData.partySize.toString());
    if (updateData.tableId) updateFields.tableId = updateData.tableId;
    if (updateData.notes !== undefined) updateFields.notes = updateData.notes;
    if (updateData.status) updateFields.status = updateData.status;

    // Aggiorna la prenotazione
    const updatedReservation = await prisma.reservation.update({
      where: { id: reservationId },
      data: updateFields,
      include: {
        table: true
      }
    });

    return NextResponse.json({
      success: true,
      reservation: updatedReservation,
      message: 'Prenotazione aggiornata con successo'
    });

  } catch (error) {
    console.error('Errore aggiornamento prenotazione:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  try {
    const reservationId = params.id;

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

    // Verifica che la prenotazione esista e appartenga all'utente
    const existingReservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
      include: {
        table: {
          include: {
            restaurant: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!existingReservation) {
      return NextResponse.json({ error: 'Prenotazione non trovata' }, { status: 404 });
    }

    // Verifica che l'utente sia proprietario del ristorante
    if (existingReservation.table.restaurant.user.id !== actualUserId) {
      return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
    }

    // Elimina la prenotazione
    await prisma.reservation.delete({
      where: { id: reservationId }
    });

    return NextResponse.json({
      success: true,
      message: 'Prenotazione eliminata con successo'
    });

  } catch (error) {
    console.error('Errore eliminazione prenotazione:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
} 