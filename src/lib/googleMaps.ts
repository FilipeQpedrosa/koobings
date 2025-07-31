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
    console.warn('Google Maps API key not configured - using basic validation');
    // Basic manual validation when API key is not available
    return validateAddressManually(address);
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
      return validateAddressManually(address);
    } else {
      return {
        isValid: false,
        error: `Erro na validação: ${data.status}`
      };
    }
  } catch (error) {
    console.error('Google Maps validation error:', error);
    return validateAddressManually(address);
  }
}

/**
 * Basic manual address validation when Google Maps is not available
 */
function validateAddressManually(address: string): GoogleMapsValidationResult {
  const trimmed = address.trim();
  
  // Very basic validation rules for Portuguese addresses
  const hasStreetAndNumber = /^.+[,\s]+\d+/.test(trimmed) || /\d+.*[,\s]+.+/.test(trimmed);
  const hasMinLength = trimmed.length >= 8;
  const hasLetters = /[a-zA-ZÀ-ÿ]/.test(trimmed);
  const hasNumbers = /\d/.test(trimmed);
  
  // Common Portuguese address patterns
  const hasPortuguesePattern = /(?:rua|avenida|av|largo|praça|travessa|estrada|alameda)/i.test(trimmed);
  
  if (hasMinLength && hasLetters && hasNumbers && (hasStreetAndNumber || hasPortuguesePattern)) {
    return {
      isValid: true,
      formattedAddress: trimmed,
    };
  } else {
    let error = 'Formato de morada inválido. ';
    
    if (!hasMinLength) {
      error += 'Morada muito curta. ';
    }
    if (!hasLetters) {
      error += 'Deve conter letras. ';
    }
    if (!hasNumbers) {
      error += 'Deve conter números. ';
    }
    if (!hasStreetAndNumber && !hasPortuguesePattern) {
      error += 'Use o formato: "Rua/Avenida Nome, Número, Localidade".';
    }
    
    return {
      isValid: false,
      error: error.trim()
    };
  }
}

/**
 * Get address suggestions for autocomplete
 */
export function getAddressSuggestions(input: string): string[] {
  const trimmed = input.toLowerCase().trim();
  
  if (trimmed.length < 2) return [];
  
  // Common Portuguese street types and names
  const streetSuggestions = [
    // Common street types with popular names
    'Rua da Liberdade',
    'Rua do Comércio', 
    'Rua da Igreja',
    'Rua da Escola',
    'Rua Principal',
    'Rua Central',
    'Rua da Ponte',
    'Rua do Sol',
    'Rua da Paz',
    'Rua das Flores',
    'Avenida da República',
    'Avenida da Liberdade',
    'Avenida Central',
    'Avenida do Mar',
    'Avenida Principal',
    'Praça da República',
    'Praça do Município',
    'Praça Central',
    'Largo da Igreja',
    'Largo do Pelourinho',
    'Travessa da Igreja',
    'Travessa do Porto',
    'Estrada Nacional',
    'Estrada Municipal',
    'Alameda das Árvores',
    
    // Major cities completion
    'Rua da Saudade, Lisboa',
    'Avenida da Boavista, Porto',
    'Rua de Santa Catarina, Porto',
    'Rua Augusta, Lisboa',
    'Avenida Almirante Reis, Lisboa',
    'Rua do Ouro, Lisboa',
    'Avenida dos Aliados, Porto',
    'Rua Direita, Braga',
    'Avenida da Liberdade, Braga',
    'Rua do Souto, Braga',
    'Avenida Central, Aveiro',
    'Rua Direita, Coimbra',
    'Rua Ferreira Borges, Coimbra',
    'Avenida Sá da Bandeira, Coimbra',
    'Rua 25 de Abril, Faro',
    'Avenida 5 de Outubro, Faro',
  ];
  
  // Filter suggestions based on input
  const filtered = streetSuggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(trimmed)
  );
  
  // If input looks like a street type, suggest completions
  const streetTypes = ['rua', 'avenida', 'av', 'praça', 'largo', 'travessa', 'estrada', 'alameda'];
  const matchingType = streetTypes.find(type => type.startsWith(trimmed));
  
  if (matchingType) {
    const typeCompletions = streetSuggestions.filter(s => 
      s.toLowerCase().startsWith(matchingType)
    ).slice(0, 8);
    return [...new Set([...typeCompletions, ...filtered])].slice(0, 10);
  }
  
  // Add number suggestions if the input looks like a street name
  if (filtered.length > 0 && !trimmed.includes(',') && !/\d/.test(trimmed)) {
    const withNumbers = filtered.slice(0, 3).flatMap(street => [
      `${street}, 1`,
      `${street}, 10`,
      `${street}, 25`,
      `${street}, 50`,
      `${street}, 100`
    ]);
    return [...filtered.slice(0, 5), ...withNumbers].slice(0, 10);
  }
  
  return filtered.slice(0, 10);
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