import { useState } from 'react';
import { Text, Divider } from '@lidofinance/lido-ui';

import {
  useVaultConfirmingRoles,
  useVaultTierInfo,
  vaultTexts,
  useVaultPermission,
} from 'modules/vaults';

import { SectionContainer } from 'features/settings/shared/components';
import { Title, RequestAdditionalInfo } from 'features/settings/tier/shared';
import { useTierVoting } from 'features/settings/tier/hooks';

import { ExpiresInItem } from 'features/settings/tier/shared/request-additional-info/content/expires-in-item/expires-in-item';

import {
  RequestWrapper,
  HeadingSection,
  ExpiresContainer,
  ButtonStyled,
} from './styles';

const tierTexts = vaultTexts.actions.tier;

export const VotingRequest = () => {
  const [showAdditionalInfo, setAdditionalInfoVisibility] = useState(false);
  const { data: vaultTierInfo } = useVaultTierInfo();
  const { hasAdmin, isNodeOperator } = useVaultConfirmingRoles();
  const { hasPermission: hasVaultConfigurationPermission } =
    useVaultPermission('vaultConfiguration');
  const tierVoting = useTierVoting();
  if (!tierVoting) {
    return null;
  }

  const { proposal, proposedTier, isTheSameUser } = tierVoting;

  if (
    !proposal ||
    !proposedTier ||
    !vaultTierInfo ||
    vaultTierInfo?.vault.isPendingConnect ||
    !(isNodeOperator || hasAdmin || hasVaultConfigurationPermission)
  )
    return null;

  const buttonText = showAdditionalInfo
    ? tierTexts.request.showButton.hide
    : isTheSameUser
      ? tierTexts.request.showButton.show
      : tierTexts.request.showButton.review;

  const headingText = tierTexts.tierVotingTitle(
    proposal.functionName,
    proposedTier.tierName,
  );

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
            expiryTimestamp={proposal.expiryTimestamp}
            strong
          />
        </ExpiresContainer>
      </HeadingSection>
      <Divider />
      {showAdditionalInfo && (
        <RequestAdditionalInfo
          proposedTier={proposedTier}
          proposal={proposal}
          vaultLiabilityStETH={vaultTierInfo.vault.liabilityStETH}
        />
      )}
      <Divider />
      <SectionContainer>
        <ButtonStyled
          variant="ghost"
          onClick={() => setAdditionalInfoVisibility(!showAdditionalInfo)}
          data-testid="toggleRequestDetailsButton"
        >
          {buttonText}
        </ButtonStyled>
      </SectionContainer>
    </RequestWrapper>
  );
};
