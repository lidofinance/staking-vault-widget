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

const tierTexts = vaultTexts.actions.tier;

export const RequestChangeLimit = () => {
  const [showAdditionalInfo, setAdditionalInfoVisibility] = useState(false);
  const { data: noTiersInfo } = useNodeOperatorTiersInfo();
  const { data: vaultTierInfo } = useVaultTierInfo();
  const { address } = useAccount();
  const { hasAdmin, isNodeOperator } = useVaultConfirmingRoles();
  const { hasPermission: hasVaultConfigurationPermission } =
    useVaultPermission('vaultConfiguration');

  const proposal = vaultTierInfo?.proposals.lastProposal;
  const { decodedData, member: proposer } = proposal ?? {};
  const isUpdateShareLimit =
    decodedData?.functionName === 'updateVaultShareLimit';
  const proposedTierId = decodedData?.args[1];
  const proposedVaultMintingLimitStETH =
    vaultTierInfo?.proposals.proposedVaultLimitStETH;
  const proposedTier =
    noTiersInfo?.tiers.find((tier) => tier.id === proposedTierId) ??
    vaultTierInfo?.tier;
  const isTheSameUser = proposer === address;

  if (
    !proposedTier ||
    !(isNodeOperator || hasAdmin || hasVaultConfigurationPermission)
  )
    return null;

  const buttonText = showAdditionalInfo
    ? tierTexts.request.showButton.hide
    : isTheSameUser
      ? tierTexts.request.showButton.show
      : tierTexts.request.showButton.review;

  const isShowAdditionalInfoComp =
    showAdditionalInfo && proposal && !!proposedVaultMintingLimitStETH;

  const headingText = isUpdateShareLimit
    ? `${tierTexts.requestChangeLimitTitle}`
    : `${tierTexts.requestMovingTierTitle} ${proposedTier?.tierName}`;

  return (
    <RequestWrapper data-testid="requestWrapper">
      <HeadingSection>
        <Title as="h2" data-testid="title">
          {headingText}
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
