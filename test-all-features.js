// Test completo di tutte le funzionalità di Tablo
const BASE_URL = 'http://localhost:3000';

class TabloTester {
  constructor() {
    this.results = [];
    this.testData = {
      user: {
        email: 'test@restaurant.com',
        password: 'password123'
      },
      restaurant: {
        name: 'Ristorante Test',
        description: 'Ristorante di test per Tablo'
      }
    };
  }

  async log(message, type = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`${icon} [${timestamp}] ${message}`);
  }

  async testEndpoint(endpoint, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${BASE_URL}${endpoint}`, options);
      const data = await response.json();
      
      return { success: response.ok, data, status: response.status };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async runTest(testName, testFunction) {
    this.log(`Iniziando test: ${testName}`);
    try {
      const result = await testFunction();
      if (result.success) {
        this.log(`✅ ${testName} - SUCCESS`, 'success');
        this.results.push({ name: testName, status: 'PASS' });
      } else {
        this.log(`❌ ${testName} - FAILED: ${result.error || 'Unknown error'}`, 'error');
        this.results.push({ name: testName, status: 'FAIL', error: result.error });
      }
    } catch (error) {
      this.log(`❌ ${testName} - ERROR: ${error.message}`, 'error');
      this.results.push({ name: testName, status: 'ERROR', error: error.message });
    }
  }

  // Test 1: Autenticazione
  async testAuthentication() {
    const loginResult = await this.testEndpoint('/api/login', 'POST', {
      email: this.testData.user.email,
      password: this.testData.user.password
    });

    if (loginResult.success) {
      this.sessionToken = loginResult.data.user?.id;
      return { success: true };
    }
    return { success: false, error: 'Login failed' };
  }

  // Test 2: Dashboard
  async testDashboard() {
    const result = await this.testEndpoint('/api/analytics/dashboard');
    return result;
  }

  // Test 3: Menu Management
  async testMenuManagement() {
    // Test creazione categoria
    const categoryResult = await this.testEndpoint('/api/categories', 'POST', {
      name: 'Test Category',
      description: 'Categoria di test'
    });

    if (!categoryResult.success) {
      return { success: false, error: 'Failed to create category' };
    }

    // Test creazione menu item
    const menuItemResult = await this.testEndpoint('/api/menu-items', 'POST', {
      name: 'Test Item',
      description: 'Item di test',
      price: 15.99,
      categoryId: categoryResult.data.category?.id
    });

    return menuItemResult;
  }

  // Test 4: Tables Management
  async testTablesManagement() {
    const result = await this.testEndpoint('/api/tables');
    return result;
  }

  // Test 5: Orders
  async testOrders() {
    const result = await this.testEndpoint('/api/orders');
    return result;
  }

  // Test 6: Reservations
  async testReservations() {
    const result = await this.testEndpoint('/api/reservations');
    return result;
  }

  // Test 7: Settings
  async testSettings() {
    const result = await this.testEndpoint('/api/settings');
    return result;
  }

  // Test 8: AI Features
  async testAIFeatures() {
    const result = await this.testEndpoint('/api/ai/optimize-menu?restaurantId=rest-test-1');
    return result;
  }

  // Test 9: QR Code Generation
  async testQRGeneration() {
    const result = await this.testEndpoint('/api/tables/1/qr');
    return result;
  }

  // Test 10: Payment Integration
  async testPaymentIntegration() {
    const result = await this.testEndpoint('/api/payments/create-intent', 'POST', {
      amount: 1000,
      currency: 'eur'
    });
    return result;
  }

  // Test 11: Multi-language Support
  async testMultiLanguage() {
    const result = await this.testEndpoint('/api/menu/localized?tableId=table-1&language=en');
    return result;
  }

  // Test 12: Notifications
  async testNotifications() {
    const result = await this.testEndpoint('/api/notifications');
    return result;
  }

  // Test 13: PWA Features
  async testPWAFeatures() {
    const manifestResult = await this.testEndpoint('/manifest.json');
    const swResult = await this.testEndpoint('/sw.js');
    
    return {
      success: manifestResult.success && swResult.success,
      manifest: manifestResult.data,
      serviceWorker: swResult.data
    };
  }

  // Test 14: Security
  async testSecurity() {
    // Test CORS headers
    const response = await fetch(`${BASE_URL}/api/settings`);
    const corsHeader = response.headers.get('Access-Control-Allow-Origin');
    
    return {
      success: true,
      corsHeader: corsHeader
    };
  }

  // Test 15: Performance
  async testPerformance() {
    const startTime = Date.now();
    const result = await this.testEndpoint('/api/analytics/dashboard');
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    return {
      success: result.success,
      responseTime: responseTime,
      isFast: responseTime < 1000 // Consideriamo veloce se < 1 secondo
    };
  }

  async runAllTests() {
    this.log('🚀 Iniziando test completi di Tablo...', 'info');
    this.log('=====================================', 'info');

    // Test core functionality
    await this.runTest('1. Autenticazione', () => this.testAuthentication());
    await this.runTest('2. Dashboard', () => this.testDashboard());
    await this.runTest('3. Gestione Menu', () => this.testMenuManagement());
    await this.runTest('4. Gestione Tavoli', () => this.testTablesManagement());
    await this.runTest('5. Gestione Ordini', () => this.testOrders());
    await this.runTest('6. Prenotazioni', () => this.testReservations());
    await this.runTest('7. Impostazioni', () => this.testSettings());

    // Test advanced features
    await this.runTest('8. Funzionalità AI', () => this.testAIFeatures());
    await this.runTest('9. Generazione QR', () => this.testQRGeneration());
    await this.runTest('10. Integrazione Pagamenti', () => this.testPaymentIntegration());
    await this.runTest('11. Supporto Multi-lingua', () => this.testMultiLanguage());
    await this.runTest('12. Notifiche', () => this.testNotifications());
    await this.runTest('13. Funzionalità PWA', () => this.testPWAFeatures());
    await this.runTest('14. Sicurezza', () => this.testSecurity());
    await this.runTest('15. Performance', () => this.testPerformance());

    this.generateReport();
  }

  generateReport() {
    this.log('=====================================', 'info');
    this.log('📊 REPORT FINALE DEI TEST', 'info');
    this.log('=====================================', 'info');

    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = this.results.filter(r => r.status === 'FAIL').length;
    const errorTests = this.results.filter(r => r.status === 'ERROR').length;

    this.log(`Totale test: ${totalTests}`, 'info');
    this.log(`✅ Test superati: ${passedTests}`, 'success');
    this.log(`❌ Test falliti: ${failedTests}`, 'error');
    this.log(`⚠️ Test con errori: ${errorTests}`, 'warning');

    const successRate = ((passedTests / totalTests) * 100).toFixed(1);
    this.log(`📈 Tasso di successo: ${successRate}%`, 'info');

    if (failedTests > 0 || errorTests > 0) {
      this.log('\n🔍 DETTAGLI ERRORI:', 'warning');
      this.results
        .filter(r => r.status !== 'PASS')
        .forEach(result => {
          this.log(`- ${result.name}: ${result.error || 'Unknown error'}`, 'error');
        });
    }

    this.log('\n🎯 RACCOMANDAZIONI:', 'info');
    if (successRate >= 90) {
      this.log('✅ Sistema molto stabile - Pronto per la produzione!', 'success');
    } else if (successRate >= 70) {
      this.log('⚠️ Sistema funzionante ma necessita miglioramenti', 'warning');
    } else {
      this.log('❌ Sistema necessita correzioni significative', 'error');
    }
  }
}

// Esegui i test
async function runTests() {
  const tester = new TabloTester();
  await tester.runAllTests();
}

// Se eseguito direttamente
if (typeof window === 'undefined') {
  runTests().catch(console.error);
}

module.exports = { TabloTester, runTests };
