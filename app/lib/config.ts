// Configurazione per le informazioni di contatto
export const CONTACT_CONFIG = {
  // Sostituisci con il tuo numero di telefono reale (formato internazionale)
  phoneNumber: '393123456789', // Esempio: '393123456789' per +39 312 345 6789
  
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

// Funzioni helper per generare URL di contatto
export const getWhatsAppUrl = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${CONTACT_CONFIG.phoneNumber}?text=${encodedMessage}`;
};

export const getPhoneUrl = () => {
  return `tel:+${CONTACT_CONFIG.phoneNumber}`;
};

export const getEmailUrl = (subject: string, body: string) => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${CONTACT_CONFIG.email}?subject=${encodedSubject}&body=${encodedBody}`;
};
