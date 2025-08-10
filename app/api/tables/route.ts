import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import QRCode from 'qrcode';

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
    
    const tables = await prisma.table.findMany({
      where: { 
        restaurantId,
        isActive: true 
      },
      include: {
        orders: {
          where: {
            status: {
              in: ['PENDING', 'PREPARING', 'READY']
            }
          },
          include: {
            items: {
              include: {
                menuItem: true
              }
            }
          }
        },
        reservations: {
          where: {
            status: 'CONFIRMED',
            date: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lt: new Date(new Date().setHours(23, 59, 59, 999))
            }
          }
        }
      },
      orderBy: { number: 'asc' }
    });
    
    return NextResponse.json({ success: true, tables });
  } catch (error) {
    console.error('Errore nel recupero tavoli:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { number, capacity, type, status } = await req.json();
    
    if (!number || !capacity || !type) {
      return NextResponse.json({ error: 'Numero, capacità e tipo sono obbligatori' }, { status: 400 });
    }
    
    // Ottieni restaurantId dalla sessione (stesso metodo del GET)
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
    
    // Verifica che il numero tavolo non esista già
    const existingTable = await prisma.table.findFirst({
      where: {
        restaurantId,
        number,
        isActive: true
      }
    });

    if (existingTable) {
      return NextResponse.json({ error: `Tavolo numero ${number} già esistente` }, { status: 400 });
    }
    
    // Crea il tavolo
    const table = await prisma.table.create({
      data: {
        number,
        capacity,
        type,
        status: status || 'AVAILABLE',
        restaurantId
      }
    });

    // Genera QR code per il nuovo tavolo
    try {
      const { MultiLanguageMenu } = await import('../../lib/multiLanguageMenu');
      const multiLang = new MultiLanguageMenu();
      const qrCodeDataUrl = await multiLang.generateAdaptiveQRCode(
        table.id, 
        'Mozilla/5.0',
        '127.0.0.1'
      );

      // Aggiorna il tavolo con il QR code
      const updatedTable = await prisma.table.update({
        where: { id: table.id },
        data: { qrCode: qrCodeDataUrl }
      });

      return NextResponse.json({ 
        success: true, 
        table: updatedTable,
        message: `Tavolo ${number} creato con QR code`
      });

    } catch (qrError) {
      console.error('Errore generazione QR per nuovo tavolo:', qrError);
      // Tavolo creato ma senza QR, restituiamo comunque successo
      return NextResponse.json({ 
        success: true, 
        table,
        message: `Tavolo ${number} creato (QR da rigenerare)`
      });
    }
    
  } catch (error) {
    console.error('Errore nella creazione tavolo:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
} 