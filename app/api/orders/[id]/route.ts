import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function PUT(
  req: NextRequest,
  { params }: any
) {
  try {
    const { status } = await req.json();
    const orderId = params.id;

    if (!status) {
      return NextResponse.json({ error: 'Status richiesto' }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        table: true
      }
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Errore nell\'aggiornamento ordine:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  try {
    const orderId = params.id;

    // Elimina prima gli elementi dell'ordine
    await prisma.orderItem.deleteMany({
      where: { orderId }
    });

    // Poi elimina l'ordine
    await prisma.order.delete({
      where: { id: orderId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Errore nell\'eliminazione ordine:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
} 