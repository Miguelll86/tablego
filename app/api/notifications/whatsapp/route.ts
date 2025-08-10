import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, message, type } = await req.json();

    if (!phoneNumber || !message) {
      return NextResponse.json({ 
        error: 'Numero di telefono e messaggio sono obbligatori' 
      }, { status: 400 });
    }

    // Pulisce il numero di telefono (rimuove spazi, trattini, ecc.)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Aggiunge il prefisso +39 se non presente
    const formattedPhone = cleanPhone.startsWith('39') ? cleanPhone : 
                          cleanPhone.startsWith('+39') ? cleanPhone.substring(3) : 
                          `39${cleanPhone}`;

    // Crea l'URL WhatsApp
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;

    // In produzione, qui si potrebbe integrare con un servizio di invio WhatsApp
    // come Twilio, MessageBird, o altri servizi
    
    console.log('WhatsApp URL generato:', whatsappUrl);

    return NextResponse.json({
      success: true,
      whatsappUrl,
      message: 'URL WhatsApp generato con successo',
      type: type || 'general'
    });

  } catch (error) {
    console.error('Errore generazione WhatsApp URL:', error);
    return NextResponse.json({ 
      error: 'Errore del server' 
    }, { status: 500 });
  }
} 