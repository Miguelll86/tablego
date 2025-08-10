// Configurazione per le informazioni di contatto
export const CONTACT_CONFIG = {
  // Numero di telefono configurato (formato internazionale)
  phoneNumber: '393931441705', // +39 393 144 1705
  
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
