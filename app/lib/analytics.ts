export interface AnalyticsData {
  orders: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byStatus: Record<string, number>;
    byHour: Record<number, number>;
    byDay: Record<string, number>;
  };
  revenue: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    average: number;
    byHour: Record<number, number>;
    byDay: Record<string, number>;
  };
  menu: {
    totalItems: number;
    popularItems: Array<{
      id: string;
      name: string;
      orders: number;
      revenue: number;
    }>;
    categories: Record<string, number>;
  };
  tables: {
    total: number;
    active: number;
    averageOccupancy: number;
    averageTime: number;
  };
  performance: {
    averageOrderTime: number;
    averagePreparationTime: number;
    customerSatisfaction: number;
  };
}

export class Analytics {
  private static instance: Analytics;
  private data: AnalyticsData = Analytics.prototype.getDefaultAnalytics();

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  async getAnalytics(restaurantId: string, period: 'today' | 'week' | 'month' = 'today'): Promise<AnalyticsData> {
    try {
      const response = await fetch(`/api/analytics/dashboard?restaurantId=${restaurantId}&period=${period}`);
      const data = await response.json();
      
      if (data.success) {
        this.data = data.analytics;
        return this.data;
      } else {
        throw new Error(data.error || 'Errore nel caricamento analytics');
      }
    } catch (error) {
      console.error('Errore analytics:', error);
      return this.getDefaultAnalytics();
    }
  }

  private getDefaultAnalytics(): AnalyticsData {
    return {
      orders: {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        byStatus: {},
        byHour: {},
        byDay: {},
      },
      revenue: {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        average: 0,
        byHour: {},
        byDay: {},
      },
      menu: {
        totalItems: 0,
        popularItems: [],
        categories: {},
      },
      tables: {
        total: 0,
        active: 0,
        averageOccupancy: 0,
        averageTime: 0,
      },
      performance: {
        averageOrderTime: 0,
        averagePreparationTime: 0,
        customerSatisfaction: 0,
      },
    };
  }

  // Metodi per calcoli specifici
  calculateGrowth(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  }

  formatNumber(num: number): string {
    return new Intl.NumberFormat('it-IT').format(num);
  }

  getTopItems(items: Array<{ id: string; name: string; orders: number; revenue: number }>, limit: number = 5) {
    return items
      .sort((a, b) => b.orders - a.orders)
      .slice(0, limit);
  }

  getRevenueByCategory(orders: any[], menuItems: any[]) {
    const categoryRevenue: Record<string, number> = {};
    
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const menuItem = menuItems.find(mi => mi.id === item.menuItemId);
        if (menuItem) {
          const category = menuItem.category;
          categoryRevenue[category] = (categoryRevenue[category] || 0) + (item.price * item.quantity);
        }
      });
    });
    
    return categoryRevenue;
  }

  calculateAverageOrderValue(orders: any[]): number {
    if (orders.length === 0) return 0;
    const total = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    return total / orders.length;
  }

  calculateOrderDistribution(orders: any[]): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    orders.forEach(order => {
      const status = order.status;
      distribution[status] = (distribution[status] || 0) + 1;
    });
    
    return distribution;
  }

  calculateHourlyDistribution(orders: any[]): Record<number, number> {
    const hourly: Record<number, number> = {};
    
    orders.forEach(order => {
      const hour = new Date(order.createdAt).getHours();
      hourly[hour] = (hourly[hour] || 0) + 1;
    });
    
    return hourly;
  }

  calculateDailyDistribution(orders: any[]): Record<string, number> {
    const daily: Record<string, number> = {};
    
    orders.forEach(order => {
      const day = new Date(order.createdAt).toLocaleDateString('it-IT', { weekday: 'long' });
      daily[day] = (daily[day] || 0) + 1;
    });
    
    return daily;
  }
} 