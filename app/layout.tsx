import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import { ErrorBoundary } from "./components/ErrorBoundary";

const montserrat = Montserrat({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "Tablo — Smart Restaurant Management",
  description: "Sistema completo per la gestione di menu digitali, tavoli, ordini e pagamenti",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tablo"
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export const themeColor = "#3b82f6";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="dark" style={{ colorScheme: 'dark', backgroundColor: '#0f172a', color: '#f1f5f9' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tablo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="color-scheme" content="dark" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Forza tema scuro - OVERRIDE COMPLETO
              document.documentElement.classList.add('dark');
              document.documentElement.style.colorScheme = 'dark';
              document.documentElement.style.backgroundColor = '#0f172a';
              document.documentElement.style.color = '#f1f5f9';
              document.body.style.colorScheme = 'dark';
              document.body.style.backgroundColor = '#0f172a';
              document.body.style.color = '#f1f5f9';
              
              // Override preferenze sistema - FORZA TEMA SCURO
              if (window.matchMedia) {
                const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
                if (mediaQuery.matches) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                  document.documentElement.style.backgroundColor = '#0f172a';
                  document.documentElement.style.color = '#f1f5f9';
                  document.body.style.colorScheme = 'dark';
                  document.body.style.backgroundColor = '#0f172a';
                  document.body.style.color = '#f1f5f9';
                }
              }
              
              // Forza tutti gli elementi a usare il tema scuro
              const style = document.createElement('style');
              style.textContent = \`
                * {
                  color-scheme: dark !important;
                }
                .text-gray-900, .text-gray-800, .text-gray-700, .text-gray-600, .text-gray-500, .text-gray-400, .text-gray-300, .text-gray-200, .text-gray-100 {
                  color: #f1f5f9 !important;
                }
                .bg-gray-50, .bg-gray-100, .bg-gray-200, .bg-gray-300, .bg-gray-400, .bg-gray-500, .bg-gray-600, .bg-gray-700, .bg-gray-800, .bg-gray-900 {
                  background-color: #0f172a !important;
                }
                .bg-white {
                  background-color: #1e293b !important;
                }
                .text-black {
                  color: #f1f5f9 !important;
                }
                .text-white {
                  color: #f1f5f9 !important;
                }
              \`;
              document.head.appendChild(style);
            `,
          }}
        />
      </head>
      <body className={`${montserrat.className} bg-slate-900 text-white`} style={{ colorScheme: 'dark', backgroundColor: '#0f172a', color: '#f1f5f9' }}>
        <ErrorBoundary>
          <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto transition-all duration-200">
              {children}
            </main>
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
