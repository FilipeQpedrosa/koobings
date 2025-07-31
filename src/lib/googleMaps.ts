/**
 * Google Maps address validation utility
 */

interface GoogleMapsValidationResult {
  isValid: boolean;
  formattedAddress?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  error?: string;
}

/**
 * Validates an address using Google Maps Geocoding API
 */
export async function validateAddress(address: string): Promise<GoogleMapsValidationResult> {
  if (!address.trim()) {
    return {
      isValid: false,
      error: 'Morada não pode estar vazia'
    };
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Maps API key not configured');
    return {
      isValid: true, // Allow fallback when API key is not configured
      formattedAddress: address
    };
  }

  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`
    );

    const data = await response.json();

    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        isValid: true,
        formattedAddress: result.formatted_address,
        coordinates: {
          lat: result.geometry.location.lat,
          lng: result.geometry.location.lng
        }
      };
    } else if (data.status === 'ZERO_RESULTS') {
      return {
        isValid: false,
        error: 'Morada não encontrada. Verifique se a morada está correta.'
      };
    } else if (data.status === 'OVER_QUERY_LIMIT') {
      console.warn('Google Maps API quota exceeded');
      return {
        isValid: true, // Allow fallback when quota is exceeded
        formattedAddress: address
      };
    } else {
      return {
        isValid: false,
        error: `Erro na validação: ${data.status}`
      };
    }
  } catch (error) {
    console.error('Google Maps validation error:', error);
    return {
      isValid: true, // Allow fallback on network errors
      formattedAddress: address
    };
  }
}

/**
 * Client-side address validation hook
 */
export function useAddressValidation() {
  const validateAddressClient = async (address: string): Promise<GoogleMapsValidationResult> => {
    try {
      const response = await fetch('/api/validate-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        throw new Error('Validation request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Address validation error:', error);
      return {
        isValid: true, // Fallback to allow address
        formattedAddress: address
      };
    }
  };

  return { validateAddress: validateAddressClient };
} 