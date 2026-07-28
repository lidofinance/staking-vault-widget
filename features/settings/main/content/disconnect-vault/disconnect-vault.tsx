import { useCallback } from 'react';
import { Text, Button } from '@lidofinance/lido-ui';
import { useRouter } from 'next/router';

import { StatusBadge, InlineLoader } from 'shared/components';
import { useVault, vaultTexts } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { DISCONNECT_STATUS } from 'features/settings/shared/const';
import { useDisconnectStatus } from 'features/settings/shared/hooks';

import { Container, TextContainer, TitleWrapper } from './styles';

const { subTitle, subDescription, navigation } =
  vaultTexts.actions.settings.disconnect;

export const DisconnectVault = () => {
  const router = useRouter();
  const { vaultAddress } = useVault();
  const { status, isLoading } = useDisconnectStatus();

  const isDisconnectInitiated =
    !!status && status !== DISCONNECT_STATUS.NOT_INITIATED;
  const isDisconnectCompleted = status === DISCONNECT_STATUS.COMPLETED;
  const btnVariant =
    isDisconnectInitiated && !isDisconnectCompleted ? 'filled' : 'outlined';
  const btnText = !isDisconnectInitiated
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
          <InlineLoader isLoading={isLoading} height={24} width={100}>
            {isDisconnectInitiated && (
              <StatusBadge status={status} size="small" />
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
