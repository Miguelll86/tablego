import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

function isAdmin(req: NextRequest) {
  const role = req.cookies.get('user_role')?.value;
  return role === 'ADMIN';
}

export async function GET(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') || '';

    const users = await prisma.user.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q, mode: 'insensitive' } },
              { email: { contains: q, mode: 'insensitive' } },
            ],
          }
        : undefined,
      include: {
        restaurants: {
          select: { id: true, name: true, isActive: true, createdAt: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Admin GET /users error:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!isAdmin(req)) return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });

    const { restaurantId, isActive } = await req.json();
    if (!restaurantId || typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Parametri non validi' }, { status: 400 });
    }

    const updated = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: { isActive }
    });

    return NextResponse.json({ success: true, restaurant: updated });
  } catch (error) {
    console.error('Admin PATCH /users error:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}


