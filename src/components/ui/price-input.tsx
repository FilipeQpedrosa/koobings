import { useState, useEffect } from 'react';
import { Input } from './input';
import { validatePrice, type PriceValidationResult } from '@/lib/utils/validation';

interface PriceInputProps {
  value: number;
  onChange: (value: number) => void;
  onValidationChange?: (result: PriceValidationResult) => void;
  className?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  showError?: boolean;
}

export function PriceInput({
  value,
  onChange,
  onValidationChange,
  className = '',
  placeholder = 'Enter price',
  required = false,
  disabled = false,
  showError = true,
}: PriceInputProps) {
  const [inputValue, setInputValue] = useState(value.toString());
  const [validation, setValidation] = useState<PriceValidationResult>({ isValid: true, value });

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Only validate non-empty values unless required
    if (newValue === '' && !required) {
      const result = { isValid: true, value: 0 };
      setValidation(result);
      onValidationChange?.(result);
      onChange(0);
      return;
    }

    const result = validatePrice(newValue);
    setValidation(result);
    onValidationChange?.(result);

    if (result.isValid) {
      onChange(result.value);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
        <Input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className={`pl-7 ${className} ${validation.error && showError ? 'border-red-500' : ''}`}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
        />
      </div>
      {validation.error && showError && (
        <p className="mt-1 text-sm text-red-500">{validation.error}</p>
      )}
    </div>
  );
} 