import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, restaurant, phone, address, piva, codiceUnivoco } = await req.json();
    if (!name || !email || !password || !restaurant || !phone || !address) {
      return NextResponse.json({ success: false, error: 'Tutti i campi sono obbligatori.' }, { status: 400 });
    }

    // Controllo se l'utente esiste già
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Email già registrata.' }, { status: 400 });
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea utente e ristorante in una transazione
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'RESTAURANT_OWNER',
        restaurants: {
          create: {
            name: restaurant,
            address,
            phone,
            email,
            piva: piva || null,
            codiceUnivoco: codiceUnivoco || null,
            isActive: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Errore registrazione:', error);
    return NextResponse.json({ success: false, error: 'Errore del server.' }, { status: 500 });
  }
} 