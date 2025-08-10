import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get('user_id')?.value;
    const sessionToken = req.cookies.get('session_token')?.value;
    
    const debugInfo: {
      cookies: {
        user_id: string;
        session_token: string;
      };
      headers: { [key: string]: string };
      url: string;
      sessionData?: any;
      sessionParseError?: string;
    } = {
      cookies: {
        user_id: userId || 'NON PRESENTE',
        session_token: sessionToken ? 'PRESENTE' : 'NON PRESENTE'
      },
      headers: Object.fromEntries(req.headers.entries()),
      url: req.url
    };

    if (sessionToken) {
      try {
        const sessionData = JSON.parse(sessionToken);
        debugInfo.sessionData = sessionData;
      } catch (error) {
        debugInfo.sessionParseError = 'Errore nel parsing del session_token';
      }
    }

    return NextResponse.json(debugInfo);
  } catch (error) {
    console.error('Errore debug sessione:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}