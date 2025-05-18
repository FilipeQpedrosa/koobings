export const MAX_PRICE = 999999.99; // Maximum allowed price

export interface PriceValidationResult {
  isValid: boolean;
  value: number;
  error?: string;
}

/**
 * Validates if a price value is valid with detailed error information
 * @param price The price to validate
 * @returns Validation result with parsed value and error message if invalid
 */
export const validatePrice = (price: number | string): PriceValidationResult => {
  const numPrice = typeof price === 'string' ? Number(price.replace(/[^0-9.-]+/g, '')) : price;

  if (isNaN(numPrice)) {
    return {
      isValid: false,
      value: 0,
      error: 'Invalid price format'
    };
  }

  if (numPrice < 0) {
    return {
      isValid: false,
      value: 0,
      error: 'Price cannot be negative'
    };
  }

  if (numPrice > MAX_PRICE) {
    return {
      isValid: false,
      value: 0,
      error: `Price cannot exceed ${MAX_PRICE}`
    };
  }

  return {
    isValid: true,
    value: numPrice
  };
};

/**
 * Simple validation check for price value
 * @param price The price to validate
 * @returns True if price is valid, false otherwise
 */
export const isValidPrice = (price: number | string): boolean => {
  const { isValid } = validatePrice(price);
  return isValid;
};

/**
 * Safely converts a price value to a number
 * @param price The price to parse
 * @param defaultValue Optional default value if parsing fails (defaults to 0)
 * @returns The parsed price number or default value
 */
export const parsePrice = (price: unknown, defaultValue: number = 0): number => {
  if (typeof price === 'number' && !isNaN(price)) {
    return Math.min(Math.max(price, 0), MAX_PRICE);
  }
  if (typeof price === 'string') {
    const { isValid, value } = validatePrice(price);
    return isValid ? value : defaultValue;
  }
  return defaultValue;
}; 