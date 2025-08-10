import { prisma } from './prisma';
import { SeasonalIngredientsAnalyzer } from './seasonalIngredients';

interface MenuItemAnalytics {
  id: string;
  name: string;
  totalOrders: number;
  totalRevenue: number;
  averageRating: number;
  preparationTime: number;
  profitMargin: number;
  seasonalTrend: number;
}

interface OptimizationSuggestion {
  type: 'REMOVE' | 'ADD' | 'MODIFY_PRICE' | 'PROMOTE' | 'COMBINE';
  itemId?: string;
  reason: string;
  impact: 'HIGH' | 'MEDIUM' | 'LOW';
  suggestedAction: string;
  predictedRevenue: number;
}

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
}

export class AIMenuOptimizer {
  private async getWeatherData(): Promise<WeatherData> {
    // In produzione, integreremo con API meteo reali
    return {
      temperature: 22,
      condition: 'sunny',
      humidity: 60
    };
  }

  private async getSeasonalTrends(): Promise<Record<string, number>> {
    const currentMonth = new Date().getMonth();
    const seasonalItems = {
      'soup': currentMonth >= 9 || currentMonth <= 2 ? 1.5 : 0.7,
      'ice_cream': currentMonth >= 5 && currentMonth <= 8 ? 1.8 : 0.5,
      'salad': currentMonth >= 3 && currentMonth <= 9 ? 1.3 : 0.8,
      'hot_drinks': currentMonth >= 10 || currentMonth <= 3 ? 1.4 : 0.6
    };
    return seasonalItems;
  }

  private async analyzeMenuItem(itemId: string, restaurantId: string): Promise<MenuItemAnalytics> {
    const orders = await prisma.order.findMany({
      where: {
        restaurantId,
        items: {
          some: {
            menuItemId: itemId
          }
        },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Ultimi 30 giorni
        }
      },
      include: {
        items: {
          where: { menuItemId: itemId },
          include: { menuItem: true }
        }
      }
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => 
      sum + order.items.reduce((itemSum, item) => itemSum + item.price * item.quantity, 0), 0
    );

    // Calcolo rating medio (simulato)
    const averageRating = 4.2 + Math.random() * 0.6;

    // Calcolo tempo di preparazione (simulato)
    const preparationTime = 15 + Math.random() * 10;

    // Calcolo margine di profitto (simulato)
    const profitMargin = 0.6 + Math.random() * 0.2;

    // Trend stagionale
    const seasonalTrends = await this.getSeasonalTrends();
    const seasonalTrend = seasonalTrends['general'] || 1.0;

    return {
      id: itemId,
      name: orders[0]?.items[0]?.menuItem.name || 'Unknown',
      totalOrders,
      totalRevenue,
      averageRating,
      preparationTime,
      profitMargin,
      seasonalTrend
    };
  }

  async generateOptimizationSuggestions(restaurantId: string): Promise<OptimizationSuggestion[]> {
    const suggestions: OptimizationSuggestion[] = [];
    
    // Analizza tutti i menu items
    const menuItems = await prisma.menuItem.findMany({
      where: {
        category: {
          restaurantId
        }
      }
    });

    const weatherData = await this.getWeatherData();
    const seasonalTrends = await this.getSeasonalTrends();
    
    // Analisi stagionale delle materie prime
    const seasonalAnalyzer = new SeasonalIngredientsAnalyzer();
    const seasonalAnalysis = seasonalAnalyzer.analyzeMenuIngredients(menuItems);

    for (const item of menuItems) {
      const analytics = await this.analyzeMenuItem(item.id, restaurantId);
      
      // Suggestioni basate su performance
      if (analytics.totalOrders < 5 && analytics.totalRevenue < 100) {
        suggestions.push({
          type: 'REMOVE',
          itemId: item.id,
          reason: 'Bassa performance - meno di 5 ordini al mese',
          impact: 'MEDIUM',
          suggestedAction: `Rimuovi "${item.name}" dal menu`,
          predictedRevenue: 0
        });
      }

      // Suggestioni basate su margine di profitto
      if (analytics.profitMargin < 0.5) {
        suggestions.push({
          type: 'MODIFY_PRICE',
          itemId: item.id,
          reason: 'Margine di profitto basso',
          impact: 'HIGH',
          suggestedAction: `Aumenta prezzo di "${item.name}" del 15%`,
          predictedRevenue: analytics.totalRevenue * 1.15
        });
      }

      // Suggestioni basate su meteo
      if (weatherData.temperature > 25 && item.name.toLowerCase().includes('soup')) {
        suggestions.push({
          type: 'PROMOTE',
          itemId: item.id,
          reason: 'Tempo caldo - promuovi piatti freddi',
          impact: 'LOW',
          suggestedAction: `Promuovi "${item.name}" come piatto del giorno`,
          predictedRevenue: analytics.totalRevenue * 1.2
        });
      }

      // Suggestioni stagionali delle materie prime
      const itemSeasonalAnalysis = seasonalAnalyzer.analyzeMenuIngredients([item]);
      if (itemSeasonalAnalysis.costImpact > 30) {
        suggestions.push({
          type: 'MODIFY_PRICE',
          itemId: item.id,
          reason: `Ingredienti fuori stagione - costo +${itemSeasonalAnalysis.costImpact}%`,
          impact: 'HIGH',
          suggestedAction: `Aumenta prezzo di "${item.name}" del ${itemSeasonalAnalysis.costImpact}% per coprire costi stagionali`,
          predictedRevenue: analytics.totalRevenue * (1 + itemSeasonalAnalysis.costImpact / 100)
        });
      }

      // Suggerisci alternative stagionali
      const outOfSeasonIngredients = itemSeasonalAnalysis.seasonalAnalysis
        .filter(a => a.currentStatus === 'out_of_season')
        .slice(0, 2);

      if (outOfSeasonIngredients.length > 0) {
        const alternatives = outOfSeasonIngredients
          .map(a => a.alternatives[0])
          .filter(Boolean)
          .join(', ');

        if (alternatives) {
          suggestions.push({
            type: 'MODIFY_PRICE',
            itemId: item.id,
            reason: 'Ingredienti fuori stagione - considerare alternative',
            impact: 'MEDIUM',
            suggestedAction: `Sostituisci ingredienti in "${item.name}" con: ${alternatives}`,
            predictedRevenue: analytics.totalRevenue * 0.9 // Riduzione per cambio ingredienti
          });
        }
      }
    }

    // Suggerisci nuovi piatti basati su ingredienti di stagione
    const seasonalSuggestions = seasonalAnalyzer.getSeasonalMenuSuggestions();
    if (seasonalSuggestions.length > 0) {
      suggestions.push({
        type: 'ADD',
        reason: 'Ingredienti di stagione disponibili',
        impact: 'HIGH',
        suggestedAction: `Aggiungi piatti con: ${seasonalSuggestions[0].replace('🍃 Ingredienti di stagione: ', '')}`,
        predictedRevenue: 800
      });
    }

    // Suggerisci nuovi piatti basati su trend
    const popularCategories = await this.getPopularCategories(restaurantId);
    if (popularCategories.length > 0) {
      suggestions.push({
        type: 'ADD',
        reason: 'Categoria popolare - opportunità di espansione',
        impact: 'MEDIUM',
        suggestedAction: `Aggiungi nuovo piatto alla categoria "${popularCategories[0]}"`,
        predictedRevenue: 500
      });
    }

    return suggestions.sort((a, b) => {
      const impactOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
      return impactOrder[b.impact] - impactOrder[a.impact];
    });
  }

  private async getPopularCategories(restaurantId: string): Promise<string[]> {
    const categories = await prisma.category.findMany({
      where: { restaurantId },
      include: {
        items: {
          include: {
            orderItems: {
              where: {
                order: {
                  createdAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  }
                }
              }
            }
          }
        }
      }
    });

    return categories
      .map(cat => ({
        name: cat.name,
        totalOrders: cat.items.reduce((sum, item) => 
          sum + item.orderItems.reduce((itemSum, orderItem) => itemSum + orderItem.quantity, 0), 0
        )
      }))
      .sort((a, b) => b.totalOrders - a.totalOrders)
      .slice(0, 3)
      .map(cat => cat.name);
  }

  async predictDemand(restaurantId: string, date: Date): Promise<number> {
    // Predizione domanda basata su:
    // - Giorno della settimana
    // - Eventi locali
    // - Meteo
    // - Storia passata
    
    const dayOfWeek = date.getDay();
    const weatherData = await this.getWeatherData();
    
    // Base demand per giorno
    const baseDemand: { [key: number]: number } = {
      0: 0.7, // Domenica
      1: 0.8, // Lunedì
      2: 0.9, // Martedì
      3: 1.0, // Mercoledì
      4: 1.1, // Giovedì
      5: 1.3, // Venerdì
      6: 1.2  // Sabato
    };

    // Modificatori meteo
    const weatherMultiplier = weatherData.temperature > 25 ? 1.2 : 
                             weatherData.temperature < 10 ? 0.8 : 1.0;

    return Math.round(baseDemand[dayOfWeek] * weatherMultiplier * 100);
  }
} 