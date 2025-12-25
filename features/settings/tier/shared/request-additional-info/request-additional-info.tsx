import { Text, Divider } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import type { ExtendTierConfirmation, Tier } from 'modules/vaults';

import { ExpiresInItem } from './content/expires-in-item';
import { RequestBy } from './content/request-by';
import { VaultInfo } from './vault-info';

import {
  ExtendedMetrics,
  OldToNew,
} from 'features/settings/tier/shared/vault-metrics/extended-metrics';
import { useTierData } from '../../contexts';

import { ApproveRequest } from './approve-request';
import {
  ContentContainer,
  List,
  ListContainer,
  ListItem,
  Wrapper,
} from './styles';

type RequestAdditionalInfoProps = {
  proposedTier: Tier;
  vaultLiabilityStETH: bigint;
  proposal: ExtendTierConfirmation;
};

export const RequestAdditionalInfo = ({
  proposedTier,
  vaultLiabilityStETH,
  proposal,
}: RequestAdditionalInfoProps) => {
  const { values } = useTierData();

  const {
    functionName,
    proposedVaultLimitStETH,
    expiryTimestamp,
    member: requestedBy,
  } = proposal;
  const tierMintingLimit = proposedTier.shareLimitStETH;
  const tierRemainingCapacity =
    proposedTier.shareLimitStETH - proposedTier.liabilityStETH;
  const newTierRemainingCapacity = tierRemainingCapacity - vaultLiabilityStETH;
  const isDifferentRemainingCapacity =
    newTierRemainingCapacity !== tierRemainingCapacity;

  // show proposed vault minting limit if it's different from the proposed tier minting limit
  const showProposedVaultMintingLimit =
    proposedTier?.shareLimitStETH !== proposedVaultLimitStETH;

  const vaultLimitStETH =
    functionName === 'syncTier'
      ? values?.vault.totalMintingCapacityStETH
      : proposedVaultLimitStETH;

  return (
    <Wrapper>
      <ListContainer>
        <List>
          <ListItem>
            <Text size="xxs" color="secondary">
              Tier minting limit
            </Text>
            <ContentContainer>
              <Text size="xxs">
                <FormatToken
                  amount={tierMintingLimit}
                  maxDecimalDigits={4}
                  symbol="stETH"
                />
              </Text>
            </ContentContainer>
          </ListItem>
          {functionName === 'changeTier' && (
            <ListItem>
              <Text size="xxs" color="secondary">
                Tier remaining capacity
              </Text>
              <ContentContainer>
                <OldToNew
                  old={
                    <FormatToken
                      amount={tierRemainingCapacity}
                      maxDecimalDigits={4}
                      symbol="stETH"
                    />
                  }
                  supposed={
                    <FormatToken
                      amount={newTierRemainingCapacity}
                      maxDecimalDigits={4}
                      symbol="stETH"
                    />
                  }
                  isChanged={isDifferentRemainingCapacity}
                />
              </ContentContainer>
            </ListItem>
          )}
        </List>
      </ListContainer>
      <Divider />
      <VaultInfo />
      <Divider />
      <ListContainer>
        <ExtendedMetrics
          selectedTier={proposedTier}
          newVaultMintingLimit={vaultLimitStETH}
          showRequestedVaultMintingLimit={showProposedVaultMintingLimit}
          forceShowChanges
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
