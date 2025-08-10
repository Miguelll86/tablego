export type Language = 'it' | 'en' | 'es' | 'fr' | 'de';

export interface Translations {
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    loading: string;
    error: string;
    success: string;
    confirm: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    sort: string;
    actions: string;
    status: string;
    date: string;
    time: string;
    price: string;
    quantity: string;
    total: string;
    description: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  navigation: {
    dashboard: string;
    menu: string;
    tables: string;
    orders: string;
    settings: string;
    analytics: string;
    profile: string;
    logout: string;
    reservations: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    totalOrders: string;
    totalRevenue: string;
    activeTables: string;
    pendingOrders: string;
    todayOrders: string;
    todayRevenue: string;
    thisWeek: string;
    thisMonth: string;
    recentOrders: string;
    popularItems: string;
    tableStatus: string;
    orderStatus: string;
  };
  menu: {
    title: string;
    subtitle: string;
    addItem: string;
    editItem: string;
    deleteItem: string;
    category: string;
    price: string;
    description: string;
    image: string;
    available: string;
    unavailable: string;
    categories: string;
    allCategories: string;
    appetizers: string;
    mainCourses: string;
    desserts: string;
    beverages: string;
  };
  tables: {
    title: string;
    subtitle: string;
    addTable: string;
    editTable: string;
    deleteTable: string;
    tableNumber: string;
    capacity: string;
    status: string;
    occupied: string;
    available: string;
    reserved: string;
    maintenance: string;
    qrCode: string;
    generateQR: string;
  };
  orders: {
    title: string;
    subtitle: string;
    newOrder: string;
    orderNumber: string;
    tableNumber: string;
    customerName: string;
    items: string;
    status: string;
    total: string;
    createdAt: string;
    updatedAt: string;
    pending: string;
    confirmed: string;
    preparing: string;
    ready: string;
    served: string;
    completed: string;
    cancelled: string;
    paymentStatus: string;
    paid: string;
    unpaid: string;
    paymentMethod: string;
    cash: string;
    card: string;
    digital: string;
  };
  settings: {
    title: string;
    subtitle: string;
    restaurantInfo: string;
    restaurantName: string;
    restaurantDescription: string;
    contactInfo: string;
    paymentSettings: string;
    stripeConfig: string;
    themeSettings: string;
    languageSettings: string;
    notifications: string;
    backup: string;
    export: string;
    import: string;
  };
  notifications: {
    newOrder: string;
    orderUpdate: string;
    paymentReceived: string;
    lowStock: string;
    tableOccupied: string;
    tableAvailable: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    socialProof: string;
    socialProofSetup: string;
    pricing: string;
    login: string;
    register: string;
    tryFree: string;
    about: string;
    features: string;
    aiFeatures: string;
    qrCode: string;
    analytics: string;
    multiLanguage: string;
    pricingTitle: string;
    pricingSubtitle: string;
    contactTitle: string;
    contactSubtitle: string;
  };
}

const translations: Record<Language, Translations> = {
  it: {
    common: {
      save: 'Salva',
      cancel: 'Annulla',
      delete: 'Elimina',
      edit: 'Modifica',
      add: 'Aggiungi',
      loading: 'Caricamento...',
      error: 'Errore',
      success: 'Successo',
      confirm: 'Conferma',
      back: 'Indietro',
      next: 'Avanti',
      previous: 'Precedente',
      search: 'Cerca',
      filter: 'Filtra',
      sort: 'Ordina',
      actions: 'Azioni',
      status: 'Stato',
      date: 'Data',
      time: 'Ora',
      price: 'Prezzo',
      quantity: 'Quantità',
      total: 'Totale',
      description: 'Descrizione',
      name: 'Nome',
      email: 'Email',
      phone: 'Telefono',
      address: 'Indirizzo',
    },
    navigation: {
      dashboard: 'Dashboard',
      menu: 'Menu',
      tables: 'Tavoli',
      orders: 'Ordini',
      settings: 'Impostazioni',
      analytics: 'Analytics',
      profile: 'Profilo',
      logout: 'Logout',
      reservations: 'Prenotazioni',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Panoramica del tuo locale',
      totalOrders: 'Ordini Totali',
      totalRevenue: 'Fatturato Totale',
      activeTables: 'Tavoli Attivi',
      pendingOrders: 'Ordini in Attesa',
      todayOrders: 'Ordini di Oggi',
      todayRevenue: 'Fatturato di Oggi',
      thisWeek: 'Questa Settimana',
      thisMonth: 'Questo Mese',
      recentOrders: 'Ordini Recenti',
      popularItems: 'Piatti Popolari',
      tableStatus: 'Stato Tavoli',
      orderStatus: 'Stato Ordini',
    },
    menu: {
      title: 'Menu',
      subtitle: 'Gestisci il tuo menu',
      addItem: 'Aggiungi Piatto',
      editItem: 'Modifica Piatto',
      deleteItem: 'Elimina Piatto',
      category: 'Categoria',
      price: 'Prezzo',
      description: 'Descrizione',
      image: 'Immagine',
      available: 'Disponibile',
      unavailable: 'Non Disponibile',
      categories: 'Categorie',
      allCategories: 'Tutte le Categorie',
      appetizers: 'Antipasti',
      mainCourses: 'Primi Piatti',
      desserts: 'Dolci',
      beverages: 'Bevande',
    },
    tables: {
      title: 'Tavoli',
      subtitle: 'Gestisci i tavoli del locale',
      addTable: 'Aggiungi Tavolo',
      editTable: 'Modifica Tavolo',
      deleteTable: 'Elimina Tavolo',
      tableNumber: 'Numero Tavolo',
      capacity: 'Capacità',
      status: 'Stato',
      occupied: 'Occupato',
      available: 'Disponibile',
      reserved: 'Prenotato',
      maintenance: 'Manutenzione',
      qrCode: 'Codice QR',
      generateQR: 'Genera QR',
    },
    orders: {
      title: 'Ordini',
      subtitle: 'Gestisci gli ordini',
      newOrder: 'Nuovo Ordine',
      orderNumber: 'Numero Ordine',
      tableNumber: 'Numero Tavolo',
      customerName: 'Nome Cliente',
      items: 'Articoli',
      status: 'Stato',
      total: 'Totale',
      createdAt: 'Creato il',
      updatedAt: 'Aggiornato il',
      pending: 'In Attesa',
      confirmed: 'Confermato',
      preparing: 'In Preparazione',
      ready: 'Pronto',
      served: 'Servito',
      completed: 'Completato',
      cancelled: 'Annullato',
      paymentStatus: 'Stato Pagamento',
      paid: 'Pagato',
      unpaid: 'Non Pagato',
      paymentMethod: 'Metodo di Pagamento',
      cash: 'Contanti',
      card: 'Carta',
      digital: 'Digitale',
    },
    settings: {
      title: 'Impostazioni',
      subtitle: 'Configura il tuo locale',
      restaurantInfo: 'Informazioni Locale',
      restaurantName: 'Nome Locale',
      restaurantDescription: 'Descrizione Locale',
      contactInfo: 'Informazioni di Contatto',
      paymentSettings: 'Impostazioni Pagamenti',
      stripeConfig: 'Configurazione Stripe',
      themeSettings: 'Impostazioni Tema',
      languageSettings: 'Impostazioni Lingua',
      notifications: 'Notifiche',
      backup: 'Backup',
      export: 'Esporta',
      import: 'Importa',
    },
    notifications: {
      newOrder: 'Nuovo Ordine',
      orderUpdate: 'Aggiornamento Ordine',
      paymentReceived: 'Pagamento Ricevuto',
      lowStock: 'Scorte Basse',
      tableOccupied: 'Tavolo Occupato',
      tableAvailable: 'Tavolo Disponibile',
    },
    landing: {
      heroTitle: 'La tua piattaforma di gestione del locale',
      heroSubtitle: 'Semplifica la gestione del tuo locale con le migliori funzionalità di automazione e analisi.',
      socialProof: 'Piattaforma multi-struttura: gestisci più sedi con un unico account.',
      socialProofSetup: 'Imposta in pochi minuti e inizia a gestire il tuo locale.',
      pricing: 'Prezzi',
      login: 'Accedi',
      register: 'Registrati',
      tryFree: 'Prova Gratuitamente',
      about: 'Chi siamo',
      features: 'Funzionalità',
      aiFeatures: 'Funzionalità AI',
      qrCode: 'Genera codici QR per la tua cucina.',
      analytics: 'Analisi dettagliate per migliorare la tua gestione.',
      multiLanguage: 'Supporto multi-lingua per tutto il mondo.',
      pricingTitle: 'Prezzi Accessibili',
      pricingSubtitle: 'Scegli il piano che si adatta alle tue esigenze.',
      contactTitle: 'Contattaci',
      contactSubtitle: 'Hai domande? Siamo qui per aiutarti.',
    },
  },
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      actions: 'Actions',
      status: 'Status',
      date: 'Date',
      time: 'Time',
      price: 'Price',
      quantity: 'Quantity',
      total: 'Total',
      description: 'Description',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
    },
    navigation: {
      dashboard: 'Dashboard',
      menu: 'Menu',
      tables: 'Tables',
      orders: 'Orders',
      settings: 'Settings',
      analytics: 'Analytics',
      profile: 'Profile',
      logout: 'Logout',
      reservations: 'Reservations',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Restaurant overview',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      activeTables: 'Active Tables',
      pendingOrders: 'Pending Orders',
      todayOrders: 'Today\'s Orders',
      todayRevenue: 'Today\'s Revenue',
      thisWeek: 'This Week',
      thisMonth: 'This Month',
      recentOrders: 'Recent Orders',
      popularItems: 'Popular Items',
      tableStatus: 'Table Status',
      orderStatus: 'Order Status',
    },
    menu: {
      title: 'Menu',
      subtitle: 'Manage your menu',
      addItem: 'Add Item',
      editItem: 'Edit Item',
      deleteItem: 'Delete Item',
      category: 'Category',
      price: 'Price',
      description: 'Description',
      image: 'Image',
      available: 'Available',
      unavailable: 'Unavailable',
      categories: 'Categories',
      allCategories: 'All Categories',
      appetizers: 'Appetizers',
      mainCourses: 'Main Courses',
      desserts: 'Desserts',
      beverages: 'Beverages',
    },
    tables: {
      title: 'Tables',
      subtitle: 'Manage restaurant tables',
      addTable: 'Add Table',
      editTable: 'Edit Table',
      deleteTable: 'Delete Table',
      tableNumber: 'Table Number',
      capacity: 'Capacity',
      status: 'Status',
      occupied: 'Occupied',
      available: 'Available',
      reserved: 'Reserved',
      maintenance: 'Maintenance',
      qrCode: 'QR Code',
      generateQR: 'Generate QR',
    },
    orders: {
      title: 'Orders',
      subtitle: 'Manage orders',
      newOrder: 'New Order',
      orderNumber: 'Order Number',
      tableNumber: 'Table Number',
      customerName: 'Customer Name',
      items: 'Items',
      status: 'Status',
      total: 'Total',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready',
      served: 'Served',
      completed: 'Completed',
      cancelled: 'Cancelled',
      paymentStatus: 'Payment Status',
      paid: 'Paid',
      unpaid: 'Unpaid',
      paymentMethod: 'Payment Method',
      cash: 'Cash',
      card: 'Card',
      digital: 'Digital',
    },
    settings: {
      title: 'Settings',
      subtitle: 'Configure your restaurant',
      restaurantInfo: 'Restaurant Information',
      restaurantName: 'Restaurant Name',
      restaurantDescription: 'Restaurant Description',
      contactInfo: 'Contact Information',
      paymentSettings: 'Payment Settings',
      stripeConfig: 'Stripe Configuration',
      themeSettings: 'Theme Settings',
      languageSettings: 'Language Settings',
      notifications: 'Notifications',
      backup: 'Backup',
      export: 'Export',
      import: 'Import',
    },
    notifications: {
      newOrder: 'New Order',
      orderUpdate: 'Order Update',
      paymentReceived: 'Payment Received',
      lowStock: 'Low Stock',
      tableOccupied: 'Table Occupied',
      tableAvailable: 'Table Available',
    },
    landing: {
      heroTitle: 'Your restaurant management platform',
      heroSubtitle: 'Simplify restaurant management with the best automation and analytics features.',
      socialProof: 'Manage more than 100 restaurants with a single account.',
      socialProofSetup: 'Set up in minutes and start managing your restaurant.',
      pricing: 'Pricing',
      login: 'Login',
      register: 'Register',
      tryFree: 'Try for Free',
      about: 'About',
      features: 'Features',
      aiFeatures: 'AI Features',
      qrCode: 'Generate QR codes for your kitchen.',
      analytics: 'Detailed analytics to improve your management.',
      multiLanguage: 'Multi-language support for the world.',
      pricingTitle: 'Affordable Pricing',
      pricingSubtitle: 'Choose the plan that suits your needs.',
      contactTitle: 'Contact Us',
      contactSubtitle: 'Have questions? We are here to help.',
    },
  },
  es: {
    common: {
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      add: 'Agregar',
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      confirm: 'Confirmar',
      back: 'Atrás',
      next: 'Siguiente',
      previous: 'Anterior',
      search: 'Buscar',
      filter: 'Filtrar',
      sort: 'Ordenar',
      actions: 'Acciones',
      status: 'Estado',
      date: 'Fecha',
      time: 'Hora',
      price: 'Precio',
      quantity: 'Cantidad',
      total: 'Total',
      description: 'Descripción',
      name: 'Nombre',
      email: 'Email',
      phone: 'Teléfono',
      address: 'Dirección',
    },
    navigation: {
      dashboard: 'Panel',
      menu: 'Menú',
      tables: 'Mesas',
      orders: 'Pedidos',
      settings: 'Configuración',
      analytics: 'Analíticas',
      profile: 'Perfil',
      logout: 'Cerrar Sesión',
      reservations: 'Reservas',
    },
    dashboard: {
      title: 'Panel',
      subtitle: 'Vista general del restaurante',
      totalOrders: 'Pedidos Totales',
      totalRevenue: 'Ingresos Totales',
      activeTables: 'Mesas Activas',
      pendingOrders: 'Pedidos Pendientes',
      todayOrders: 'Pedidos de Hoy',
      todayRevenue: 'Ingresos de Hoy',
      thisWeek: 'Esta Semana',
      thisMonth: 'Este Mes',
      recentOrders: 'Pedidos Recientes',
      popularItems: 'Platos Populares',
      tableStatus: 'Estado de Mesas',
      orderStatus: 'Estado de Pedidos',
    },
    menu: {
      title: 'Menú',
      subtitle: 'Gestiona tu menú',
      addItem: 'Agregar Plato',
      editItem: 'Editar Plato',
      deleteItem: 'Eliminar Plato',
      category: 'Categoría',
      price: 'Precio',
      description: 'Descripción',
      image: 'Imagen',
      available: 'Disponible',
      unavailable: 'No Disponible',
      categories: 'Categorías',
      allCategories: 'Todas las Categorías',
      appetizers: 'Entrantes',
      mainCourses: 'Platos Principales',
      desserts: 'Postres',
      beverages: 'Bebidas',
    },
    tables: {
      title: 'Mesas',
      subtitle: 'Gestiona las mesas del restaurante',
      addTable: 'Agregar Mesa',
      editTable: 'Editar Mesa',
      deleteTable: 'Eliminar Mesa',
      tableNumber: 'Número de Mesa',
      capacity: 'Capacidad',
      status: 'Estado',
      occupied: 'Ocupada',
      available: 'Disponible',
      reserved: 'Reservada',
      maintenance: 'Mantenimiento',
      qrCode: 'Código QR',
      generateQR: 'Generar QR',
    },
    orders: {
      title: 'Pedidos',
      subtitle: 'Gestiona los pedidos',
      newOrder: 'Nuevo Pedido',
      orderNumber: 'Número de Pedido',
      tableNumber: 'Número de Mesa',
      customerName: 'Nombre del Cliente',
      items: 'Artículos',
      status: 'Estado',
      total: 'Total',
      createdAt: 'Creado el',
      updatedAt: 'Actualizado el',
      pending: 'Pendiente',
      confirmed: 'Confirmado',
      preparing: 'Preparando',
      ready: 'Listo',
      served: 'Servido',
      completed: 'Completado',
      cancelled: 'Cancelado',
      paymentStatus: 'Estado de Pago',
      paid: 'Pagado',
      unpaid: 'No Pagado',
      paymentMethod: 'Método de Pago',
      cash: 'Efectivo',
      card: 'Tarjeta',
      digital: 'Digital',
    },
    settings: {
      title: 'Configuración',
      subtitle: 'Configura tu restaurante',
      restaurantInfo: 'Información del Restaurante',
      restaurantName: 'Nombre del Restaurante',
      restaurantDescription: 'Descripción del Restaurante',
      contactInfo: 'Información de Contacto',
      paymentSettings: 'Configuración de Pagos',
      stripeConfig: 'Configuración de Stripe',
      themeSettings: 'Configuración de Tema',
      languageSettings: 'Configuración de Idioma',
      notifications: 'Notificaciones',
      backup: 'Respaldo',
      export: 'Exportar',
      import: 'Importar',
    },
    notifications: {
      newOrder: 'Nuevo Pedido',
      orderUpdate: 'Actualización de Pedido',
      paymentReceived: 'Pago Recibido',
      lowStock: 'Stock Bajo',
      tableOccupied: 'Mesa Ocupada',
      tableAvailable: 'Mesa Disponible',
    },
    landing: {
      heroTitle: 'Tu plataforma de gestión de restaurantes',
      heroSubtitle: 'Simplifica la gestión de tu restaurante con las mejores funciones de automatización y análisis.',
      socialProof: 'Gestiona más de 100 restaurantes con una sola cuenta.',
      socialProofSetup: 'Configúralo en minutos y comienza a gestionar tu restaurante.',
      pricing: 'Precios',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      tryFree: 'Prueba Gratuita',
      about: 'Sobre Nosotros',
      features: 'Características',
      aiFeatures: 'Características de IA',
      qrCode: 'Genera códigos QR para tu cocina.',
      analytics: 'Análisis detallados para mejorar tu gestión.',
      multiLanguage: 'Soporte multi-idioma para todo el mundo.',
      pricingTitle: 'Precios Asequibles',
      pricingSubtitle: 'Elige el plan que se adapte a tus necesidades.',
      contactTitle: 'Contáctanos',
      contactSubtitle: '¿Tienes preguntas? Estamos aquí para ayudarte.',
    },
  },
  fr: {
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      add: 'Ajouter',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      confirm: 'Confirmer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      actions: 'Actions',
      status: 'Statut',
      date: 'Date',
      time: 'Heure',
      price: 'Prix',
      quantity: 'Quantité',
      total: 'Total',
      description: 'Description',
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
    },
    navigation: {
      dashboard: 'Tableau de Bord',
      menu: 'Menu',
      tables: 'Tables',
      orders: 'Commandes',
      settings: 'Paramètres',
      analytics: 'Analyses',
      profile: 'Profil',
      logout: 'Déconnexion',
      reservations: 'Réservations',
    },
    dashboard: {
      title: 'Tableau de Bord',
      subtitle: 'Aperçu du restaurant',
      totalOrders: 'Commandes Totales',
      totalRevenue: 'Revenus Totaux',
      activeTables: 'Tables Actives',
      pendingOrders: 'Commandes en Attente',
      todayOrders: 'Commandes d\'Aujourd\'hui',
      todayRevenue: 'Revenus d\'Aujourd\'hui',
      thisWeek: 'Cette Semaine',
      thisMonth: 'Ce Mois',
      recentOrders: 'Commandes Récentes',
      popularItems: 'Plats Populaires',
      tableStatus: 'Statut des Tables',
      orderStatus: 'Statut des Commandes',
    },
    menu: {
      title: 'Menu',
      subtitle: 'Gérez votre menu',
      addItem: 'Ajouter un Plat',
      editItem: 'Modifier le Plat',
      deleteItem: 'Supprimer le Plat',
      category: 'Catégorie',
      price: 'Prix',
      description: 'Description',
      image: 'Image',
      available: 'Disponible',
      unavailable: 'Non Disponible',
      categories: 'Catégories',
      allCategories: 'Toutes les Catégories',
      appetizers: 'Entrées',
      mainCourses: 'Plats Principaux',
      desserts: 'Desserts',
      beverages: 'Boissons',
    },
    tables: {
      title: 'Tables',
      subtitle: 'Gérez les tables du restaurant',
      addTable: 'Ajouter une Table',
      editTable: 'Modifier la Table',
      deleteTable: 'Supprimer la Table',
      tableNumber: 'Numéro de Table',
      capacity: 'Capacité',
      status: 'Statut',
      occupied: 'Occupée',
      available: 'Disponible',
      reserved: 'Réservée',
      maintenance: 'Maintenance',
      qrCode: 'Code QR',
      generateQR: 'Générer QR',
    },
    orders: {
      title: 'Commandes',
      subtitle: 'Gérez les commandes',
      newOrder: 'Nouvelle Commande',
      orderNumber: 'Numéro de Commande',
      tableNumber: 'Numéro de Table',
      customerName: 'Nom du Client',
      items: 'Articles',
      status: 'Statut',
      total: 'Total',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      pending: 'En Attente',
      confirmed: 'Confirmée',
      preparing: 'En Préparation',
      ready: 'Prête',
      served: 'Servie',
      completed: 'Terminée',
      cancelled: 'Annulée',
      paymentStatus: 'Statut de Paiement',
      paid: 'Payée',
      unpaid: 'Non Payée',
      paymentMethod: 'Méthode de Paiement',
      cash: 'Espèces',
      card: 'Carte',
      digital: 'Numérique',
    },
    settings: {
      title: 'Paramètres',
      subtitle: 'Configurez votre restaurant',
      restaurantInfo: 'Informations du Restaurant',
      restaurantName: 'Nom du Restaurant',
      restaurantDescription: 'Description du Restaurant',
      contactInfo: 'Informations de Contact',
      paymentSettings: 'Paramètres de Paiement',
      stripeConfig: 'Configuration Stripe',
      themeSettings: 'Paramètres de Thème',
      languageSettings: 'Paramètres de Langue',
      notifications: 'Notifications',
      backup: 'Sauvegarde',
      export: 'Exporter',
      import: 'Importer',
    },
    notifications: {
      newOrder: 'Nouvelle Commande',
      orderUpdate: 'Mise à Jour de Commande',
      paymentReceived: 'Paiement Reçu',
      lowStock: 'Stock Faible',
      tableOccupied: 'Table Occupée',
      tableAvailable: 'Table Disponible',
    },
    landing: {
      heroTitle: 'Votre plateforme de gestion de restaurant',
      heroSubtitle: 'Simplifiez la gestion de votre restaurant avec les meilleures fonctionnalités d\'automatisation et d\'analyse.',
      socialProof: 'Gérez plus de 100 restaurants avec un seul compte.',
      socialProofSetup: 'Configurez-le en quelques minutes et commencez à gérer votre restaurant.',
      pricing: 'Prix',
      login: 'Connexion',
      register: 'Inscription',
      tryFree: 'Essai Gratuit',
      about: 'À propos de nous',
      features: 'Fonctionnalités',
      aiFeatures: 'Fonctionnalités IA',
      qrCode: 'Générez des codes QR pour votre cuisine.',
      analytics: 'Analyses détaillées pour améliorer votre gestion.',
      multiLanguage: 'Support multi-langue pour le monde.',
      pricingTitle: 'Prix Accessibles',
      pricingSubtitle: 'Choisissez le plan qui correspond à vos besoins.',
      contactTitle: 'Contactez-nous',
      contactSubtitle: 'Avez-vous des questions ? Nous sommes là pour vous aider.',
    },
  },
  de: {
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      add: 'Hinzufügen',
      loading: 'Laden...',
      error: 'Fehler',
      success: 'Erfolg',
      confirm: 'Bestätigen',
      back: 'Zurück',
      next: 'Weiter',
      previous: 'Zurück',
      search: 'Suchen',
      filter: 'Filter',
      sort: 'Sortieren',
      actions: 'Aktionen',
      status: 'Status',
      date: 'Datum',
      time: 'Zeit',
      price: 'Preis',
      quantity: 'Menge',
      total: 'Gesamt',
      description: 'Beschreibung',
      name: 'Name',
      email: 'E-Mail',
      phone: 'Telefon',
      address: 'Adresse',
    },
    navigation: {
      dashboard: 'Dashboard',
      menu: 'Menü',
      tables: 'Tische',
      orders: 'Bestellungen',
      settings: 'Einstellungen',
      analytics: 'Analysen',
      profile: 'Profil',
      logout: 'Abmelden',
      reservations: 'Reservierungen',
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Restaurant-Übersicht',
      totalOrders: 'Gesamtbestellungen',
      totalRevenue: 'Gesamteinnahmen',
      activeTables: 'Aktive Tische',
      pendingOrders: 'Ausstehende Bestellungen',
      todayOrders: 'Heutige Bestellungen',
      todayRevenue: 'Heutige Einnahmen',
      thisWeek: 'Diese Woche',
      thisMonth: 'Dieser Monat',
      recentOrders: 'Neueste Bestellungen',
      popularItems: 'Beliebte Gerichte',
      tableStatus: 'Tischstatus',
      orderStatus: 'Bestellstatus',
    },
    menu: {
      title: 'Menü',
      subtitle: 'Verwalten Sie Ihr Menü',
      addItem: 'Gericht hinzufügen',
      editItem: 'Gericht bearbeiten',
      deleteItem: 'Gericht löschen',
      category: 'Kategorie',
      price: 'Preis',
      description: 'Beschreibung',
      image: 'Bild',
      available: 'Verfügbar',
      unavailable: 'Nicht verfügbar',
      categories: 'Kategorien',
      allCategories: 'Alle Kategorien',
      appetizers: 'Vorspeisen',
      mainCourses: 'Hauptgerichte',
      desserts: 'Desserts',
      beverages: 'Getränke',
    },
    tables: {
      title: 'Tische',
      subtitle: 'Verwalten Sie die Restaurant-Tische',
      addTable: 'Tisch hinzufügen',
      editTable: 'Tisch bearbeiten',
      deleteTable: 'Tisch löschen',
      tableNumber: 'Tischnummer',
      capacity: 'Kapazität',
      status: 'Status',
      occupied: 'Besetzt',
      available: 'Verfügbar',
      reserved: 'Reserviert',
      maintenance: 'Wartung',
      qrCode: 'QR-Code',
      generateQR: 'QR generieren',
    },
    orders: {
      title: 'Bestellungen',
      subtitle: 'Verwalten Sie Bestellungen',
      newOrder: 'Neue Bestellung',
      orderNumber: 'Bestellnummer',
      tableNumber: 'Tischnummer',
      customerName: 'Kundenname',
      items: 'Artikel',
      status: 'Status',
      total: 'Gesamt',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      pending: 'Ausstehend',
      confirmed: 'Bestätigt',
      preparing: 'In Vorbereitung',
      ready: 'Bereit',
      served: 'Serviert',
      completed: 'Abgeschlossen',
      cancelled: 'Storniert',
      paymentStatus: 'Zahlungsstatus',
      paid: 'Bezahlt',
      unpaid: 'Unbezahlt',
      paymentMethod: 'Zahlungsmethode',
      cash: 'Bargeld',
      card: 'Karte',
      digital: 'Digital',
    },
    settings: {
      title: 'Einstellungen',
      subtitle: 'Konfigurieren Sie Ihr Restaurant',
      restaurantInfo: 'Restaurant-Informationen',
      restaurantName: 'Restaurant-Name',
      restaurantDescription: 'Restaurant-Beschreibung',
      contactInfo: 'Kontaktinformationen',
      paymentSettings: 'Zahlungseinstellungen',
      stripeConfig: 'Stripe-Konfiguration',
      themeSettings: 'Theme-Einstellungen',
      languageSettings: 'Spracheinstellungen',
      notifications: 'Benachrichtigungen',
      backup: 'Backup',
      export: 'Exportieren',
      import: 'Importieren',
    },
    notifications: {
      newOrder: 'Neue Bestellung',
      orderUpdate: 'Bestellungsaktualisierung',
      paymentReceived: 'Zahlung erhalten',
      lowStock: 'Niedriger Bestand',
      tableOccupied: 'Tisch besetzt',
      tableAvailable: 'Tisch verfügbar',
    },
    landing: {
      heroTitle: 'Ihr Restaurant-Management-System',
      heroSubtitle: 'Vereinfachen Sie die Restaurant-Verwaltung mit den besten Automatisierungs- und Analysefunktionen.',
      socialProof: 'Verwalten Sie mehr als 100 Restaurants mit einem einzigen Konto.',
      socialProofSetup: 'Konfigurieren Sie es in wenigen Minuten und beginnen Sie mit der Verwaltung Ihres Restaurants.',
      pricing: 'Preise',
      login: 'Anmeldung',
      register: 'Registrierung',
      tryFree: 'Kostenlos testen',
      about: 'Über uns',
      features: 'Funktionen',
      aiFeatures: 'AI-Funktionen',
      qrCode: 'Generieren Sie QR-Codes für Ihre Küche.',
      analytics: 'Detaillierte Analysen zur Verbesserung Ihrer Verwaltung.',
      multiLanguage: 'Mehrsprachiger Support für das gesamte Land.',
      pricingTitle: 'Zugängliche Preise',
      pricingSubtitle: 'Wählen Sie das Paket, das zu Ihren Bedürfnissen passt.',
      contactTitle: 'Kontaktieren Sie uns',
      contactSubtitle: 'Haben Sie Fragen? Wir sind hier, um Ihnen zu helfen.',
    },
  },
};

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to Italian if translation not found
      value = getFallbackTranslation(key);
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

function getFallbackTranslation(key: string): string {
  const keys = key.split('.');
  let value: any = translations.it;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

export function getAvailableLanguages(): Array<{ code: Language; name: string; flag: string }> {
  return [
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  ];
} 