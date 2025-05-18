import { formatCurrency, type CurrencyCode } from './currency';

export const formatPrice = (price: number, currencyCode: CurrencyCode = 'EUR'): string => {
  return formatCurrency(price, currencyCode);
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 
    ? `${hours}h ${remainingMinutes}min`
    : `${hours}h`;
}; 