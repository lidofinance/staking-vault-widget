import { useState, useMemo, useCallback } from 'react';

import { SortConfig } from 'features/home/vault-table/types';
import { VaultInfo } from 'types';

export const useTableSort = (
  items: VaultInfo[],
  initialSortConfig: SortConfig,
) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(initialSortConfig);

  const handleSort = useCallback((key: keyof VaultInfo) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  }, []);

  const sortedItems = useMemo(() => {
    if (!sortConfig.key) {
      return items;
    }

    const { key } = sortConfig;
    return [...items].sort((a, b) => {
      let aValue = a[key] ?? 0;
      let bValue = b[key] ?? 0;

      if (sortConfig.direction !== 'asc') {
        const temp = aValue;
        aValue = bValue;
        bValue = temp;
      }

      if (aValue > bValue) {
        return 1;
      } else if (bValue > aValue) {
        return -1;
      }

      return 0;
    });
  }, [items, sortConfig]);

  return { sortedItems, sortConfig, handleSort };
};
