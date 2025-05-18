export type CurrencyCode = 'EUR' | 'USD' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  position: 'prefix' | 'suffix';
  locale: string;
  decimalPlaces: number;
}

export const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  EUR: {
    code: 'EUR',
    symbol: '€',
    position: 'prefix',
    locale: 'de-DE',
    decimalPlaces: 2
  },
  USD: {
    code: 'USD',
    symbol: '$',
    position: 'prefix',
    locale: 'en-US',
    decimalPlaces: 2
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    position: 'prefix',
    locale: 'en-GB',
    decimalPlaces: 2
  }
};

/**
 * Formats a number as a localized currency string
 * @param amount The amount to format
 * @param currencyCode The currency code to use for formatting
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currencyCode: CurrencyCode = 'EUR'): string => {
  const config = CURRENCY_CONFIGS[currencyCode];
  
  const formatted = new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: config.decimalPlaces,
    maximumFractionDigits: config.decimalPlaces
  }).format(amount);

  return formatted;
};

/**
 * Parses a localized currency string back to a number
 * @param value The currency string to parse
 * @param currencyCode The currency code to use for parsing
 * @returns Parsed number value
 */
export const parseCurrency = (value: string, currencyCode: CurrencyCode = 'EUR'): number => {
  const config = CURRENCY_CONFIGS[currencyCode];
  
  // Remove currency symbol and any non-numeric characters except decimal separator
  const cleaned = value.replace(config.symbol, '').replace(/[^0-9.,]/g, '');
  
  // Convert to standard decimal format
  const standardized = config.locale.startsWith('de') 
    ? cleaned.replace('.', '').replace(',', '.') // German format
    : cleaned.replace(',', '');
    
  return Number(standardized);
}; 