# 🏪 Gestione Amministrativa Ristoranti Multipli

## 📋 Panoramica

Il sistema TableGo supporta **più ristoranti per utente**, ma questa funzionalità è **nascosta all'interfaccia utente**. Gli utenti che necessitano di aggiungere strutture aggiuntive devono **contattare l'amministratore**.

## 🔧 API Amministrative

### 1. Aggiungere un Nuovo Ristorante

**Endpoint:** `POST /api/admin/restaurants`

**Payload:**
```json
{
  "userId": "user_id_here",
  "name": "Nome Ristorante",
  "address": "Indirizzo Ristorante",
  "phone": "+39 123 456 789",
  "email": "ristorante@email.com",
  "description": "Descrizione opzionale",
  "piva": "12345678901",
  "codiceUnivoco": "ABC12345"
}
```

**Risposta:**
```json
{
  "success": true,
  "restaurant": {
    "id": "restaurant_id",
    "name": "Nome Ristorante",
    "address": "Indirizzo Ristorante",
    "phone": "+39 123 456 789",
    "email": "ristorante@email.com",
    "piva": "12345678901",
    "codiceUnivoco": "ABC12345",
    "isActive": true,
    "userId": "user_id_here"
  },
  "message": "Ristorante \"Nome Ristorante\" aggiunto con successo all'utente Nome Utente"
}
```

### 2. Visualizzare i Ristoranti di un Utente

**Endpoint:** `GET /api/admin/restaurants?userId=user_id_here`

**Risposta:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Nome Utente",
    "email": "user@email.com"
  },
  "restaurants": [
    {
      "id": "restaurant_id_1",
      "name": "Ristorante 1",
      "address": "Indirizzo 1",
      "phone": "+39 123 456 789",
      "email": "ristorante1@email.com",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": "restaurant_id_2",
      "name": "Ristorante 2",
      "address": "Indirizzo 2",
      "phone": "+39 987 654 321",
      "email": "ristorante2@email.com",
      "isActive": true,
      "createdAt": "2024-01-02T00:00:00.000Z",
      "updatedAt": "2024-01-02T00:00:00.000Z"
    }
  ]
}
```

## 🎯 Gestione Ristoranti Individuali

### 3. Aggiornare un Ristorante

**Endpoint:** `PUT /api/restaurants/{restaurantId}`

**Payload:**
```json
{
  "name": "Nuovo Nome",
  "address": "Nuovo Indirizzo",
  "phone": "+39 111 222 333",
  "email": "nuovo@email.com",
  "description": "Nuova descrizione",
  "piva": "12345678901",
  "codiceUnivoco": "ABC12345",
  "isActive": true
}
```

### 4. Eliminare un Ristorante (Soft Delete)

**Endpoint:** `DELETE /api/restaurants/{restaurantId}`

**Risposta:**
```json
{
  "success": true,
  "message": "Ristorante Nome Ristorante eliminato con successo"
}
```

## 🔍 Come Trovare l'User ID

### Metodo 1: Tramite Email
```bash
# Query diretta al database
SELECT id, name, email FROM users WHERE email = 'user@email.com';
```

### Metodo 2: Tramite API (se autenticato)
```bash
# L'utente deve essere loggato
curl -X GET "http://localhost:3000/api/auth/me" \
  -H "Cookie: session_token=...; user_id=..."
```

## 📝 Esempi di Utilizzo

### Esempio 1: Aggiungere un Secondo Ristorante
```bash
curl -X POST "http://localhost:3000/api/admin/restaurants" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_123",
    "name": "Ristorante Mare",
    "address": "Via del Mare, 123, Napoli",
    "phone": "+39 081 123 456",
    "email": "mare@ristorante.com",
    "description": "Ristorante specializzato in pesce",
    "piva": "12345678901",
    "codiceUnivoco": "ABC12345"
  }'
```

### Esempio 2: Visualizzare Tutti i Ristoranti di un Utente
```bash
curl -X GET "http://localhost:3000/api/admin/restaurants?userId=user_123"
```

## ⚠️ Note Importanti

1. **Nascosto all'utente:** L'interfaccia utente mostra solo il primo ristorante
2. **Compatibilità:** Tutte le API esistenti continuano a funzionare con il primo ristorante
3. **Sicurezza:** Le API amministrative dovrebbero essere protette in produzione
4. **Backup:** Sempre fare backup prima di modifiche amministrative

## 🚀 Prossimi Passi

Per rendere visibile la gestione multi-ristorante agli utenti:

1. **Interfaccia di selezione ristorante** nella dashboard
2. **Switcher ristorante** nella sidebar
3. **Gestione ristoranti** nelle impostazioni
4. **API per cambiare ristorante attivo**

## 📞 Supporto

Per assistenza nella gestione dei ristoranti multipli, contattare l'amministratore del sistema. 