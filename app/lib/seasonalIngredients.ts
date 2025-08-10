interface Ingredient {
  name: string;
  category: 'vegetable' | 'fruit' | 'meat' | 'fish' | 'dairy' | 'herb' | 'grain';
  peakSeason: {
    start: number; // Mese di inizio (1-12)
    end: number;   // Mese di fine (1-12)
  };
  availability: 'year_round' | 'seasonal' | 'limited';
  costMultiplier: number; // Moltiplicatore di costo fuori stagione
  quality: 'excellent' | 'good' | 'fair' | 'poor'; // Qualità fuori stagione
}

interface SeasonalAnalysis {
  ingredient: string;
  currentStatus: 'in_season' | 'out_of_season' | 'transitioning';
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  costImpact: number; // Variazione percentuale del costo
  recommendation: string;
  alternatives: string[];
}

export class SeasonalIngredientsAnalyzer {
  private ingredients: Record<string, Ingredient> = {
    // Verdure
    'pomodoro': {
      name: 'Pomodoro',
      category: 'vegetable',
      peakSeason: { start: 6, end: 9 },
      availability: 'seasonal',
      costMultiplier: 2.5,
      quality: 'poor'
    },
    'zucchina': {
      name: 'Zucchina',
      category: 'vegetable',
      peakSeason: { start: 5, end: 9 },
      availability: 'seasonal',
      costMultiplier: 2.0,
      quality: 'fair'
    },
    'melanzana': {
      name: 'Melanzana',
      category: 'vegetable',
      peakSeason: { start: 7, end: 10 },
      availability: 'seasonal',
      costMultiplier: 2.2,
      quality: 'poor'
    },
    'carciofo': {
      name: 'Carciofo',
      category: 'vegetable',
      peakSeason: { start: 3, end: 5 },
      availability: 'seasonal',
      costMultiplier: 3.0,
      quality: 'poor'
    },
    'asparago': {
      name: 'Asparago',
      category: 'vegetable',
      peakSeason: { start: 3, end: 6 },
      availability: 'seasonal',
      costMultiplier: 4.0,
      quality: 'poor'
    },
    'spinaci': {
      name: 'Spinaci',
      category: 'vegetable',
      peakSeason: { start: 3, end: 6 },
      availability: 'seasonal',
      costMultiplier: 1.8,
      quality: 'fair'
    },

    // Frutta
    'fragola': {
      name: 'Fragola',
      category: 'fruit',
      peakSeason: { start: 4, end: 7 },
      availability: 'seasonal',
      costMultiplier: 3.0,
      quality: 'poor'
    },
    'pesca': {
      name: 'Pesca',
      category: 'fruit',
      peakSeason: { start: 6, end: 9 },
      availability: 'seasonal',
      costMultiplier: 2.5,
      quality: 'poor'
    },
    'albicocca': {
      name: 'Albicocca',
      category: 'fruit',
      peakSeason: { start: 6, end: 8 },
      availability: 'seasonal',
      costMultiplier: 3.5,
      quality: 'poor'
    },
    'arancia': {
      name: 'Arancia',
      category: 'fruit',
      peakSeason: { start: 12, end: 3 },
      availability: 'seasonal',
      costMultiplier: 1.5,
      quality: 'good'
    },

    // Pesce
    'tonno': {
      name: 'Tonno',
      category: 'fish',
      peakSeason: { start: 6, end: 9 },
      availability: 'seasonal',
      costMultiplier: 1.8,
      quality: 'good'
    },
    'branzino': {
      name: 'Branzino',
      category: 'fish',
      peakSeason: { start: 9, end: 12 },
      availability: 'seasonal',
      costMultiplier: 2.0,
      quality: 'fair'
    },
    'salmone': {
      name: 'Salmone',
      category: 'fish',
      peakSeason: { start: 9, end: 11 },
      availability: 'seasonal',
      costMultiplier: 1.6,
      quality: 'good'
    },

    // Carne
    'agnello': {
      name: 'Agnello',
      category: 'meat',
      peakSeason: { start: 3, end: 5 },
      availability: 'seasonal',
      costMultiplier: 1.4,
      quality: 'good'
    },
    'vitello': {
      name: 'Vitello',
      category: 'meat',
      peakSeason: { start: 3, end: 6 },
      availability: 'seasonal',
      costMultiplier: 1.3,
      quality: 'good'
    },

    // Erbe aromatiche
    'basilico': {
      name: 'Basilico',
      category: 'herb',
      peakSeason: { start: 5, end: 9 },
      availability: 'seasonal',
      costMultiplier: 2.0,
      quality: 'poor'
    },
    'rosmarino': {
      name: 'Rosmarino',
      category: 'herb',
      peakSeason: { start: 4, end: 10 },
      availability: 'seasonal',
      costMultiplier: 1.5,
      quality: 'fair'
    },
    'salvia': {
      name: 'Salvia',
      category: 'herb',
      peakSeason: { start: 4, end: 10 },
      availability: 'seasonal',
      costMultiplier: 1.8,
      quality: 'fair'
    },

    // Ingredienti sempre disponibili
    'pasta': {
      name: 'Pasta',
      category: 'grain',
      peakSeason: { start: 1, end: 12 },
      availability: 'year_round',
      costMultiplier: 1.0,
      quality: 'excellent'
    },
    'riso': {
      name: 'Riso',
      category: 'grain',
      peakSeason: { start: 1, end: 12 },
      availability: 'year_round',
      costMultiplier: 1.0,
      quality: 'excellent'
    },
    'formaggio': {
      name: 'Formaggio',
      category: 'dairy',
      peakSeason: { start: 1, end: 12 },
      availability: 'year_round',
      costMultiplier: 1.0,
      quality: 'excellent'
    }
  };

  private getCurrentMonth(): number {
    return new Date().getMonth() + 1; // getMonth() restituisce 0-11
  }

  private isInSeason(ingredient: Ingredient): boolean {
    const currentMonth = this.getCurrentMonth();
    const { start, end } = ingredient.peakSeason;
    
    if (start <= end) {
      // Stagione normale (es. 3-6)
      return currentMonth >= start && currentMonth <= end;
    } else {
      // Stagione che attraversa l'anno nuovo (es. 11-2)
      return currentMonth >= start || currentMonth <= end;
    }
  }

  private getSeasonalStatus(ingredient: Ingredient): 'in_season' | 'out_of_season' | 'transitioning' {
    if (ingredient.availability === 'year_round') {
      return 'in_season';
    }

    const currentMonth = this.getCurrentMonth();
    const { start, end } = ingredient.peakSeason;
    
    if (this.isInSeason(ingredient)) {
      return 'in_season';
    }

    // Controlla se siamo in periodo di transizione (1 mese prima/dopo)
    const isTransitioning = 
      currentMonth === start - 1 || 
      currentMonth === end + 1 ||
      (start === 1 && currentMonth === 12) ||
      (end === 12 && currentMonth === 1);

    return isTransitioning ? 'transitioning' : 'out_of_season';
  }

  private getQuality(ingredient: Ingredient, status: string): 'excellent' | 'good' | 'fair' | 'poor' {
    if (status === 'in_season') {
      return 'excellent';
    }
    return ingredient.quality;
  }

  private getCostImpact(ingredient: Ingredient, status: string): number {
    if (status === 'in_season') {
      return 0; // Nessun impatto sui costi
    }
    return Math.round((ingredient.costMultiplier - 1) * 100);
  }

  private getRecommendation(ingredient: Ingredient, status: string): string {
    switch (status) {
      case 'in_season':
        return `✅ ${ingredient.name} è di stagione - qualità eccellente e prezzo ottimale`;
      case 'transitioning':
        return `⚠️ ${ingredient.name} sta entrando/uscendo di stagione - considerare alternative`;
      case 'out_of_season':
        return `❌ ${ingredient.name} fuori stagione - costo +${this.getCostImpact(ingredient, status)}%`;
      default:
        return `ℹ️ ${ingredient.name} - disponibilità tutto l'anno`;
    }
  }

  private getAlternatives(ingredient: Ingredient): string[] {
    // Mappa di alternative per ingrediente
    const alternatives: Record<string, string[]> = {
      'pomodoro': ['pomodori secchi', 'passata di pomodoro', 'pomodori ciliegini'],
      'zucchina': ['zucchine gialle', 'courgette', 'zucchine tonde'],
      'melanzana': ['peperoni', 'zucchine', 'funghi'],
      'fragola': ['mirtilli', 'lamponi', 'more'],
      'pesca': ['albicocche', 'nettarine', 'pere'],
      'tonno': ['salmone', 'branzino', 'orata'],
      'basilico': ['prezzemolo', 'origano', 'timo'],
      'carciofo': ['asparagi', 'broccoli', 'cavolfiore'],
      'asparago': ['broccoli', 'cavolfiore', 'spinaci']
    };

    return alternatives[ingredient.name.toLowerCase()] || [];
  }

  analyzeIngredient(ingredientName: string): SeasonalAnalysis | null {
    const ingredient = this.ingredients[ingredientName.toLowerCase()];
    if (!ingredient) {
      return null;
    }

    const status = this.getSeasonalStatus(ingredient);
    const quality = this.getQuality(ingredient, status);
    const costImpact = this.getCostImpact(ingredient, status);
    const recommendation = this.getRecommendation(ingredient, status);
    const alternatives = this.getAlternatives(ingredient);

    return {
      ingredient: ingredient.name,
      currentStatus: status,
      quality,
      costImpact,
      recommendation,
      alternatives
    };
  }

  analyzeMenuIngredients(menuItems: any[]): {
    seasonalAnalysis: SeasonalAnalysis[];
    recommendations: string[];
    costImpact: number;
  } {
    const seasonalAnalysis: SeasonalAnalysis[] = [];
    const recommendations: string[] = [];
    let totalCostImpact = 0;
    let analyzedItems = 0;

    for (const item of menuItems) {
      // Estrai ingredienti dal nome/descrizione del piatto
      const ingredients = this.extractIngredientsFromDish(item.name, item.description);
      
      for (const ingredient of ingredients) {
        const analysis = this.analyzeIngredient(ingredient);
        if (analysis) {
          seasonalAnalysis.push(analysis);
          totalCostImpact += analysis.costImpact;
          analyzedItems++;
        }
      }
    }

    // Genera raccomandazioni generali
    const outOfSeasonCount = seasonalAnalysis.filter(a => a.currentStatus === 'out_of_season').length;
    const inSeasonCount = seasonalAnalysis.filter(a => a.currentStatus === 'in_season').length;

    if (outOfSeasonCount > inSeasonCount) {
      recommendations.push('⚠️ Molti ingredienti fuori stagione - considerare menu stagionale');
    }

    if (totalCostImpact > 50) {
      recommendations.push(`💰 Impatto costi stagionali: +${Math.round(totalCostImpact / analyzedItems)}%`);
    }

    const excellentQualityCount = seasonalAnalysis.filter(a => a.quality === 'excellent').length;
    if (excellentQualityCount > analyzedItems * 0.7) {
      recommendations.push('✅ Ottima stagionalità - qualità ingredienti eccellente');
    }

    return {
      seasonalAnalysis,
      recommendations,
      costImpact: Math.round(totalCostImpact / analyzedItems)
    };
  }

  private extractIngredientsFromDish(dishName: string, description: string): string[] {
    const text = `${dishName} ${description}`.toLowerCase();
    const foundIngredients: string[] = [];

    for (const [key, ingredient] of Object.entries(this.ingredients)) {
      if (text.includes(key) || text.includes(ingredient.name.toLowerCase())) {
        foundIngredients.push(key);
      }
    }

    return foundIngredients;
  }

  getSeasonalMenuSuggestions(): string[] {
    const currentMonth = this.getCurrentMonth();
    const suggestions: string[] = [];

    // Trova ingredienti di stagione
    const inSeasonIngredients = Object.values(this.ingredients)
      .filter(ingredient => this.isInSeason(ingredient))
      .map(ingredient => ingredient.name);

    if (inSeasonIngredients.length > 0) {
      suggestions.push(`🍃 Ingredienti di stagione: ${inSeasonIngredients.slice(0, 5).join(', ')}`);
    }

    // Trova ingredienti da evitare
    const outOfSeasonIngredients = Object.values(this.ingredients)
      .filter(ingredient => !this.isInSeason(ingredient) && ingredient.availability === 'seasonal')
      .map(ingredient => ingredient.name);

    if (outOfSeasonIngredients.length > 0) {
      suggestions.push(`❌ Evitare: ${outOfSeasonIngredients.slice(0, 3).join(', ')}`);
    }

    return suggestions;
  }
} 