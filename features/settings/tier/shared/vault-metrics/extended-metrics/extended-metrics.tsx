import { useMemo } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { calculateTierMetrics } from 'utils';
import type { Tier } from 'modules/vaults';
import { FormatToken } from 'shared/formatters';

import { useTierData } from 'features/settings/tier/contexts';

import { MintingCapacityTooltip } from './minting-capacity-tooltip';
import { OldToNew } from './old-to-new';

import { List, ListItem, ContentContainer } from './styles';

type ExtendedMetricsProps = {
  selectedTier: Tier | null;
  newVaultMintingLimit?: bigint;
  showRequestedVaultMintingLimit?: boolean;
};

export const ExtendedMetrics = ({
  selectedTier,
  newVaultMintingLimit,
  showRequestedVaultMintingLimit = false,
}: ExtendedMetricsProps) => {
  const { values } = useTierData();

  const newMetrics = useMemo(() => {
    const isSelectedNewTier =
      selectedTier?.id.toString() !== values?.vault.tierId.toString();

    if (!isSelectedNewTier || !values) return;

    return {
      ...calculateTierMetrics({
        newTier: selectedTier,
        vault: values.vault,
        newVaultMintingLimit,
      }),
      newTier: selectedTier,
    };
  }, [selectedTier, values, newVaultMintingLimit]);

  return (
    <List>
      {showRequestedVaultMintingLimit && !!newVaultMintingLimit && (
        <ListItem>
          <Text size="xxs" color="secondary">
            Requested stVault minting limit
          </Text>
          <ContentContainer>
            <Text size="xxs">
              <FormatToken
                amount={newVaultMintingLimit}
                maxDecimalDigits={2}
                symbol="stETH"
              />
            </Text>
          </ContentContainer>
        </ListItem>
      )}
      <ListItem>
        <Text size="xxs" color="secondary">
          stVault minting capacity
        </Text>
        <ContentContainer>
          {values?.vaultTotalMintingCapacityStETHValue && (
            <OldToNew
              old={values?.vaultTotalMintingCapacityStETHValue ?? ''}
              supposed={newMetrics?.newMintingCapacityValue}
            />
          )}

          <MintingCapacityTooltip
            tierId={newMetrics?.newTier?.id ?? values?.vault.tierId}
          />
        </ContentContainer>
      </ListItem>
      <ListItem>
        <Text size="xxs" color="secondary">
          Utilization ratio
        </Text>
        <ContentContainer>
          {values?.vaultUtilizationRatioValue && (
            <OldToNew
              old={values.vaultUtilizationRatioValue ?? ''}
              supposed={newMetrics?.newUtilizationValue}
            />
          )}
        </ContentContainer>
      </ListItem>
      <ListItem>
        <Text size="xxs" color="secondary">
          Reserve ratio
        </Text>
        <ContentContainer>
          {values?.vaultReserveRatioValue && selectedTier && (
            <OldToNew
              old={values.vaultReserveRatioValue ?? ''}
              supposed={newMetrics?.reserveRatioBPValue}
            />
          )}
        </ContentContainer>
      </ListItem>
      <ListItem>
        <Text size="xxs" color="secondary">
          Forced rebalance threshold
        </Text>
        <ContentContainer>
          {values?.vaultRebalanceThresholdValue && selectedTier && (
            <OldToNew
              old={values.vaultRebalanceThresholdValue ?? ''}
              supposed={newMetrics?.forcedRebalanceThresholdBPValue}
            />
          )}
        </ContentContainer>
      </ListItem>
      <ListItem>
        <Text size="xxs" color="secondary">
          Lido infrastructure fee
        </Text>
        <ContentContainer>
          {values?.vaultLidoInfraFeeValue && selectedTier && (
            <OldToNew
              old={values.vaultLidoInfraFeeValue ?? ''}
              supposed={newMetrics?.infraFeeBPValue}
            />
          )}
        </ContentContainer>
      </ListItem>
      <ListItem>
        <Text size="xxs" color="secondary">
          Lido liquidity fee
        </Text>
        <ContentContainer>
          {values?.vaultLidoLiquidityFeeValue && selectedTier && (
            <OldToNew
              old={values.vaultLidoLiquidityFeeValue ?? ''}
              supposed={newMetrics?.liquidityFeeBPValue}
            />
          )}
        </ContentContainer>
      </ListItem>
    </List>
  );
};
