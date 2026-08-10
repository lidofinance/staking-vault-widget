import { useCallback } from 'react';
import { Text, Button, Loader } from '@lidofinance/lido-ui';
import { useRouter } from 'next/router';
import { isAddressEqual } from 'viem';

import { StatusBadge, InlineLoader } from 'shared/components';
import {
  useVault,
  useVaultConfirmingRoles,
  useVaultPermission,
  vaultTexts,
} from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { appPaths } from 'consts/routing';

import { DISCONNECT_STATUS } from 'features/settings/shared/const';
import { useDisconnectStatus } from 'features/settings/shared/hooks';

import { BadgeWrapper, Container, TextContainer, TitleWrapper } from './styles';

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
  const { hasPermission } = useVaultPermission('volunataryDisconnecter');
  const { status, isLoading } = useDisconnectStatus();

  const isDisconnectInitiated =
    !!status && status !== DISCONNECT_STATUS.NOT_INITIATED;
  const isDisconnectCompleted = status === DISCONNECT_STATUS.COMPLETED;
  const isViewOnly =
    !isDappActive ||
    (!(hasAdmin || hasPermission) &&
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
    <Container data-testid="disconnect-entry">
      <TextContainer>
        <TitleWrapper>
          <Text size="sm" strong data-testid="title">
            {subTitle}
          </Text>
          <BadgeWrapper data-testid="status-badge">
            <InlineLoader isLoading={isLoading} height={24} width={100}>
              {isDisconnectInitiated && (
                <StatusBadge status={status} size="small" />
              )}
            </InlineLoader>
          </BadgeWrapper>
        </TitleWrapper>
        {!isDisconnectCompleted && (
          <Text size="xxs" color="secondary" data-testid="description">
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
        data-testid="nav-button"
      >
        {showLoader ? <Loader size="small" /> : btnText}
      </Button>
    </Container>
  );
};
