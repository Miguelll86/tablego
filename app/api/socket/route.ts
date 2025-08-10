import { NextRequest, NextResponse } from 'next/server';
import { getIO } from '../../lib/socket';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const io = getIO();
    
    // Gestisci le connessioni
    io.on('connection', (socket) => {
      console.log('Cliente connesso:', socket.id);

      // Unisciti alla stanza del ristorante
      socket.on('join-restaurant', (restaurantId: string) => {
        socket.join(`restaurant-${restaurantId}`);
        console.log(`Cliente ${socket.id} unito al ristorante ${restaurantId}`);
      });

      // Gestisci la disconnessione
      socket.on('disconnect', () => {
        console.log('Cliente disconnesso:', socket.id);
      });
    });

    return NextResponse.json({ success: true, message: 'Socket.IO server avviato' });
  } catch (error) {
    console.error('Errore avvio Socket.IO:', error);
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 });
  }
} 