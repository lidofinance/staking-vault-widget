import { useEffect, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';

export const useDebouncedValue = <T>(value: T, delayMs: number) => {
  const [v, s] = useState(value);
  const deb = useMemo(() => debounce((_v) => s(_v), delayMs), [delayMs]);
  deb(value);
  useEffect(() => {
    return () => {
      deb.flush();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [delayMs]);
  return v;
};
