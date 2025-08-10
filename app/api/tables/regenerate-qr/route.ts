import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { MultiLanguageMenu } from '../../../lib/multiLanguageMenu';

export async function POST(req: NextRequest) {
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
      return NextResponse.json({ error: 'Ristorante non trovato' }, { status: 404 });
    }

    const restaurantId = user.restaurants[0].id;
    
    // Trova tutti i tavoli attivi del ristorante
    const tables = await prisma.table.findMany({
      where: { 
        restaurantId,
        isActive: true 
      }
    });

    if (tables.length === 0) {
      return NextResponse.json({ error: 'Nessun tavolo trovato' }, { status: 404 });
    }

    // Inizializza il gestore multilingua
    const multiLang = new MultiLanguageMenu();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const updatedTables = [];

    // Rigenera QR code per ogni tavolo
    for (const table of tables) {
      try {
        // Genera il QR code
        const qrCodeUrl = `${baseUrl}/qr/${table.id}`;
        const qrCodeDataUrl = await multiLang.generateAdaptiveQRCode(
          table.id, 
          'Mozilla/5.0', // User agent di default
          '127.0.0.1'    // IP di default
        );

        // Aggiorna il tavolo nel database
        const updatedTable = await prisma.table.update({
          where: { id: table.id },
          data: { 
            qrCode: qrCodeDataUrl,
            updatedAt: new Date()
          }
        });

        updatedTables.push({
          id: updatedTable.id,
          number: updatedTable.number,
          qrCodeGenerated: true
        });

      } catch (error) {
        console.error(`Errore generazione QR per tavolo ${table.number}:`, error);
        updatedTables.push({
          id: table.id,
          number: table.number,
          qrCodeGenerated: false,
          error: 'Errore generazione QR'
        });
      }
    }

    const successCount = updatedTables.filter(t => t.qrCodeGenerated).length;
    const totalCount = updatedTables.length;

    return NextResponse.json({ 
      success: true, 
      message: `QR rigenerati: ${successCount}/${totalCount}`,
      tables: updatedTables,
      regeneratedCount: successCount,
      totalCount
    });

  } catch (error) {
    console.error('Errore nella rigenerazione dei QR:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}