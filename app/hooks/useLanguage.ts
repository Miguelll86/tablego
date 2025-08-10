'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language, getTranslation, getAvailableLanguages } from '../lib/i18n';

interface LanguageStore {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  availableLanguages: ReturnType<typeof getAvailableLanguages>;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: 'it',
      availableLanguages: getAvailableLanguages(),
      setLanguage: (language: Language) => {
        set({ currentLanguage: language });
        
        // Aggiorna l'attributo lang del documento
        if (typeof document !== 'undefined') {
          document.documentElement.lang = language;
        }
      },
      t: (key: string) => {
        const { currentLanguage } = get();
        return getTranslation(currentLanguage, key);
      },
    }),
    {
      name: 'tablego-language',
    }
  )
);

// Hook per inizializzare la lingua al caricamento
export const useLanguageInit = () => {
  const { currentLanguage, setLanguage } = useLanguage();
  
  useEffect(() => {
    setLanguage(currentLanguage);
  }, [currentLanguage, setLanguage]);
}; 