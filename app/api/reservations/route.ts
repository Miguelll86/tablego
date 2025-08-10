import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    
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
    
    const whereClause: any = { restaurantId };
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      
      whereClause.date = {
        gte: startDate,
        lt: endDate
      };
    }
    
    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      include: {
        table: true
      },
      orderBy: { date: 'asc' }
    });
    
    return NextResponse.json({ success: true, reservations });
  } catch (error) {
    console.error('Errore nel recupero prenotazioni:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { customerName, customerPhone, customerEmail, date, time, partySize, tableId, notes } = await req.json();
    
    // Validazione campi obbligatori
    if (!customerName || !customerPhone || !date || !time || !partySize || !tableId) {
      return NextResponse.json({ 
        error: 'Campi obbligatori mancanti: nome, telefono, data, orario, numero persone e tavolo' 
      }, { status: 400 });
    }
    
    // Trova il ristorante dal tavolo
    const table = await prisma.table.findUnique({
      where: { id: tableId },
      include: { restaurant: true }
    });
    
    if (!table) {
      return NextResponse.json({ error: 'Tavolo non trovato' }, { status: 404 });
    }
    
    const reservation = await prisma.reservation.create({
      data: {
        customerName,
        customerPhone,
        customerEmail: customerEmail || '',
        date: new Date(date),
        startTime: time,
        endTime: time, // Per ora usiamo lo stesso orario
        guests: parseInt(partySize.toString()), // Assicura che sia un numero
        tableId,
        restaurantId: table.restaurantId,
        notes: notes || '',
        status: 'CONFIRMED'
      },
      include: {
        table: true
      }
    });

    // Invia notifica WhatsApp al cliente
    let whatsappUrl = null;
    try {
      const whatsappMessage = `🎉 Prenotazione Confermata!

Ciao ${customerName},

La tua prenotazione per ${table.restaurant.name} è stata confermata:

📅 Data: ${new Date(date).toLocaleDateString('it-IT')}
🕐 Orario: ${time}
👥 Persone: ${partySize}
🪑 Tavolo: ${table.number}
📝 Note: ${notes || 'Nessuna nota'}

Grazie per aver scelto ${table.restaurant.name}!

Per modifiche o cancellazioni, contattaci al ${table.restaurant.phone || 'numero del ristorante'}`;

      // Pulisce il numero di telefono
      const cleanPhone = customerPhone.replace(/\D/g, '');
      const formattedPhone = cleanPhone.startsWith('39') ? cleanPhone : 
                            cleanPhone.startsWith('+39') ? cleanPhone.substring(3) : 
                            `39${cleanPhone}`;

      whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(whatsappMessage)}`;
      
      console.log('WhatsApp URL generato:', whatsappUrl);
      
    } catch (whatsappError) {
      console.error('Errore generazione WhatsApp URL:', whatsappError);
      // Non blocchiamo la creazione della prenotazione se WhatsApp fallisce
    }
    
    return NextResponse.json({
      ...reservation,
      whatsappUrl // Includiamo l'URL WhatsApp nella risposta
    });
  } catch (error) {
    console.error('Errore nella creazione prenotazione:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
} 