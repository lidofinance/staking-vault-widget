import { forwardRef, useMemo, type ComponentProps } from 'react';
import { Button } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';
import { ConnectWalletButton } from 'shared/wallet';

import { useVaultPermissions } from '../hooks';
import { VAULTS_ALL_ROLES, vaultTexts } from '../consts';

import { SubmitButton } from './styles';

type MultiplePermissionedSubmitProps = {
  dashboardRoles: readonly VAULTS_ALL_ROLES[];
  isPermissionless?: boolean;
} & ComponentProps<typeof Button>;

export const MultiplePermissionedSubmitButton = forwardRef<
  HTMLButtonElement,
  MultiplePermissionedSubmitProps
>((props, ref) => {
  const {
    children,
    dashboardRoles,
    disabled,
    onClick,
    isPermissionless,
    ...rest
  } = props;
  const { isAccountActive } = useDappStatus();
  const { data, isLoading } = useVaultPermissions(dashboardRoles);

  const shouldDisable =
    disabled ||
    !isAccountActive ||
    (!isPermissionless && (isLoading || !data?.hasPermissions));

  const shouldShowPermissionError = Boolean(
    !isPermissionless &&
      !isLoading &&
      data &&
      !data.hasPermissions &&
      isAccountActive,
  );

  const missingRoles =
    data?.missingRoles.map((role) => vaultTexts.roles[role].buttonText) ?? [];

  return (
    <ConnectWalletButton {...rest}>
      <SubmitButton
        type="submit"
        disabled={shouldDisable}
        ref={ref}
        onClick={onClick}
        {...rest}
      >
        {shouldShowPermissionError
          ? vaultTexts.common.errors.noRoles(missingRoles)
          : children}
      </SubmitButton>
    </ConnectWalletButton>
  );
});

type PermissionedSubmitProps = {
  dashboardRole: VAULTS_ALL_ROLES;
} & Omit<MultiplePermissionedSubmitProps, 'dashboardRoles'>;

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
