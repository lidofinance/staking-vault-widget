import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import invariant from 'tiny-invariant';

import { vaultTexts } from 'modules/vaults';

import {
  OverviewContent,
  General,
  VaultDisconnected,
  ConnectVault,
  RetryFetching,
  VaultAddresses,
} from './content';
import { useVaultOverviewData } from './hooks';

import type {
  VaultOverviewContextType,
  VaultOverviewContextKeys,
  SectionData,
} from './types';

import { Content, OverviewContentWrapper } from './styles';

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
      <OverviewContentWrapper>
        <Content>
          <General />
          <VaultDisconnected />
          <OverviewContent />
          <RetryFetching />
        </Content>
        <ConnectVault />
      </OverviewContentWrapper>
      <VaultAddresses />
    </VaultOverviewContext.Provider>
  );
};
