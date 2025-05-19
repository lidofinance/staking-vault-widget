import { forwardRef, type ComponentProps } from 'react';
import { Button } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';
import { ConnectWalletButton } from 'shared/wallet';

import {
  useVaultPermission,
  useVaultPermissions,
} from '../hooks/use-vault-permissions';
import { VAULTS_ALL_ROLES } from '../consts';

type PermissionedSubmitProps = {
  dashboardRole: VAULTS_ALL_ROLES;
} & ComponentProps<typeof Button>;

const capitilize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

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

  return (
    <ConnectWalletButton>
      <Button disabled={shouldDisable} ref={ref} {...rest}>
        {shouldShowPermissionError
          ? `You don't have ${capitilize(dashboardRole)} role`
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

  return (
    <ConnectWalletButton>
      <Button disabled={shouldDisable} ref={ref} {...rest}>
        {shouldShowPermissionError
          ? `You don't have ${data?.missingRoles.map(capitilize).join(', ')} role${data && data.missingRoles.length > 1 ? 's' : ''}`
          : children}
      </Button>
    </ConnectWalletButton>
  );
});
