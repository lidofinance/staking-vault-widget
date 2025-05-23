import { forwardRef, type ComponentProps } from 'react';
import { Button } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';
import { ConnectWalletButton } from 'shared/wallet';

import {
  useVaultPermission,
  useVaultPermissions,
} from '../hooks/use-vault-permissions';

import { VAULTS_ALL_ROLES, vaultTexts } from '../consts';

type PermissionedSubmitProps = {
  dashboardRole: VAULTS_ALL_ROLES;
} & ComponentProps<typeof Button>;

export const PermissionedSubmitButton = forwardRef<
  HTMLButtonElement,
  PermissionedSubmitProps
>((props, ref) => {
  const { children, dashboardRole, disabled, ...rest } = props;
  const { isAccountActive } = useDappStatus();
  const { hasPermission, isLoading } = useVaultPermission(dashboardRole);

  const shouldDisable =
    disabled || !isAccountActive || isLoading || !hasPermission;

  const shouldShowPermissionError =
    !isLoading && !hasPermission && isAccountActive;

  const roleTitle = vaultTexts.roles[dashboardRole].title;

  return (
    <ConnectWalletButton>
      <Button disabled={shouldDisable} ref={ref} {...rest}>
        {shouldShowPermissionError
          ? `You don't have ${roleTitle} role`
          : children}
      </Button>
    </ConnectWalletButton>
  );
});

type MultiplePermissionedSubmitProps = {
  dashboardRoles: VAULTS_ALL_ROLES[];
} & ComponentProps<typeof Button>;

export const MultiplePermissionedSubmitButton = forwardRef<
  HTMLButtonElement,
  MultiplePermissionedSubmitProps
>((props, ref) => {
  const { children, dashboardRoles, disabled, ...rest } = props;
  const { isAccountActive } = useDappStatus();
  const { data, isLoading } = useVaultPermissions(dashboardRoles);

  const shouldDisable =
    disabled || !isAccountActive || isLoading || !data?.hasPermissions;

  const shouldShowPermissionError =
    !isLoading && data && !data.hasPermissions && isAccountActive;

  const missingRoles = data?.missingRoles
    .map((role) => vaultTexts.roles[role].title)
    .join(', ');

  return (
    <ConnectWalletButton>
      <Button disabled={shouldDisable} ref={ref} {...rest}>
        {shouldShowPermissionError
          ? `You don't have ${missingRoles} role${data && data.missingRoles.length > 1 ? 's' : ''}`
          : children}
      </Button>
    </ConnectWalletButton>
  );
});
