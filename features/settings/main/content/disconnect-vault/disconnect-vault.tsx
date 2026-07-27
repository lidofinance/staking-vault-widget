import { useCallback } from 'react';
import { Text, Button } from '@lidofinance/lido-ui';
import { useRouter } from 'next/router';

import { useVault, vaultTexts } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { Container, TextContainer } from './styles';

const { subTitle, subDescription, subNavigation } =
  vaultTexts.actions.settings.disconnect;

export const DisconnectVault = () => {
  const router = useRouter();
  const { vaultAddress } = useVault();

  const navigateToDisconnectPage = useCallback(() => {
    if (!vaultAddress) {
      return;
    }

    void router.push(
      appPaths.vaults.vault(vaultAddress).settings('disconnect'),
    );
  }, [router, vaultAddress]);

  return (
    <Container>
      <TextContainer>
        <Text size="sm" strong>
          {subTitle}
        </Text>
        <Text size="xxs" color="secondary">
          {subDescription}
        </Text>
      </TextContainer>
      <Button
        onClick={navigateToDisconnectPage}
        variant="outlined"
        size="sm"
        fullwidth
      >
        {subNavigation}
      </Button>
    </Container>
  );
};
