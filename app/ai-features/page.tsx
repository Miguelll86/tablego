'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AIFeatures() {
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [localizedMenu, setLocalizedMenu] = useState<any>(null);
  const [seasonalAnalysis, setSeasonalAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const testAIOptimization = async () => {
    setLoading('ai');
    try {
      const response = await fetch('/api/ai/optimize-menu?restaurantId=rest-test-1');
      const data = await response.json();
      
      if (data.success) {
        setAiSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Errore AI optimization:', error);
    } finally {
      setLoading(null);
    }
  };

  const testMultiLanguageMenu = async () => {
    setLoading('menu');
    try {
      const response = await fetch('/api/menu/localized?tableId=table-1');
      const data = await response.json();
      
      if (data.success) {
        setLocalizedMenu(data.menu);
      }
    } catch (error) {
      console.error('Errore multi-language menu:', error);
    } finally {
      setLoading(null);
    }
  };



  const testSeasonalAnalysis = async () => {
    setLoading('seasonal');
    try {
      const response = await fetch('/api/ai/seasonal-analysis?restaurantId=rest-test-1');
      const data = await response.json();
      
      if (data.success) {
        setSeasonalAnalysis(data);
      }
    } catch (error) {
      console.error('Errore seasonal analysis:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🧠 Funzionalità AI di Tablo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Testa le funzionalità inedite che rendono Tablo unico
          </p>
          <Link 
            href="/demo-request" 
            className="inline-block bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-orange-700 hover:to-red-700 transform hover:scale-105 transition-all duration-300 shadow-xl"
          >
            🎯 Prova Gratis 7 Giorni - Testa Tutte le AI Features
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* AI Menu Optimization */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <div className="text-3xl mb-4">🤖</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              AI Menu Optimization
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Analizza vendite, meteo e stagionalità per ottimizzare il tuo menu
            </p>
            
            <button
              onClick={testAIOptimization}
              disabled={loading === 'ai'}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
            >
              {loading === 'ai' ? 'Analizzando...' : 'Testa AI Optimization'}
            </button>

            {aiSuggestions.length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                  Suggerimenti AI:
                </h3>
                <div className="space-y-3">
                  {aiSuggestions.slice(0, 3).map((suggestion, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                          suggestion.impact === 'HIGH' ? 'bg-red-100 text-red-800' :
                          suggestion.impact === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {suggestion.impact}
                        </span>
                        <span className="text-sm text-gray-500">
                          +€{suggestion.predictedRevenue}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {suggestion.suggestedAction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Multi-Language QR Menu */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <div className="text-3xl mb-4">🌍</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Multi-Language QR Menu
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Menu che si adatta automaticamente alla lingua e valuta del cliente
            </p>
            
            <button
              onClick={testMultiLanguageMenu}
              disabled={loading === 'menu'}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all disabled:opacity-50"
            >
              {loading === 'menu' ? 'Caricando...' : 'Testa Multi-Language'}
            </button>

            {localizedMenu && (
              <div className="mt-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                  Menu Localizzato:
                </h3>
                <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Lingua:</strong> {localizedMenu.language}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Valuta:</strong> {localizedMenu.currency}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    <strong>Items:</strong> {localizedMenu.items?.length || 0}
                  </p>
                </div>
              </div>
            )}
          </div>



          {/* Seasonal Analysis */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6">
            <div className="text-3xl mb-4">🍃</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Seasonal Analysis
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Analizza stagionalità delle materie prime per ottimizzare costi
            </p>
            
            <button
              onClick={testSeasonalAnalysis}
              disabled={loading === 'seasonal'}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-teal-600 transition-all disabled:opacity-50"
            >
              {loading === 'seasonal' ? 'Analizzando...' : 'Testa Seasonal Analysis'}
            </button>

            {seasonalAnalysis && (
              <div className="mt-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                  Analisi Stagionale:
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Mese corrente:</strong> {seasonalAnalysis.currentMonth}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Impatto costi:</strong> +{seasonalAnalysis.analysis.costImpact}%
                    </p>
                  </div>
                  {seasonalAnalysis.suggestions.slice(0, 2).map((suggestion: string, index: number) => (
                    <div key={index} className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Comparison */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Perché Tablo è Unico
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🚀 Funzionalità Inedite
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  AI che ottimizza menu in tempo reale
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  QR code che si adatta alla lingua
                </li>

                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Predizione domanda basata su meteo
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                💡 Vantaggi Competitivi
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Aumento vendite del 25% con AI
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Riduzione errori ordini del 80%
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Migliore esperienza clienti
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">→</span>
                  Ottimizzazione automatica costi
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 