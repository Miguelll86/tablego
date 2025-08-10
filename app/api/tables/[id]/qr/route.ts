import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { MultiLanguageMenu } from '../../../../lib/multiLanguageMenu';
import QRCode from 'qrcode';
import sharp from 'sharp';
import PDFDocument from 'pdfkit';

export async function GET(
  req: NextRequest,
  { params }: any
) {
  try {
    const tableId = params.id;
    const url = new URL(req.url);
    const format = url.searchParams.get('format') || 'json'; // json, png, pdf
    const size = parseInt(url.searchParams.get('size') || '300');

    // Verifica che il tavolo esista
    const table = await prisma.table.findUnique({
      where: { id: tableId },
      include: {
        restaurant: {
          select: { id: true, name: true }
        }
      }
    });

    if (!table) {
      return NextResponse.json({ error: 'Tavolo non trovato' }, { status: 404 });
    }

    // Genera URL del QR
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const qrUrl = `${baseUrl}/qr/${tableId}`;

    // Genera QR code in base al formato richiesto
    switch (format) {
      case 'png':
        return await generatePNG(qrUrl, size, table);
      
      case 'pdf':
        return await generatePDF(qrUrl, size, table);
      
      default:
        // Restituisce dati JSON con QR code Base64
        const qrCodeDataUrl = await QRCode.toDataURL(qrUrl, {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        return NextResponse.json({
          success: true,
          table: {
            id: table.id,
            number: table.number,
            restaurant: table.restaurant.name
          },
          qrCode: {
            url: qrUrl,
            dataUrl: qrCodeDataUrl,
            size: size
          }
        });
    }

  } catch (error) {
    console.error('Errore generazione QR:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}

async function generatePNG(qrUrl: string, size: number, table: any) {
  try {
    // Genera QR code come buffer
    const qrBuffer = await QRCode.toBuffer(qrUrl, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Ottimizza con Sharp
    const optimizedBuffer = await sharp(qrBuffer)
      .png({ quality: 100, compressionLevel: 0 })
      .toBuffer();

    const headers = new Headers();
    headers.set('Content-Type', 'image/png');
    headers.set('Content-Disposition', `attachment; filename="tavolo-${table.number}-qr.png"`);
    headers.set('Content-Length', optimizedBuffer.length.toString());

    return new NextResponse(optimizedBuffer as any, { headers });

  } catch (error) {
    console.error('Errore generazione PNG:', error);
    throw error;
  }
}

async function generatePDF(qrUrl: string, size: number, table: any) {
  try {
    // Genera QR code come buffer
    const qrBuffer = await QRCode.toBuffer(qrUrl, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return new Promise<NextResponse>((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        
        const headers = new Headers();
        headers.set('Content-Type', 'application/pdf');
        headers.set('Content-Disposition', `attachment; filename="tavolo-${table.number}-qr.pdf"`);
        headers.set('Content-Length', pdfBuffer.length.toString());

        resolve(new NextResponse(pdfBuffer, { headers }));
      });

      doc.on('error', reject);

      // Aggiungi contenuto al PDF
      doc.fontSize(24).text(`Tavolo ${table.number}`, { align: 'center' });
      doc.moveDown();
      doc.fontSize(16).text(`${table.restaurant.name}`, { align: 'center' });
      doc.moveDown(2);

      // Centra l'immagine QR
      const pageWidth = doc.page.width;
      const qrSize = Math.min(size, 300);
      const x = (pageWidth - qrSize) / 2;
      
      doc.image(qrBuffer, x, doc.y, { width: qrSize });
      doc.moveDown(3);

      doc.fontSize(12).text('Scansiona per accedere al menu digitale', { align: 'center' });
      doc.text(qrUrl, { align: 'center', link: qrUrl });

      doc.end();
    });

  } catch (error) {
    console.error('Errore generazione PDF:', error);
    throw error;
  }
}

export async function PUT(
  req: NextRequest,
  { params }: any
) {
  try {
    const tableId = params.id;

    // Verifica autenticazione
    const userId = req.cookies.get('user_id')?.value;
    const sessionToken = req.cookies.get('session_token')?.value;
    
    if (!userId && !sessionToken) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    // Verifica che il tavolo esista e appartenga all'utente
    const table = await prisma.table.findUnique({
      where: { id: tableId },
      include: {
        restaurant: {
          include: {
            user: true
          }
        }
      }
    });

    if (!table) {
      return NextResponse.json({ error: 'Tavolo non trovato' }, { status: 404 });
    }

    // Rigenera QR code per questo tavolo
    const multiLang = new MultiLanguageMenu();
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    const qrCodeDataUrl = await multiLang.generateAdaptiveQRCode(
      tableId, 
      'Mozilla/5.0',
      '127.0.0.1'
    );

    // Aggiorna il tavolo
    const updatedTable = await prisma.table.update({
      where: { id: tableId },
      data: { 
        qrCode: qrCodeDataUrl,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: `QR rigenerato per tavolo ${table.number}`,
      table: {
        id: updatedTable.id,
        number: updatedTable.number,
        qrCode: updatedTable.qrCode
      }
    });

  } catch (error) {
    console.error('Errore rigenerazione QR singolo:', error);
    return NextResponse.json({ error: 'Errore del server' }, { status: 500 });
  }
}