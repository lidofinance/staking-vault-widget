import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import invariant from 'tiny-invariant';
import { Button, Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { OverviewContent } from './content';

import { useVaultOverviewData } from './hooks';

import type {
  VaultOverviewContextType,
  VaultOverviewContextKeys,
  SectionData,
} from './types';

import { ErrorState } from './styles';

type MetricText = {
  title: string;
  learnMoreLink: string;
  description?: string;
  hint?: string;
};

const VaultOverviewContext = createContext<VaultOverviewContextType | null>(
  null,
);
VaultOverviewContext.displayName = 'VaultOverviewContext';

export const useVaultOverview = (): VaultOverviewContextType => {
  const context = useContext(VaultOverviewContext);
  invariant(
    context,
    'useVaultOverview must be used within an VaultOverviewProvider',
  );
  return context;
};

const getMetricTexts = (key: VaultOverviewContextKeys): MetricText => {
  const metric = vaultTexts.metrics[
    key as keyof typeof vaultTexts.metrics
  ] as MetricText;

  return metric ?? {};
};

export const VaultOverview: FC<PropsWithChildren> = () => {
  const {
    data: vaultData,
    isPending: isLoadingVault,
    error,
    refetch,
  } = useVaultOverviewData();

  useEffect(() => {
    if (error) {
      console.warn(
        '[VaultOverviewProvider] Error fetching overview data:',
        error,
      );
    }
  }, [error]);

  const value = useMemo(() => {
    return {
      values: vaultData,
      isLoadingVault: isLoadingVault,
      getVaultDataToRender: (sectionEntry: SectionData) => ({
        ...sectionEntry,
        ...getMetricTexts(sectionEntry.indicator),
        payload: vaultData?.[sectionEntry.indicator],
        isLoading: isLoadingVault,
      }),
    };
  }, [isLoadingVault, vaultData]);

  return (
    <VaultOverviewContext.Provider value={value}>
      {!error ? (
        <OverviewContent />
      ) : (
        <ErrorState>
          <Text color="error" size="xs" weight={700}>
            Failed to fetch data
          </Text>
          <Button
            color="error"
            variant="ghost"
            size="xs"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </ErrorState>
      )}
    </VaultOverviewContext.Provider>
  );
};
