import { Button } from '@lidofinance/lido-ui';
import {
  DashboardRoles,
  useVaultPermission,
  useVaultPermissions,
} from '../hooks/use-vault-permissions';

import { forwardRef, type ComponentProps } from 'react';
import { useDappStatus } from 'modules/web3';

type PermissionedSubmitProps = {
  dashboardRole: DashboardRoles;
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
    <Button disabled={shouldDisable} ref={ref} {...rest}>
      {shouldShowPermissionError
        ? `You don't have ${capitilize(dashboardRole)} role`
        : children}
    </Button>
  );
});

type MultiplePermissionedSubmitProps = {
  dashboardRoles: DashboardRoles[];
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
    <Button disabled={shouldDisable} ref={ref} {...rest}>
      {shouldShowPermissionError
        ? `You don't have ${data?.missingRoles.map(capitilize).join(', ')} role${data && data.missingRoles.length > 1 ? 's' : ''}`
        : children}
    </Button>
  );
});
