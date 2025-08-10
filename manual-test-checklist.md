# Checklist Test Manuale - Tablo

## 🎯 Test Completo delle Funzionalità

### **Preparazione**
- [ ] Avvia l'applicazione: `npm run dev`
- [ ] Apri http://localhost:3000 nel browser
- [ ] Verifica che la pagina si carichi correttamente

---

## **1. 📊 Dashboard**

### **Test Dashboard Principale**
- [ ] **Accesso Dashboard**: Vai su `/dashboard` dopo il login
- [ ] **Statistiche**: Verifica che mostri ordini totali, fatturato, tavoli attivi
- [ ] **Grafici**: Controlla che i grafici si carichino correttamente
- [ ] **Ordini Recenti**: Verifica la lista degli ordini recenti
- [ ] **Piatti Popolari**: Controlla la sezione piatti più venduti
- [ ] **Stato Tavoli**: Verifica la visualizzazione dello stato dei tavoli

### **Test Analytics**
- [ ] **Filtri Data**: Testa i filtri per oggi, questa settimana, questo mese
- [ ] **Export Dati**: Prova l'export dei dati (se disponibile)
- [ ] **Performance**: Verifica che la dashboard si carichi in < 2 secondi

---

## **2. 🍽️ Gestione Menu**

### **Test Categorie**
- [ ] **Crea Categoria**: Aggiungi una nuova categoria
- [ ] **Modifica Categoria**: Cambia nome/descrizione di una categoria
- [ ] **Elimina Categoria**: Rimuovi una categoria (verifica che non abbia piatti)
- [ ] **Ordine Categorie**: Riorganizza l'ordine delle categorie

### **Test Menu Items**
- [ ] **Crea Piatto**: Aggiungi un nuovo piatto con foto e descrizione
- [ ] **Modifica Piatto**: Cambia prezzo, descrizione, disponibilità
- [ ] **Elimina Piatto**: Rimuovi un piatto
- [ ] **Upload Immagine**: Testa il caricamento di immagini
- [ ] **Allergeni**: Aggiungi informazioni sugli allergeni
- [ ] **Prezzi**: Verifica che i prezzi si salvino correttamente

### **Test Menu Digitale**
- [ ] **Visualizzazione**: Controlla come appare il menu ai clienti
- [ ] **Categorie**: Verifica che le categorie si mostrino correttamente
- [ ] **Foto**: Controlla che le immagini si carichino
- [ ] **Prezzi**: Verifica la formattazione dei prezzi

---

## **3. 🪑 Gestione Tavoli**

### **Test Tavoli**
- [ ] **Crea Tavolo**: Aggiungi un nuovo tavolo
- [ ] **Modifica Tavolo**: Cambia capacità, posizione, tipo
- [ ] **Elimina Tavolo**: Rimuovi un tavolo
- [ ] **Stato Tavolo**: Cambia stato (disponibile, occupato, prenotato)
- [ ] **Posizionamento**: Testa il posizionamento nella piantina

### **Test Piantina**
- [ ] **Visualizzazione**: Apri la vista piantina
- [ ] **Drag & Drop**: Trascina i tavoli per riposizionarli
- [ ] **Salvataggio**: Verifica che le posizioni si salvino
- [ ] **Zoom**: Testa lo zoom in/out della piantina
- [ ] **Stato Visivo**: Controlla che lo stato dei tavoli sia visibile

### **Test QR Code**
- [ ] **Generazione QR**: Genera QR code per un tavolo
- [ ] **Download QR**: Scarica il QR code
- [ ] **Stampa QR**: Verifica la qualità per la stampa
- [ ] **Link QR**: Testa che il QR porti al menu corretto

---

## **4. 📋 Gestione Ordini**

### **Test Creazione Ordini**
- [ ] **Nuovo Ordine**: Crea un ordine manualmente
- [ ] **Selezione Piatti**: Aggiungi piatti all'ordine
- [ ] **Quantità**: Cambia le quantità dei piatti
- [ ] **Note**: Aggiungi note speciali
- [ ] **Totale**: Verifica il calcolo automatico del totale

### **Test Gestione Ordini**
- [ ] **Stato Ordini**: Cambia stato (in attesa, confermato, preparazione, pronto, servito)
- [ ] **Modifica Ordine**: Aggiungi/rimuovi piatti da un ordine esistente
- [ ] **Annulla Ordine**: Annulla un ordine
- [ ] **Storico**: Controlla lo storico degli ordini

### **Test Pagamenti**
- [ ] **Integrazione Stripe**: Testa la creazione di un intent di pagamento
- [ ] **Pagamento Carta**: Simula un pagamento con carta
- [ ] **Pagamento Contanti**: Registra un pagamento in contanti
- [ ] **Ricevuta**: Genera una ricevuta

---

## **5. 📅 Prenotazioni**

### **Test Prenotazioni**
- [ ] **Crea Prenotazione**: Aggiungi una nuova prenotazione
- [ ] **Selezione Tavolo**: Scegli un tavolo disponibile
- [ ] **Data e Ora**: Imposta data e ora della prenotazione
- [ ] **Dati Cliente**: Inserisci nome, telefono, email
- [ ] **Note**: Aggiungi note speciali

### **Test Gestione Prenotazioni**
- [ ] **Conferma**: Conferma una prenotazione
- [ ] **Modifica**: Cambia data, ora, numero persone
- [ ] **Annulla**: Annulla una prenotazione
- [ ] **WhatsApp**: Testa l'invio automatico di messaggi WhatsApp

### **Test Calendario**
- [ ] **Visualizzazione**: Controlla la vista calendario
- [ ] **Filtri**: Testa i filtri per data, tavolo, stato
- [ ] **Conflitti**: Verifica la gestione dei conflitti di prenotazione

---

## **6. 🤖 Funzionalità AI**

### **Test AI Menu Optimization**
- [ ] **Analisi Stagionale**: Testa l'analisi degli ingredienti stagionali
- [ ] **Suggerimenti**: Verifica i suggerimenti per il menu
- [ ] **Ottimizzazione Prezzi**: Controlla i suggerimenti di prezzo
- [ ] **Report AI**: Genera report di ottimizzazione

### **Test Multi-Language**
- [ ] **Traduzione**: Testa la traduzione del menu in diverse lingue
- [ ] **Cambio Lingua**: Cambia lingua nell'interfaccia
- [ ] **Menu Localizzato**: Verifica il menu tradotto per i clienti
- [ ] **Valuta**: Testa la conversione automatica della valuta

---

## **7. ⚙️ Impostazioni**

### **Test Configurazione**
- [ ] **Info Locale**: Modifica nome, descrizione, indirizzo
- [ ] **Logo**: Carica un nuovo logo
- [ ] **Contatti**: Aggiorna email, telefono
- [ ] **Orari**: Imposta orari di apertura

### **Test Utenti**
- [ ] **Gestione Utenti**: Aggiungi/modifica/elimina utenti
- [ ] **Permessi**: Testa i diversi livelli di permesso
- [ ] **Password**: Cambia password utente

### **Test Sistema**
- [ ] **Backup**: Esegui un backup dei dati
- [ ] **Export**: Esporta dati in CSV/JSON
- [ ] **Import**: Importa dati (se disponibile)
- [ ] **Log**: Controlla i log del sistema

---

## **8. 🔔 Notifiche**

### **Test Notifiche**
- [ ] **Nuovo Ordine**: Verifica la notifica per un nuovo ordine
- [ ] **Stato Ordine**: Controlla le notifiche di cambio stato
- [ ] **Prenotazione**: Testa le notifiche per nuove prenotazioni
- [ ] **WhatsApp**: Verifica l'invio automatico di messaggi

### **Test Real-time**
- [ ] **Socket.io**: Testa le notifiche in tempo reale
- [ ] **Aggiornamenti**: Verifica che i dati si aggiornino automaticamente
- [ ] **Connessione**: Testa la riconnessione automatica

---

## **9. 📱 PWA Features**

### **Test PWA**
- [ ] **Installazione**: Installa l'app come PWA
- [ ] **Offline**: Testa il funzionamento offline
- [ ] **Sincronizzazione**: Verifica la sincronizzazione dei dati
- [ ] **Notifiche Push**: Testa le notifiche push (se disponibili)

### **Test Mobile**
- [ ] **Responsive**: Verifica che l'app sia responsive
- [ ] **Touch**: Testa le interazioni touch
- [ ] **Performance**: Controlla le performance su mobile

---

## **10. 🔒 Sicurezza**

### **Test Sicurezza**
- [ ] **Autenticazione**: Verifica che solo gli utenti autorizzati possano accedere
- [ ] **Sessione**: Testa la gestione delle sessioni
- [ ] **Logout**: Verifica che il logout funzioni correttamente
- [ ] **CORS**: Controlla le policy CORS
- [ ] **Validazione**: Testa la validazione dei dati

---

## **11. 🌐 Multi-lingua**

### **Test Lingue**
- [ ] **Italiano**: Verifica l'interfaccia in italiano
- [ ] **Inglese**: Cambia in inglese e controlla le traduzioni
- [ ] **Spagnolo**: Testa l'interfaccia in spagnolo
- [ ] **Francese**: Verifica l'interfaccia in francese
- [ ] **Tedesco**: Testa l'interfaccia in tedesco

---

## **12. 📊 Performance**

### **Test Performance**
- [ ] **Tempo di Caricamento**: Verifica che le pagine si carichino velocemente
- [ ] **Database**: Controlla le query del database
- [ ] **Memoria**: Monitora l'uso della memoria
- [ ] **CPU**: Verifica l'uso della CPU

---

## **🎯 Risultati Finali**

### **Metriche di Successo**
- [ ] **Funzionalità Core**: Tutte le funzionalità principali funzionano
- [ ] **Performance**: Tempi di risposta < 2 secondi
- [ ] **Usabilità**: Interfaccia intuitiva e facile da usare
- [ ] **Stabilità**: Nessun crash o errore critico
- [ ] **Sicurezza**: Tutti i test di sicurezza superati

### **Problemi Trovati**
- [ ] **Bug Critici**: Lista dei bug critici da risolvere
- [ ] **Bug Minori**: Lista dei bug minori da risolvere
- [ ] **Miglioramenti**: Suggerimenti per miglioramenti

### **Raccomandazioni**
- [ ] **Produzione**: Sistema pronto per la produzione?
- [ ] **Testing**: Necessità di test aggiuntivi?
- [ ] **Documentazione**: Documentazione aggiornata?
- [ ] **Training**: Necessità di training per gli utenti?

---

## **📝 Note**

*Data Test: ___________*
*Tester: ___________*
*Versione: ___________*

**Risultato Finale:**
- ✅ **SUCCESSO**: Sistema pronto per la produzione
- ⚠️ **PARZIALE**: Necessita correzioni minori
- ❌ **FALLIMENTO**: Necessita correzioni significative
