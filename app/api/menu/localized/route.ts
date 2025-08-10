import { NextRequest, NextResponse } from 'next/server';
import { MultiLanguageMenu } from '../../../lib/multiLanguageMenu';
import { handleApiError } from '../../../lib/errorHandler';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');
    const userAgent = request.headers.get('user-agent') || '';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';

    if (!tableId) {
      return NextResponse.json({ error: 'Table ID required' }, { status: 400 });
    }

    const multiLangMenu = new MultiLanguageMenu();
    const localizedMenu = await multiLangMenu.getLocalizedMenu(tableId, userAgent, ip);

    return NextResponse.json({
      success: true,
      menu: localizedMenu,
      detectedLanguage: localizedMenu.language,
      detectedCurrency: localizedMenu.currency
    });
  } catch (error) {
    const { error: errorMessage, statusCode } = handleApiError(error);
    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
} 