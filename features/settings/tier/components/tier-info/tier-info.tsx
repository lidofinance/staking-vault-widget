import { vaultTexts } from 'modules/vaults';

import {
  ContentWrapper,
  SectionContainer,
} from 'features/settings/shared/components';
import { AlterTierInfo } from 'features/settings/tier/components/alter-tier-info';
import {
  ChooseTier,
  Title,
  VaultMetrics,
  TierFormAction,
  MintingLimit,
} from 'features/settings/tier/shared';

export const TierInfo = () => {
  return (
    <ContentWrapper>
      <SectionContainer data-testid="tierSection">
        <Title data-testid="title" as="h2">
          {vaultTexts.actions.tier.settingsTitle}
        </Title>
        <AlterTierInfo />
        <ChooseTier />
        <MintingLimit />
        <VaultMetrics />
        <TierFormAction />
      </SectionContainer>
    </ContentWrapper>
  );
};
