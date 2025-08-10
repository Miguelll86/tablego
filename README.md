# Tablo — Smart Restaurant Management

Sistema completo per la gestione di menu digitali, tavoli, ordini e pagamenti per ristoranti. Tablo porta l'innovazione nella tua cucina con un'interfaccia moderna e funzionalità avanzate.

## Caratteristiche

- 📱 **Menu Digitali**: Crea menu accattivanti con foto e descrizioni
- 🪑 **Gestione Tavoli**: Organizza i tavoli con piantina interattiva
- 📋 **Ordini Automatici**: Ordini che arrivano direttamente in cucina
- 💳 **Pagamenti Sicuri**: Integrazione con Stripe per pagamenti sicuri
- 📊 **Analytics Avanzate**: Monitora vendite e ottimizza il menu
- ⚡ **Setup Rapido**: Inizia in pochi minuti, nessuna installazione complessa

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Tecnologie

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (sviluppo), PostgreSQL (produzione)
- **Pagamenti**: Stripe
- **Autenticazione**: Sistema personalizzato con sessioni
- **Real-time**: Socket.io per notifiche in tempo reale

## Deploy

The easiest way to deploy Tablo is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
