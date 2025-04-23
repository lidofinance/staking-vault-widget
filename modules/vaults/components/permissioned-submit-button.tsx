import { Button } from '@lidofinance/lido-ui';
import {
  DashboardRoles,
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
  const { hasPermission, isLoading } = useVaultPermissions(dashboardRole);

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
