import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email e password sono obbligatori.' }, { status: 400 });
    }

    // Trova l'utente
    const user = await prisma.user.findUnique({
      where: { email },
      include: { restaurants: true },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Credenziali non valide.' }, { status: 401 });
    }

    // Verifica password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ success: false, error: 'Credenziali non valide.' }, { status: 401 });
    }

    // Crea la risposta con successo
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email,
        role: user.role,
        restaurant: user.restaurants[0] 
      } 
    });

    // Imposta i cookie di sessione
    const sessionData = {
      userId: user.id,
      email: user.email,
      name: user.name,
      restaurantId: user.restaurants[0]?.id
    };

    response.cookies.set('session_token', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 giorni
    });

    // Aggiungi anche il cookie user_id per l'API /api/auth/me
    response.cookies.set('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 giorni
    });

    // Cookie ruolo per accesso admin
    response.cookies.set('user_role', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error: any) {
    console.error('Errore login:', error);
    return NextResponse.json({ success: false, error: 'Errore del server.' }, { status: 500 });
  }
} 