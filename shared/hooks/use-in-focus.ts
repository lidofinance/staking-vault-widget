import { useMemo, useState } from 'react';

export const useInFocus = () => {
  const [inFocus, setInFocus] = useState(false);
  const { onBlur, onFocus } = useMemo(
    () => ({
      onFocus: () => setInFocus(true),
      onBlur: () => setInFocus(false),
    }),
    [],
  );
  return {
    inFocus,
    onBlur,
    onFocus,
  };
};
