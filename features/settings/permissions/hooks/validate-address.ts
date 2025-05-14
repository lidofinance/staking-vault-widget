import { useState, useCallback } from 'react';
import { isAddress, Address } from 'viem';
import { DUPLICATED_ADDRESS_MESSAGE, INVALID_ADDRESS_MESSAGE } from '../consts';
import { FieldSchema } from '../types';

export const useAddressValidation = (
  fields: (Record<'id', string> & FieldSchema)[],
) => {
  const [inputError, setInputError] = useState<string>('');

  const resetError = useCallback(() => {
    setInputError('');
  }, []);

  const validateInputValue = useCallback(
    (value: string): value is Address => {
      const trimmed = value.trim();

      if (trimmed === '') {
        return false;
      }

      if (!isAddress(trimmed)) {
        setInputError(INVALID_ADDRESS_MESSAGE);
        return false;
      }

      const alreadyExists = fields.some((field) => field.account === trimmed);
      if (alreadyExists) {
        setInputError(DUPLICATED_ADDRESS_MESSAGE);
        return false;
      }

      setInputError('');
      return true;
    },
    [fields],
  );

  return { inputError, resetError, validateInputValue };
};
