// Import dinamico per evitare problemi SSR
let QRCode: any;
if (typeof window !== 'undefined') {
  import('qrcode').then(module => {
    QRCode = module.default;
  });
}

interface MenuTranslation {
  [key: string]: {
    [language: string]: string;
  };
}

interface CurrencyInfo {
  code: string;
  symbol: string;
  rate: number;
}

export class MultiLanguageMenu {
  private translations: MenuTranslation = {
    'menu': {
      'it': 'Menu',
      'en': 'Menu',
      'es': 'Menú',
      'fr': 'Menu',
      'de': 'Speisekarte',
      'zh': '菜单',
      'ja': 'メニュー',
      'ar': 'قائمة الطعام'
    },
    'appetizers': {
      'it': 'Antipasti',
      'en': 'Appetizers',
      'es': 'Entrantes',
      'fr': 'Entrées',
      'de': 'Vorspeisen',
      'zh': '开胃菜',
      'ja': '前菜',
      'ar': 'مقبلات'
    },
    'main_courses': {
      'it': 'Primi Piatti',
      'en': 'Main Courses',
      'es': 'Platos Principales',
      'fr': 'Plats Principaux',
      'de': 'Hauptgerichte',
      'zh': '主菜',
      'ja': 'メインディッシュ',
      'ar': 'الأطباق الرئيسية'
    },
    'desserts': {
      'it': 'Dolci',
      'en': 'Desserts',
      'es': 'Postres',
      'fr': 'Desserts',
      'de': 'Desserts',
      'zh': '甜点',
      'ja': 'デザート',
      'ar': 'حلويات'
    },
    'drinks': {
      'it': 'Bevande',
      'en': 'Drinks',
      'es': 'Bebidas',
      'fr': 'Boissons',
      'de': 'Getränke',
      'zh': '饮料',
      'ja': 'ドリンク',
      'ar': 'مشروبات'
    }
  };

  private currencies: Record<string, CurrencyInfo> = {
    'EUR': { code: 'EUR', symbol: '€', rate: 1.0 },
    'USD': { code: 'USD', symbol: '$', rate: 1.08 },
    'GBP': { code: 'GBP', symbol: '£', rate: 0.86 },
    'JPY': { code: 'JPY', symbol: '¥', rate: 160.0 },
    'CNY': { code: 'CNY', symbol: '¥', rate: 7.8 },
    'AED': { code: 'AED', symbol: 'د.إ', rate: 3.95 }
  };

  private detectLanguage(userAgent: string): string {
    // Rileva lingua dal browser
    const languages = ['it', 'en', 'es', 'fr', 'de', 'zh', 'ja', 'ar'];
    
    for (const lang of languages) {
      if (userAgent.toLowerCase().includes(lang)) {
        return lang;
      }
    }
    
    // Default a italiano
    return 'it';
  }

  private detectCurrency(ip: string): string {
    // In produzione, useremo un servizio di geolocalizzazione
    const countryCurrencyMap: Record<string, string> = {
      'IT': 'EUR',
      'US': 'USD',
      'GB': 'GBP',
      'JP': 'JPY',
      'CN': 'CNY',
      'AE': 'AED'
    };
    
    // Simulazione basata su IP (in produzione useremo API reali)
    if (ip.includes('192.168')) return 'EUR'; // Italia
    if (ip.includes('10.0')) return 'USD'; // USA
    
    return 'EUR'; // Default
  }

  async generateAdaptiveQRCode(tableId: string, userAgent: string, ip: string): Promise<string> {
    const language = this.detectLanguage(userAgent);
    const currency = this.detectCurrency(ip);
    
    // Crea URL con parametri di lingua e valuta
    const qrUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/qr/${tableId}?lang=${language}&currency=${currency}`;
    
    try {
      // Import dinamico per evitare problemi SSR
      const QRCodeModule = await import('qrcode');
      const qrCodeDataUrl = await QRCodeModule.default.toDataURL(qrUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      return qrCodeDataUrl;
    } catch (error) {
      console.error('Errore generazione QR code:', error);
      throw new Error('Impossibile generare QR code');
    }
  }

  translateMenu(menuData: any, language: string): any {
    const translatedMenu = { ...menuData };
    
    // Traduci categorie
    if (translatedMenu.categories) {
      translatedMenu.categories = translatedMenu.categories.map((category: any) => ({
        ...category,
        name: this.translations[category.name.toLowerCase()]?.[language] || category.name,
        description: this.translateText(category.description, language)
      }));
    }
    
    // Traduci items
    if (translatedMenu.items) {
      translatedMenu.items = translatedMenu.items.map((item: any) => ({
        ...item,
        name: this.translateText(item.name, language),
        description: this.translateText(item.description, language)
      }));
    }
    
    return translatedMenu;
  }

  private translateText(text: string, language: string): string {
    // In produzione, useremo un servizio di traduzione come Google Translate
    // Per ora, simuliamo traduzioni comuni
    
    const commonTranslations: Record<string, Record<string, string>> = {
      'pizza': {
        'en': 'Pizza',
        'es': 'Pizza',
        'fr': 'Pizza',
        'de': 'Pizza',
        'zh': '披萨',
        'ja': 'ピザ',
        'ar': 'بيتزا'
      },
      'pasta': {
        'en': 'Pasta',
        'es': 'Pasta',
        'fr': 'Pâtes',
        'de': 'Pasta',
        'zh': '意大利面',
        'ja': 'パスタ',
        'ar': 'معكرونة'
      },
      'salad': {
        'en': 'Salad',
        'es': 'Ensalada',
        'fr': 'Salade',
        'de': 'Salat',
        'zh': '沙拉',
        'ja': 'サラダ',
        'ar': 'سلطة'
      }
    };
    
    const lowerText = text.toLowerCase();
    for (const [key, translations] of Object.entries(commonTranslations)) {
      if (lowerText.includes(key)) {
        return translations[language] || text;
      }
    }
    
    return text; // Ritorna originale se non trova traduzione
  }

  convertCurrency(price: number, fromCurrency: string, toCurrency: string): number {
    const fromRate = this.currencies[fromCurrency]?.rate || 1.0;
    const toRate = this.currencies[toCurrency]?.rate || 1.0;
    
    return Math.round((price / fromRate) * toRate * 100) / 100;
  }

  formatPrice(price: number, currency: string): string {
    const currencyInfo = this.currencies[currency];
    if (!currencyInfo) return `${price}€`;
    
    return `${currencyInfo.symbol}${price.toFixed(2)}`;
  }

  async getLocalizedMenu(tableId: string, userAgent: string, ip: string): Promise<any> {
    const language = this.detectLanguage(userAgent);
    const currency = this.detectCurrency(ip);
    
    // Recupera menu dal database
    const menu = await this.getMenuFromDatabase(tableId);
    
    // Traduci menu
    const translatedMenu = this.translateMenu(menu, language);
    
    // Converti prezzi
    translatedMenu.items = translatedMenu.items.map((item: any) => ({
      ...item,
      price: this.convertCurrency(item.price, 'EUR', currency),
      formattedPrice: this.formatPrice(
        this.convertCurrency(item.price, 'EUR', currency), 
        currency
      )
    }));
    
    return {
      ...translatedMenu,
      language,
      currency,
      qrCode: await this.generateAdaptiveQRCode(tableId, userAgent, ip)
    };
  }

  private async getMenuFromDatabase(tableId: string): Promise<any> {
    // In produzione, questo verrà dal database
    return {
      categories: [
        { id: '1', name: 'appetizers', description: 'Antipasti della casa' },
        { id: '2', name: 'main_courses', description: 'Piatti principali' },
        { id: '3', name: 'desserts', description: 'Dolci fatti in casa' }
      ],
      items: [
        { id: '1', name: 'Bruschetta', description: 'Pane tostato con pomodoro', price: 8.50, categoryId: '1' },
        { id: '2', name: 'Pizza Margherita', description: 'Pizza con pomodoro e mozzarella', price: 12.00, categoryId: '2' },
        { id: '3', name: 'Tiramisù', description: 'Dolce tradizionale italiano', price: 6.50, categoryId: '3' }
      ]
    };
  }
} 