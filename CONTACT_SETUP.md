# Configurazione Contatti

## Come Configurare il Tuo Numero di Telefono

Per far funzionare correttamente i pulsanti "Chiama" e "WhatsApp" nella tua applicazione, devi configurare il tuo numero di telefono reale.

### Passo 1: Modifica il File di Configurazione

Apri il file `app/lib/config.ts` e sostituisci il numero di telefono di esempio con il tuo numero reale:

```typescript
export const CONTACT_CONFIG = {
  // Sostituisci con il tuo numero di telefono reale (formato internazionale)
  phoneNumber: '393123456789', // ← CAMBIA QUESTO NUMERO
  
  // Email di contatto
  email: 'info@tablo.com',
  
  // Nome del business
  businessName: 'Tablo',
  
  // Orari di risposta
  responseTime: '2 ore',
  
  // Servizi offerti
  services: [
    'Consulenza gratuita',
    'Preventivo personalizzato',
    'Setup assistito',
    'Supporto 24/7'
  ]
};
```

### Passo 2: Formato del Numero di Telefono

Il numero deve essere nel formato internazionale **senza** il simbolo `+`:

- **Italia**: `39` + numero (es: `393123456789` per +39 312 345 6789)
- **Spagna**: `34` + numero (es: `34612345678` per +34 612 345 678)
- **Francia**: `33` + numero (es: `33612345678` per +33 612 345 678)
- **Germania**: `49` + numero (es: `4915123456789` per +49 151 234 56789)

### Esempi di Configurazione

```typescript
// Esempio per numero italiano
phoneNumber: '393123456789', // +39 312 345 6789

// Esempio per numero spagnolo
phoneNumber: '34612345678', // +34 612 345 678

// Esempio per numero francese
phoneNumber: '33612345678', // +33 612 345 678
```

### Passo 3: Testare la Configurazione

Dopo aver configurato il numero:

1. Avvia l'applicazione: `npm run dev`
2. Vai alla pagina principale
3. Clicca sui pulsanti "📱 WhatsApp" e "📞 Chiama"
4. Verifica che si aprano correttamente WhatsApp e l'app telefono

### Note Importanti

- **WhatsApp**: Il link si aprirà in WhatsApp Web o nell'app WhatsApp
- **Telefono**: Il link si aprirà nell'app telefono del dispositivo
- **Formato**: Assicurati di non includere spazi, trattini o simboli nel numero
- **Prefisso**: Includi sempre il prefisso internazionale del paese

### Risoluzione Problemi

Se i link non funzionano:

1. **Verifica il formato**: Assicurati che il numero sia nel formato corretto
2. **Testa il numero**: Prova a chiamare il numero manualmente
3. **Controlla la console**: Apri gli strumenti di sviluppo e controlla eventuali errori
4. **Dispositivo mobile**: I link funzionano meglio su dispositivi mobili

### Supporto

Se hai problemi con la configurazione, contatta il supporto tecnico.
