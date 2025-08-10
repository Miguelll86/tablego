const { PrismaClient } = require('./app/generated/prisma');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function initTestData() {
  try {
    console.log('🚀 Inizializzazione dati di test per Tablo...\n');

    // 1. Crea un utente di test
    console.log('1. Creazione utente di test...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const user = await prisma.user.upsert({
      where: { email: 'test@restaurant.com' },
      update: {},
      create: {
        email: 'test@restaurant.com',
        password: hashedPassword,
        name: 'Ristorante Test',
        role: 'RESTAURANT_OWNER'
      }
    });
    console.log('✅ Utente creato:', user.email);

    // 2. Crea un ristorante di test
    console.log('\n2. Creazione ristorante di test...');
    const restaurant = await prisma.restaurant.upsert({
      where: { id: 'rest-test-1' },
      update: {},
      create: {
        id: 'rest-test-1',
        name: 'Ristorante Test',
        description: 'Un ristorante di test per Tablo',
        address: 'Via Roma 123, Milano',
        phone: '+39 123 456 789',
        email: 'info@ristorantetest.com',
        userId: user.id
      }
    });
    console.log('✅ Ristorante creato:', restaurant.name);

    // 3. Crea alcune categorie
    console.log('\n3. Creazione categorie...');
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { id: 'cat-1' },
        update: {},
        create: {
          id: 'cat-1',
          name: 'Antipasti',
          description: 'Antipasti della casa',
          displayOrder: 1,
          restaurantId: restaurant.id
        }
      }),
      prisma.category.upsert({
        where: { id: 'cat-2' },
        update: {},
        create: {
          id: 'cat-2',
          name: 'Primi Piatti',
          description: 'Pasta e risotti',
          displayOrder: 2,
          restaurantId: restaurant.id
        }
      }),
      prisma.category.upsert({
        where: { id: 'cat-3' },
        update: {},
        create: {
          id: 'cat-3',
          name: 'Secondi Piatti',
          description: 'Carne e pesce',
          displayOrder: 3,
          restaurantId: restaurant.id
        }
      })
    ]);
    console.log('✅ Categorie create:', categories.length);

    // 4. Crea alcuni menu items
    console.log('\n4. Creazione menu items...');
    const menuItems = await Promise.all([
      prisma.menuItem.upsert({
        where: { id: 'item-1' },
        update: {},
        create: {
          id: 'item-1',
          name: 'Bruschetta',
          description: 'Pane tostato con pomodoro e basilico',
          price: 8.50,
          categoryId: categories[0].id
        }
      }),
      prisma.menuItem.upsert({
        where: { id: 'item-2' },
        update: {},
        create: {
          id: 'item-2',
          name: 'Spaghetti alla Carbonara',
          description: 'Pasta con uova, guanciale e pecorino',
          price: 12.00,
          categoryId: categories[1].id
        }
      }),
      prisma.menuItem.upsert({
        where: { id: 'item-3' },
        update: {},
        create: {
          id: 'item-3',
          name: 'Bistecca alla Fiorentina',
          description: 'Bistecca di manzo alla griglia',
          price: 25.00,
          categoryId: categories[2].id
        }
      })
    ]);
    console.log('✅ Menu items creati:', menuItems.length);

    // 5. Crea alcuni tavoli
    console.log('\n5. Creazione tavoli...');
    const tables = await Promise.all([
      prisma.table.upsert({
        where: { id: 'table-1' },
        update: {},
        create: {
          id: 'table-1',
          number: 1,
          capacity: 4,
          position: 'Interno',
          type: 'TABLE',
          restaurantId: restaurant.id,
          x: 20,
          y: 30
        }
      }),
      prisma.table.upsert({
        where: { id: 'table-2' },
        update: {},
        create: {
          id: 'table-2',
          number: 2,
          capacity: 6,
          position: 'Terrazza',
          type: 'TABLE',
          restaurantId: restaurant.id,
          x: 60,
          y: 40
        }
      }),
      prisma.table.upsert({
        where: { id: 'umbrella-1' },
        update: {},
        create: {
          id: 'umbrella-1',
          number: 1,
          capacity: 4,
          position: 'Spiaggia',
          type: 'UMBRELLA',
          restaurantId: restaurant.id,
          x: 80,
          y: 70
        }
      })
    ]);
    console.log('✅ Tavoli creati:', tables.length);

    console.log('\n🎉 Dati di test inizializzati con successo per Tablo!');
    console.log('\n📋 Credenziali di accesso:');
    console.log('Email: test@restaurant.com');
    console.log('Password: password123');
    console.log('\n🌐 Vai su http://localhost:3000/login per accedere');

  } catch (error) {
    console.error('❌ Errore durante l\'inizializzazione:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initTestData(); 