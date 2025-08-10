import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { handleApiError } from '../../../lib/errorHandler';

export async function POST(request: NextRequest) {
  try {
    const { 
      restaurantName, 
      ownerName, 
      email, 
      phone,
      address 
    } = await request.json();

    // Validazione campi obbligatori
    if (!restaurantName || !ownerName || !email) {
      return NextResponse.json({ 
        error: 'Nome ristorante, nome proprietario e email sono obbligatori' 
      }, { status: 400 });
    }

    // Verifica se l'email ha già una demo attiva
    const existingDemo = await prisma.restaurant.findFirst({
      where: {
        user: {
          email: email
        },
        demoExpiry: {
          gt: new Date()
        }
      }
    });

    if (existingDemo) {
      return NextResponse.json({ 
        error: 'Hai già una demo attiva con questa email' 
      }, { status: 400 });
    }

    // Calcola data di scadenza demo (7 giorni)
    const demoExpiry = new Date();
    demoExpiry.setDate(demoExpiry.getDate() + 7);

    // Crea utente demo
    const demoUser = await prisma.user.create({
      data: {
        name: ownerName,
        email: email,
        password: 'demo-password-' + Math.random().toString(36).substr(2, 9),
        role: 'RESTAURANT_OWNER',
        demoAccount: true
      }
    });

    // Crea ristorante demo
    const demoRestaurant = await prisma.restaurant.create({
      data: {
        name: restaurantName,
        description: `Demo di ${restaurantName} - Test gratuito Tablo`,
        address: address || 'Indirizzo demo',
        phone: phone || '+39 000 000 000',
        email: email,
        demoExpiry: demoExpiry,
        demoAccount: true,
        userId: demoUser.id
      }
    });

    // Crea dati di esempio per la demo
    await createDemoData(demoRestaurant.id);

    return NextResponse.json({
      success: true,
      demo: {
        restaurantId: demoRestaurant.id,
        userId: demoUser.id,
        expiryDate: demoExpiry,
        message: 'Demo creata con successo! Hai 7 giorni per testare tutte le funzionalità.'
      }
    });
  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

async function createDemoData(restaurantId: string) {
  // Crea categorie demo
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Antipasti',
        description: 'Antipasti della casa',
        restaurantId
      }
    }),
    prisma.category.create({
      data: {
        name: 'Primi Piatti',
        description: 'Pasta e risotti',
        restaurantId
      }
    }),
    prisma.category.create({
      data: {
        name: 'Secondi Piatti',
        description: 'Carni e pesci',
        restaurantId
      }
    }),
    prisma.category.create({
      data: {
        name: 'Dolci',
        description: 'Dessert artigianali',
        restaurantId
      }
    }),
    prisma.category.create({
      data: {
        name: 'Bevande',
        description: 'Vini e bevande',
        restaurantId
      }
    })
  ]);

  // Crea menu items demo
  await Promise.all([
    prisma.menuItem.create({
      data: {
        name: 'Bruschetta al Pomodoro',
        description: 'Pane tostato con pomodoro, basilico e olio d\'oliva',
        price: 8.50,
        categoryId: categories[0].id,
        isAvailable: true
      }
    }),
    prisma.menuItem.create({
      data: {
        name: 'Spaghetti alla Carbonara',
        description: 'Pasta con uova, guanciale e pecorino romano',
        price: 14.00,
        categoryId: categories[1].id,
        isAvailable: true
      }
    }),
    prisma.menuItem.create({
      data: {
        name: 'Pizza Margherita',
        description: 'Pizza con pomodoro, mozzarella e basilico',
        price: 12.00,
        categoryId: categories[1].id,
        isAvailable: true
      }
    }),
    prisma.menuItem.create({
      data: {
        name: 'Bistecca alla Fiorentina',
        description: 'T-bone steak alla griglia con rosmarino',
        price: 28.00,
        categoryId: categories[2].id,
        isAvailable: true
      }
    }),
    prisma.menuItem.create({
      data: {
        name: 'Tiramisù',
        description: 'Dolce tradizionale con mascarpone e caffè',
        price: 8.00,
        categoryId: categories[3].id,
        isAvailable: true
      }
    }),
    prisma.menuItem.create({
      data: {
        name: 'Vino della Casa',
        description: 'Calice di vino rosso della casa',
        price: 6.00,
        categoryId: categories[4].id,
        isAvailable: true
      }
    })
  ]);

  // Crea tavoli demo
  await Promise.all([
    prisma.table.create({
      data: {
        number: 1,
        capacity: 4,
        position: 'Interno',
        status: 'AVAILABLE',
        restaurantId
      }
    }),
    prisma.table.create({
      data: {
        number: 2,
        capacity: 6,
        position: 'Finestra',
        status: 'AVAILABLE',
        restaurantId
      }
    }),
    prisma.table.create({
      data: {
        number: 3,
        capacity: 2,
        position: 'Terrazza',
        status: 'AVAILABLE',
        restaurantId
      }
    }),
    prisma.table.create({
      data: {
        number: 4,
        capacity: 8,
        position: 'Interno',
        status: 'AVAILABLE',
        restaurantId
      }
    })
  ]);
} 