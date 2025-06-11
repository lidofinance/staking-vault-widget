import { forwardRef, useMemo, type ComponentProps } from 'react';
import { Button } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';
import { ConnectWalletButton } from 'shared/wallet';

import { useVaultPermissions } from '../hooks/use-vault-permissions';

import { VAULTS_ALL_ROLES, vaultTexts } from '../consts';

type MultiplePermissionedSubmitProps = {
  dashboardRoles: readonly VAULTS_ALL_ROLES[];
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

  const shouldShowPermissionError = Boolean(
    !isLoading && data && !data.hasPermissions && isAccountActive,
  );

  const missingRoles =
    data?.missingRoles.map((role) => vaultTexts.roles[role].title) ?? [];

  return (
    <ConnectWalletButton>
      <Button disabled={shouldDisable} ref={ref} {...rest}>
        {shouldShowPermissionError
          ? vaultTexts.common.errors.noRoles(missingRoles)
          : children}
      </Button>
    </ConnectWalletButton>
  );
});

type PermissionedSubmitProps = {
  dashboardRole: VAULTS_ALL_ROLES;
} & ComponentProps<typeof Button>;

export const PermissionedSubmitButton = forwardRef<
  HTMLButtonElement,
  PermissionedSubmitProps
>(({ dashboardRole, ...props }, ref) => {
  const roles = useMemo(() => [dashboardRole] as const, [dashboardRole]);
  return (
    <MultiplePermissionedSubmitButton
      dashboardRoles={roles}
      ref={ref}
      {...props}
    />
  );
});
