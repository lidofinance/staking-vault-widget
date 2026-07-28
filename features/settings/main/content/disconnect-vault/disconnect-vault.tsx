import { useCallback } from 'react';
import { Text, Button } from '@lidofinance/lido-ui';
import { useRouter } from 'next/router';

import { StatusBadge, InlineLoader } from 'shared/components';
import { useVault, vaultTexts } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { Container, TextContainer, TitleWrapper } from './styles';

const { subTitle, subDescription, navigation } =
  vaultTexts.actions.settings.disconnect;

export const DisconnectVault = () => {
  const router = useRouter();
  const { isLoading, isPending, vaultAddress, activeVault } = useVault();
  const { isPendingDisconnect, isVaultDisconnected, isVaultConnected } =
    activeVault ?? {};
  const showLoader = isLoading || isPending;
  const isDisconnectInitiated = isPendingDisconnect || isVaultDisconnected;
  // TODO: get complete disconnect status
  const isDisconnectCompleted = isVaultDisconnected;
  const btnVariant =
    isDisconnectInitiated && !isDisconnectCompleted ? 'filled' : 'outlined';
  const btnText =
    isVaultConnected && !isPendingDisconnect
      ? navigation.connected
      : isDisconnectCompleted
        ? navigation.disconnected
        : navigation.disconnectInitiated;

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
        <TitleWrapper>
          <Text size="sm" strong>
            {subTitle}
          </Text>
          <InlineLoader isLoading={showLoader} height={24} width={100}>
            {isDisconnectInitiated && (
              <StatusBadge status="ongoing" size="small" />
            )}
          </InlineLoader>
        </TitleWrapper>
        {!isDisconnectCompleted && (
          <Text size="xxs" color="secondary">
            {subDescription}
          </Text>
        )}
      </TextContainer>
      <Button
        onClick={navigateToDisconnectPage}
        variant={btnVariant}
        size="sm"
        fullwidth
      >
        {btnText}
      </Button>
    </Container>
  );
};
