import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function getIO() {
  if (!io) {
    const httpServer: NetServer = new NetServer();
    io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });
  }
  return io;
}

// Funzione per inviare notifiche ai clienti
export function notifyNewOrder(restaurantId: string, order: any) {
  const io = getIO();
  io.to(`restaurant-${restaurantId}`).emit('new-order', {
    type: 'NEW_ORDER',
    order: {
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount,
      tableNumber: order.table?.number,
      customerName: order.customerName,
      items: order.items
    }
  });
}

// Funzione per aggiornare lo stato dell'ordine
export function notifyOrderUpdate(restaurantId: string, orderId: string, status: string) {
  const io = getIO();
  io.to(`restaurant-${restaurantId}`).emit('order-update', {
    type: 'ORDER_UPDATE',
    orderId,
    status
  });
} 