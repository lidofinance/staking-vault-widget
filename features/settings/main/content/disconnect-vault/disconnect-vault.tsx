import { useCallback } from 'react';
import { Text, Button, Loader } from '@lidofinance/lido-ui';
import { useRouter } from 'next/router';
import { isAddressEqual } from 'viem';

import { StatusBadge, InlineLoader } from 'shared/components';
import { useVault, useVaultConfirmingRoles, vaultTexts } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { appPaths } from 'consts/routing';

import { DISCONNECT_STATUS } from 'features/settings/shared/const';
import { useDisconnectStatus } from 'features/settings/shared/hooks';

import { Container, TextContainer, TitleWrapper } from './styles';

const { subTitle, subDescription, navigation } =
  vaultTexts.actions.settings.disconnect;

const getNavigationText = ({
  isViewOnly,
  isDisconnectInitiated,
  isDisconnectCompleted,
}: {
  isViewOnly: boolean;
  isDisconnectInitiated: boolean;
  isDisconnectCompleted: boolean;
}) => {
  if (isViewOnly || isDisconnectCompleted) return navigation.view;
  if (isDisconnectInitiated) return navigation.disconnectInitiated;
  return navigation.connected;
};

export const DisconnectVault = () => {
  const router = useRouter();
  const { vaultAddress, activeVault, isPending } = useVault();
  const { isDappActive, address } = useDappStatus();
  const { hasAdmin } = useVaultConfirmingRoles();
  const { status, isLoading } = useDisconnectStatus();

  const isDisconnectInitiated =
    !!status && status !== DISCONNECT_STATUS.NOT_INITIATED;
  const isDisconnectCompleted = status === DISCONNECT_STATUS.COMPLETED;
  const isViewOnly =
    !isDappActive ||
    (!hasAdmin &&
      !(
        activeVault &&
        address &&
        isAddressEqual(address, activeVault.vaultOwner)
      ));

  const btnVariant =
    !isViewOnly && isDisconnectInitiated && !isDisconnectCompleted
      ? 'filled'
      : 'outlined';

  const btnText = getNavigationText({
    isViewOnly,
    isDisconnectInitiated,
    isDisconnectCompleted,
  });

  const showLoader = isLoading || isPending;

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
        style={{ display: 'flex', justifyContent: 'center' }}
        size="sm"
        fullwidth
      >
        {showLoader ? <Loader size="small" /> : btnText}
      </Button>
    </Container>
  );
};
