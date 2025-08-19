import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import invariant from 'tiny-invariant';

import { vaultTexts } from 'modules/vaults';
import { useVaultTierInfo } from 'features/settings/tier/hooks';
import { Tier } from 'features/settings/tier/hooks/types';

import type {
  TierDataContextType,
  VaultTierDataKeys,
  SectionData,
} from '../types';

type MetricText = {
  title: string;
};

const TierDataContext = createContext<TierDataContextType | null>(null);
TierDataContext.displayName = 'TierDataContext';

export const useTierData = (): TierDataContextType => {
  const context = useContext(TierDataContext);
  invariant(context, 'useTierData must be used within an TierDataProvider');
  return context;
};

const getMetricTexts = (key: VaultTierDataKeys): MetricText => {
  const metric = vaultTexts.actions.tier.fields[
    key as keyof typeof vaultTexts.actions.tier.fields
  ] as MetricText;

  return metric ?? {};
};

export const TierDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const {
    data: tierData,
    isPending: isLoadingVault,
    error,
  } = useVaultTierInfo();
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  useEffect(() => {
    setSelectedTier(tierData?.tier ?? null);
  }, [tierData]);

  useEffect(() => {
    if (error) {
      console.warn('[TierDataProvider] Error fetching tier data:', error);
    }
  }, [error]);

  const value = useMemo(() => {
    return {
      values: tierData,
      isLoadingVault: isLoadingVault,
      getTierDataToRender: (sectionEntry: SectionData) => ({
        ...sectionEntry,
        ...getMetricTexts(sectionEntry.indicator),
        payload: tierData?.[sectionEntry.indicator].toString(),
        isLoading: isLoadingVault,
      }),
      selectedTier,
      setSelectedTier,
    };
  }, [isLoadingVault, tierData, selectedTier]);

  return (
    <TierDataContext.Provider value={value}>
      {children}
    </TierDataContext.Provider>
  );
};
