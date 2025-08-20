import { Text, Divider } from '@lidofinance/lido-ui';
import { Address } from 'viem';

import { ExpiresInItem } from './content/expires-in-item';
import { RequestBy } from './content/request-by';
import { VaultInfo } from './vault-info';

import {
  ExtendedMetrics,
  OldToNew,
} from 'features/settings/tier/shared/vault-metrics/extended-metrics';

import { Tier } from 'features/settings/tier/hooks/types';
import { toStethValue } from 'utils';

import {
  ContentContainer,
  List,
  ListContainer,
  ListItem,
  Wrapper,
} from './styles';
import { useEditTierSettings } from '../../hooks';
import { ApproveRequest } from './approve-request/approve-request';

type RequestAdditionalInfoProps = {
  proposedTier: Tier;
  expiryTimestamp: bigint;
  requestedBy: Address;
  vaultLiabilityStETH: bigint;
  proposedVaultMintingLimitStETH: bigint;
};

export const RequestAdditionalInfo = ({
  proposedTier,
  expiryTimestamp,
  requestedBy,
  vaultLiabilityStETH,
  proposedVaultMintingLimitStETH,
}: RequestAdditionalInfoProps) => {
  useEditTierSettings();
  const tierMintingLimit = proposedTier.shareLimitStETH;
  const tierMintingLimitValue = toStethValue(tierMintingLimit);
  const tierRemainingCapacity =
    proposedTier.shareLimitStETH - proposedTier.liabilityStETH;
  const newTierRemainingCapacity = tierRemainingCapacity - vaultLiabilityStETH;
  const tierRemainingCapacityValue = toStethValue(tierRemainingCapacity, false);
  const newTierRemainingCapacityValue = toStethValue(newTierRemainingCapacity);

  // show proposed vault minting limit if it's different from the proposed tier minting limit
  const showProposedVaultMintingLimit =
    proposedTier?.shareLimitStETH !== proposedVaultMintingLimitStETH;

  return (
    <Wrapper>
      <ListContainer>
        <List>
          <ListItem>
            <Text size="xxs" color="secondary">
              Tier minting limit
            </Text>
            <ContentContainer>
              <Text size="xxs">{tierMintingLimitValue}</Text>
            </ContentContainer>
          </ListItem>
          <ListItem>
            <Text size="xxs" color="secondary">
              Tier remaining capacity
            </Text>
            <ContentContainer>
              <OldToNew
                old={tierRemainingCapacityValue}
                supposed={newTierRemainingCapacityValue}
              />
            </ContentContainer>
          </ListItem>
        </List>
      </ListContainer>
      <Divider />
      <VaultInfo />
      <Divider />
      <ListContainer>
        <ExtendedMetrics
          selectedTier={proposedTier}
          newVaultMintingLimit={proposedVaultMintingLimitStETH}
          showRequestedVaultMintingLimit={showProposedVaultMintingLimit}
        />
      </ListContainer>
      <Divider />
      <ListContainer>
        <List>
          <ListItem>
            <Text size="xxs" color="secondary">
              Request by
            </Text>
            <ContentContainer>
              <RequestBy address={requestedBy} />
            </ContentContainer>
          </ListItem>
          <ListItem>
            <Text size="xxs" color="secondary">
              Expires in
            </Text>
            <ContentContainer>
              <ExpiresInItem expiryTimestamp={expiryTimestamp} />
            </ContentContainer>
          </ListItem>
        </List>
      </ListContainer>
      <ListContainer>
        <ApproveRequest />
      </ListContainer>
    </Wrapper>
  );
};
