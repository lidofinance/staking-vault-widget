import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const useSearchParams = () => {
  const { query, isReady } = useRouter();

  return useMemo(() => {
    if (!isReady) return {};

    return { query };
  }, [query, isReady]);
};
