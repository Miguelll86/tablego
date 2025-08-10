import { NextRequest, NextResponse } from 'next/server';
import { AIMenuOptimizer } from '../../../lib/aiMenuOptimization';
import { handleApiError } from '../../../lib/errorHandler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const restaurantId = searchParams.get('restaurantId');

    if (!restaurantId) {
      return NextResponse.json({ error: 'Restaurant ID required' }, { status: 400 });
    }

    const optimizer = new AIMenuOptimizer();
    const suggestions = await optimizer.generateOptimizationSuggestions(restaurantId);
    const predictedDemand = await optimizer.predictDemand(restaurantId, new Date());

    return NextResponse.json({
      success: true,
      suggestions,
      predictedDemand,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
} 