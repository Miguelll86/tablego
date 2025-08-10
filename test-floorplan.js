// Script di test per la funzionalità della piantina

async function testFloorplan() {
  console.log('🧪 Test della funzionalità piantina...\n');

  try {
    // Test 1: Verifica che l'API dei tavoli risponda
    console.log('1. Test API tavoli...');
    const tablesResponse = await fetch('http://localhost:3000/api/tables');
    const tablesData = await tablesResponse.json();
    
    if (tablesResponse.ok) {
      console.log('✅ API tavoli funziona');
      if (tablesData.success && tablesData.tables) {
        console.log(`   - Trovati ${tablesData.tables.length} tavoli`);
        
        // Test 2: Verifica che i tavoli abbiano le proprietà della piantina
        const tableWithPosition = tablesData.tables.find(t => t.x !== null || t.y !== null);
        if (tableWithPosition) {
          console.log('✅ Tavoli con posizione trovati');
          console.log(`   - Tavolo ${tableWithPosition.number}: x=${tableWithPosition.x}, y=${tableWithPosition.y}`);
        } else {
          console.log('⚠️  Nessun tavolo con posizione configurata');
        }
      }
    } else {
      console.log('❌ API tavoli non funziona:', tablesData.error);
    }

    // Test 3: Verifica che la pagina tavoli sia accessibile
    console.log('\n2. Test pagina tavoli...');
    const pageResponse = await fetch('http://localhost:3000/tables');
    if (pageResponse.ok) {
      console.log('✅ Pagina tavoli accessibile');
    } else {
      console.log('❌ Pagina tavoli non accessibile:', pageResponse.status);
    }

    // Test 4: Verifica che non ci siano errori di build
    console.log('\n3. Test build...');
    const buildResponse = await fetch('http://localhost:3000');
    if (buildResponse.ok) {
      console.log('✅ Build funziona correttamente');
    } else {
      console.log('❌ Errore nella build:', buildResponse.status);
    }

    console.log('\n🎉 Test completati!');
    console.log('\n📋 Prossimi passi:');
    console.log('1. Apri http://localhost:3000/tables nel browser');
    console.log('2. Clicca su "Piantina" per vedere la vista piantina');
    console.log('3. Prova a trascinare i tavoli per riposizionarli');
    console.log('4. Verifica che i cambiamenti vengano salvati');

  } catch (error) {
    console.error('❌ Errore durante il test:', error.message);
  }
}

testFloorplan(); 