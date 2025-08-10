import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Estrai user ID da cookie
    const userId = request.cookies.get('user_id')?.value;
    const sessionToken = request.cookies.get('session_token')?.value;
    
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
        console.error('Errore parsing session token:', error);
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
          select: {
            id: true,
            name: true,
            address: true,
            phone: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      restaurant: user.restaurants[0] || null, // Mantiene compatibilità con il primo ristorante
      restaurants: user.restaurants // Aggiunge tutti i ristoranti per uso futuro
    };

    return NextResponse.json({ user: userData });
  } catch (error) {
    console.error('Errore in /api/auth/me:', error);
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 });
  }
} 