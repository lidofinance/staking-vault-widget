import { useMemo } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { calculateTierMetrics } from 'utils';
import { FormatToken } from 'shared/formatters';
import type { Tier } from 'modules/vaults';

import { useTierData } from 'features/settings/tier/contexts';

import { MintingCapacityTooltip } from './minting-capacity-tooltip';
import { OldToNew } from './old-to-new';

import { List, ListItem, ContentContainer } from './styles';

type ExtendedMetricsProps = {
  selectedTier: Tier | null;
  newVaultMintingLimit?: bigint;
  showRequestedVaultMintingLimit?: boolean;
  forceShowChanges?: boolean;
  dataTestId?: string;
};

export const ExtendedMetrics = ({
  selectedTier,
  newVaultMintingLimit,
  showRequestedVaultMintingLimit = false,
  forceShowChanges = false,
  dataTestId,
}: ExtendedMetricsProps) => {
  const { values } = useTierData();

  const newMetrics = useMemo(() => {
    if (!values) return;

    const tier = selectedTier || values.tier;

    return calculateTierMetrics({
      tier,
      vault: values.vault,
      newVaultMintingLimit,
    });
  }, [selectedTier, values, newVaultMintingLimit]);

  const showChanges = forceShowChanges || selectedTier?.id !== values?.tier.id;

  return (
    <List>
      {showRequestedVaultMintingLimit &&
        !!newVaultMintingLimit &&
        newVaultMintingLimit !== values?.vault.totalMintingCapacityStETH && (
          <ListItem
            data-testid={
              dataTestId
                ? `${dataTestId}-requestedStVaultMintingLimit-listItem`
                : undefined
            }
          >
            <Text size="xxs" color="secondary">
              Requested stVault minting limit
            </Text>
            <ContentContainer>
              <Text
                size="xxs"
                data-testid={
                  dataTestId
                    ? `${dataTestId}-requestedStVaultMintingLimit`
                    : undefined
                }
              >
                <FormatToken
                  amount={newVaultMintingLimit}
                  maxDecimalDigits={4}
                  symbol="stETH"
                />
              </Text>
            </ContentContainer>
          </ListItem>
        )}
      {!!newMetrics && (
        <>
          <ListItem
            data-testid={
              dataTestId
                ? `${dataTestId}-stVaultMintingCapacity-listItem`
                : undefined
            }
          >
            <Text size="xxs" color="secondary">
              stVault minting capacity
            </Text>
            <ContentContainer>
              <OldToNew
                old={
                  <FormatToken
                    amount={newMetrics.totalMintingCapacity.oldValue}
                    maxDecimalDigits={4}
                    showAmountTip
                    symbol="stETH"
                  />
                }
                supposed={
                  <FormatToken
                    amount={newMetrics.totalMintingCapacity.newValue}
                    maxDecimalDigits={4}
                    showAmountTip
                    symbol="stETH"
                  />
                }
                isChanged={newMetrics.totalMintingCapacity.isChanged}
                dataTestId={
                  dataTestId
                    ? `${dataTestId}-stVaultMintingCapacity`
                    : undefined
                }
              />
              <MintingCapacityTooltip
                tierId={selectedTier?.id ?? values?.vault.tierId}
              />
            </ContentContainer>
          </ListItem>
          <ListItem
            data-testid={
              dataTestId ? `${dataTestId}-utilizationRatio-listItem` : undefined
            }
          >
            <Text size="xxs" color="secondary">
              Utilization ratio
            </Text>
            <ContentContainer>
              {values?.vaultUtilizationRatioValue && (
                <OldToNew
                  old={newMetrics.utilization.oldValue}
                  supposed={newMetrics.utilization.newValue}
                  isChanged={newMetrics.utilization.isChanged}
                  dataTestId={
                    dataTestId ? `${dataTestId}-utilizationRatio` : undefined
                  }
                />
              )}
            </ContentContainer>
          </ListItem>
          <ListItem
            data-testid={
              dataTestId ? `${dataTestId}-reserveRatio-listItem` : undefined
            }
          >
            <Text size="xxs" color="secondary">
              Reserve ratio
            </Text>
            <ContentContainer>
              <OldToNew
                old={newMetrics.reserveRatioBP.oldValue}
                supposed={newMetrics.reserveRatioBP.newValue}
                isChanged={showChanges && newMetrics.reserveRatioBP.isChanged}
                dataTestId={
                  dataTestId ? `${dataTestId}-reserveRatio` : undefined
                }
              />
            </ContentContainer>
          </ListItem>
          <ListItem
            data-testid={
              dataTestId
                ? `${dataTestId}-forcedRebalanceThreshold-listItem`
                : undefined
            }
          >
            <Text size="xxs" color="secondary">
              Forced rebalance threshold
            </Text>
            <ContentContainer>
              <OldToNew
                old={newMetrics.forcedRebalanceThresholdBP.oldValue}
                supposed={newMetrics.forcedRebalanceThresholdBP.newValue}
                isChanged={
                  showChanges && newMetrics.forcedRebalanceThresholdBP.isChanged
                }
                dataTestId={
                  dataTestId
                    ? `${dataTestId}-forcedRebalanceThreshold`
                    : undefined
                }
              />
            </ContentContainer>
          </ListItem>
          <ListItem
            data-testid={
              dataTestId ? `${dataTestId}-infraFee-listItem` : undefined
            }
          >
            <Text size="xxs" color="secondary">
              Lido infrastructure fee
            </Text>
            <ContentContainer>
              <OldToNew
                old={newMetrics.infraFeeBP.oldValue}
                supposed={newMetrics.infraFeeBP.newValue}
                isChanged={showChanges && newMetrics.infraFeeBP.isChanged}
                dataTestId={dataTestId ? `${dataTestId}-infraFee` : undefined}
              />
            </ContentContainer>
          </ListItem>
          <ListItem
            data-testid={
              dataTestId ? `${dataTestId}-liquidityFee-listItem` : undefined
            }
          >
            <Text size="xxs" color="secondary">
              Lido liquidity fee
            </Text>
            <ContentContainer>
              <OldToNew
                old={newMetrics.liquidityFeeBP.oldValue}
                supposed={newMetrics.liquidityFeeBP.newValue}
                isChanged={showChanges && newMetrics.liquidityFeeBP.isChanged}
                dataTestId={
                  dataTestId ? `${dataTestId}-liquidityFee` : undefined
                }
              />
            </ContentContainer>
          </ListItem>
        </>
      )}
    </List>
  );
};
