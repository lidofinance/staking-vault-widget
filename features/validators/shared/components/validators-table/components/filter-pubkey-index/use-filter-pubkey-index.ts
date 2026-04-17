import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { isHex } from 'viem';

import { useValidators } from 'features/validators/contexts';
import { useDebouncedValue } from 'shared/hooks';
import {
  numberRegex,
  VALIDATOR_PUBKEY_LENGTH,
} from 'features/validators/const';

const DEBOUNCE_DELAY_MS = 500;
const INVALID_FILTER_MESSAGE = 'Enter a valid validator index or public key';

const parseFilterValue = (value: string) => {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return { isValid: true } as const;
  }

  if (numberRegex.test(normalizedValue)) {
    const index = Number(normalizedValue);

    if (Number.isSafeInteger(index)) {
      return { isValid: true, index } as const;
    }

    return {
      isValid: false,
      error: INVALID_FILTER_MESSAGE,
    } as const;
  }

  const pubkey = normalizedValue.toLowerCase();

  if (isHex(pubkey) && pubkey.length === VALIDATOR_PUBKEY_LENGTH) {
    return { isValid: true, pubkey: pubkey } as const;
  }

  return {
    isValid: false,
    error: INVALID_FILTER_MESSAGE,
  } as const;
};

export const useFilterPubkeyIndex = () => {
  const { params, setFilterByPubKeyOrIndex } = useValidators();
  const inputValue = useMemo(() => {
    if (params.pubkey) {
      return params.pubkey;
    }

    if (params.index != null) {
      return String(params.index);
    }

    return '';
  }, [params.index, params.pubkey]);
  const [value, setValue] = useState(() => inputValue);
  const debouncedValue = useDebouncedValue(value, DEBOUNCE_DELAY_MS);

  const validationResult = useMemo(
    () => parseFilterValue(debouncedValue),
    [debouncedValue],
  );

  useEffect(() => {
    setValue(inputValue);
  }, [inputValue]);

  useEffect(() => {
    if (validationResult.isValid) {
      if (
        validationResult.pubkey === params.pubkey &&
        validationResult.index === params.index
      ) {
        return;
      }

      void setFilterByPubKeyOrIndex({
        pubkey: validationResult.pubkey,
        index: validationResult.index,
      });
      return;
    }

    if (params.pubkey == null && params.index == null) {
      return;
    }

    void setFilterByPubKeyOrIndex({
      pubkey: undefined,
      index: undefined,
    });
  }, [params.index, params.pubkey, setFilterByPubKeyOrIndex, validationResult]);

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  }, []);

  const handleClear = useCallback(() => {
    setValue('');
  }, []);

  return {
    value,
    error: !validationResult.isValid && validationResult.error,
    handleChange,
    handleClear,
  };
};
