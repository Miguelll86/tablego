import { NextRequest, NextResponse } from 'next/server';
import { SeasonalIngredientsAnalyzer } from '../../../lib/seasonalIngredients';
import { handleApiError } from '../../../lib/errorHandler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID required' }, { status: 400 });
    }

    const seasonalAnalyzer = new SeasonalIngredientsAnalyzer();
    
    // Menu di esempio per l'analisi
    const sampleMenu = [
      { name: 'Pizza Margherita', description: 'Pizza con pomodoro e mozzarella' },
      { name: 'Pasta alla Norma', description: 'Pasta con melanzane e ricotta' },
      { name: 'Insalata Caprese', description: 'Insalata con pomodoro, mozzarella e basilico' },
      { name: 'Risotto ai Funghi', description: 'Risotto con funghi porcini' },
      { name: 'Branzino al Forno', description: 'Branzino con limone e rosmarino' }
    ];

    const analysis = seasonalAnalyzer.analyzeMenuIngredients(sampleMenu);
    const suggestions = seasonalAnalyzer.getSeasonalMenuSuggestions();

    return NextResponse.json({
      success: true,
      analysis,
      suggestions,
      currentMonth: new Date().getMonth() + 1,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { menuItems } = await request.json();

    if (!menuItems || !Array.isArray(menuItems)) {
      return NextResponse.json({ error: 'Menu items array required' }, { status: 400 });
    }

    const seasonalAnalyzer = new SeasonalIngredientsAnalyzer();
    const analysis = seasonalAnalyzer.analyzeMenuIngredients(menuItems);
    const suggestions = seasonalAnalyzer.getSeasonalMenuSuggestions();

    return NextResponse.json({
      success: true,
      analysis,
      suggestions,
      currentMonth: new Date().getMonth() + 1
    });
  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
} 