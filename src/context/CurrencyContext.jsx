import { availableCurrencies } from '@/components/custom/CurrencySelector';
import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('EUR');

  useEffect(() => {
    // Récupérer la devise depuis localStorage au démarrage
    const savedCurrency = localStorage.getItem('preferredCurrency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    
    // Optionnel: Détecter la devise géographique
    // const userLocale = navigator.language;
    // if (userLocale.includes('en-US') || userLocale.includes('en-CA')) {
    //   setCurrency('USD');
    // } else if (userLocale.includes('en-GB')) {
    //   setCurrency('GBP');
    // }
  }, []);

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
    localStorage.setItem('preferredCurrency', newCurrency);
    
    // Optionnel: Émettre un événement pour notifier d'autres composants
    window.dispatchEvent(new Event('currencyChanged'));
  };

  const formatPrice = (price, options = {}) => {
    const currentCurrency = availableCurrencies.find(c => c.code === currency);
    if (!currentCurrency) return `${price} ${currency}`;

    const formatter = new Intl.NumberFormat(currentCurrency.locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      ...options
    });

    return formatter.format(price);
  };

  const convertPrice = (price, fromCurrency, toCurrency = currency) => {
    // Taux de change fictifs - À remplacer par une API réelle
    const exchangeRates = {
      EUR: { USD: 1.08, GBP: 0.86, CAD: 1.46, XOF: 655.96, JPY: 161.5 },
      USD: { EUR: 0.93, GBP: 0.79, CAD: 1.35, XOF: 607.5, JPY: 149.5 },
      GBP: { EUR: 1.16, USD: 1.26, CAD: 1.70, XOF: 762.5, JPY: 187.8 },
      // Ajoutez d'autres taux...
    };

    if (fromCurrency === toCurrency) return price;
    
    const rate = exchangeRates[fromCurrency]?.[toCurrency];
    if (!rate) return price; // Retourne le prix d'origine si le taux n'est pas disponible
    
    return price * rate;
  };

  const value = {
    currency,
    changeCurrency,
    formatPrice,
    convertPrice,
    symbol: availableCurrencies.find(c => c.code === currency)?.symbol || '€'
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};