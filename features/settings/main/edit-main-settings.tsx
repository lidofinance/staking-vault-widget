import { Text } from '@lidofinance/lido-ui';

import { useVault, vaultTexts } from 'modules/vaults';

import {
  Addresses,
  Pdg,
  VotingList,
  MainSettingsAction,
  DisconnectVault,
} from 'features/settings/main/content';
import {
  SectionContainer,
  ContentWrapper,
} from 'features/settings/shared/components';
import {
  MainSettingsDataProvider,
  MainSettingsProvider,
} from 'features/settings/main/contexts';

const texts = vaultTexts.actions.settings;
export const EditMainSettings = () => {
  const { activeVault } = useVault();
  const { isVaultDisconnected = false, isPendingDisconnect = false } =
    activeVault ?? {};

  if (isVaultDisconnected || isPendingDisconnect) {
    return null;
  }

  return (
    <>
      <MainSettingsDataProvider>
        <MainSettingsProvider>
          <ContentWrapper>
            <SectionContainer>
              <Text size="lg" strong data-testid="mainSettingsTitle">
                {texts.title}
              </Text>
              <Pdg />
              <Addresses />
              <VotingList />
              <MainSettingsAction />
            </SectionContainer>
          </ContentWrapper>
        </MainSettingsProvider>
      </MainSettingsDataProvider>
      <ContentWrapper>
        <SectionContainer>
          <DisconnectVault />
        </SectionContainer>
      </ContentWrapper>
    </>
  );
};
