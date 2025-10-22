import { useState } from 'react';
import { Text, Divider } from '@lidofinance/lido-ui';
import { useAccount } from 'wagmi';

import {
  useVaultConfirmingRoles,
  useNodeOperatorTiersInfo,
  useVaultTierInfo,
  vaultTexts,
  useVaultPermission,
} from 'modules/vaults';

import { SectionContainer } from 'features/settings/shared/components';
import { Title, RequestAdditionalInfo } from 'features/settings/tier/shared';

import { ExpiresInItem } from 'features/settings/tier/shared/request-additional-info/content/expires-in-item/expires-in-item';

import {
  RequestWrapper,
  HeadingSection,
  ExpiresContainer,
  ButtonStyled,
} from './styles';

export const RequestChangeLimit = () => {
  const [showAdditionalInfo, setAdditionalInfoVisibility] = useState(false);
  const { data: noTiersInfo } = useNodeOperatorTiersInfo();
  const { data: vaultTierInfo } = useVaultTierInfo();
  const { address } = useAccount();
  const { hasAdmin, isNodeOperator } = useVaultConfirmingRoles();
  const { hasPermission: hasVaultConfigurationPermission } =
    useVaultPermission('vaultConfiguration');

  const proposal = vaultTierInfo?.proposals.lastProposal;
  const proposedTierId = proposal?.decodedData.args[1];
  const proposedVaultMintingLimitStETH =
    vaultTierInfo?.proposals.proposedVaultLimitStETH;
  const proposedTier = noTiersInfo?.tiers.find(
    (tier) => tier.id === proposedTierId,
  );
  const proposer = proposal?.member;
  const isTheSameUser = proposer === address;

  if (
    !proposedTier ||
    !(isNodeOperator || hasAdmin || hasVaultConfigurationPermission)
  )
    return null;

  const buttonText = showAdditionalInfo
    ? vaultTexts.actions.tier.request.showButton.hide
    : isTheSameUser
      ? vaultTexts.actions.tier.request.showButton.show
      : vaultTexts.actions.tier.request.showButton.review;

  const isShowAdditionalInfoComp =
    showAdditionalInfo && proposal && !!proposedVaultMintingLimitStETH;

  return (
    <RequestWrapper data-testid="requestWrapper">
      <HeadingSection>
        <Title as="h2" data-testid="title">
          {vaultTexts.actions.tier.requestTitle} {proposedTier?.tierName}
        </Title>
        <ExpiresContainer>
          <Text data-testid="expiresInLabel" size="xxs">
            Expires in
          </Text>
          <ExpiresInItem
            data-testid="expiresInValue"
            expiryTimestamp={proposal?.expiryTimestamp}
            strong
          />
        </ExpiresContainer>
      </HeadingSection>
      <Divider />
      {isShowAdditionalInfoComp && (
        <RequestAdditionalInfo
          proposedTier={proposedTier}
          expiryTimestamp={proposal.expiryTimestamp}
          requestedBy={proposal.member}
          vaultLiabilityStETH={vaultTierInfo?.vault.liabilityStETH}
          proposedVaultMintingLimitStETH={proposedVaultMintingLimitStETH}
        />
      )}
      <Divider />
      <SectionContainer>
        <ButtonStyled
          variant="ghost"
          onClick={() => setAdditionalInfoVisibility(!showAdditionalInfo)}
          data-testid="reviewRequestBtn"
        >
          {buttonText}
        </ButtonStyled>
      </SectionContainer>
    </RequestWrapper>
  );
};
