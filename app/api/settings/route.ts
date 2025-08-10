import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');
    
    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID richiesto' }, { status: 400 });
    }
    
    const restaurant = await prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        email: true,
        logo: true,
        isActive: true,
        stripePublishableKey: true,
        stripeSecretKey: true,
        stripeWebhookSecret: true
      }
    });
    
    if (!restaurant) {
      return NextResponse.json({ success: false, error: 'Ristorante non trovato' }, { status: 404 });
    }
    
    // Formatta i dati per il frontend
    const formattedData = {
      ...restaurant,
      stripeConfig: {
        publishableKey: restaurant.stripePublishableKey || '',
        secretKey: restaurant.stripeSecretKey || '',
        webhookSecret: restaurant.stripeWebhookSecret || '',
        isConfigured: !!(restaurant.stripePublishableKey && restaurant.stripeSecretKey)
      }
    };
    
    return NextResponse.json({ success: true, ...formattedData });
  } catch (error) {
    console.error('Errore nel recupero impostazioni:', error);
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get('restaurantId');
    
    if (!restaurantId) {
      return NextResponse.json({ success: false, error: 'Restaurant ID richiesto' }, { status: 400 });
    }
    
    const data = await req.json();
    const { name, address, phone, email, description, logo, stripePublishableKey, stripeSecretKey, stripeWebhookSecret } = data;
    
    const updatedRestaurant = await prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: name || undefined,
        description: description || undefined,
        address: address || undefined,
        phone: phone || undefined,
        email: email || undefined,
        logo: logo || undefined,
        stripePublishableKey: stripePublishableKey || undefined,
        stripeSecretKey: stripeSecretKey || undefined,
        stripeWebhookSecret: stripeWebhookSecret || undefined
      },
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        phone: true,
        email: true,
        logo: true,
        isActive: true,
        stripePublishableKey: true,
        stripeSecretKey: true,
        stripeWebhookSecret: true
      }
    });
    
    // Formatta i dati per il frontend
    const formattedData = {
      ...updatedRestaurant,
      stripeConfig: {
        publishableKey: updatedRestaurant.stripePublishableKey || '',
        secretKey: updatedRestaurant.stripeSecretKey || '',
        webhookSecret: updatedRestaurant.stripeWebhookSecret || '',
        isConfigured: !!(updatedRestaurant.stripePublishableKey && updatedRestaurant.stripeSecretKey)
      }
    };
    
    return NextResponse.json({ success: true, ...formattedData });
  } catch (error) {
    console.error('Errore nell\'aggiornamento impostazioni:', error);
    return NextResponse.json({ success: false, error: 'Errore del server' }, { status: 500 });
  }
} 