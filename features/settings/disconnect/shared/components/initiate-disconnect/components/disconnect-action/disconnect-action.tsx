import { PermissionedSubmitButton } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';

import { useCheckAvailability, useVoluntaryDisconnect } from '../../hooks';

export const DisconnectAction = () => {
  const { isError, isLoading, isNeedSupplyForFees, hasMintedStETH } =
    useCheckAvailability();
  const { disconnect } = useVoluntaryDisconnect();
  const { isDappActive } = useDappStatus();
  const canProceed = !isNeedSupplyForFees && !hasMintedStETH;

  if (isError) {
    return null;
  }

  return (
    <PermissionedSubmitButton
      onClick={disconnect}
      loading={isLoading}
      dashboardRole="volunataryDisconnecter"
      disabled={!canProceed}
      variant={isDappActive ? 'outlined' : 'filled'}
      color="error"
      size="sm"
      fullwidth
      data-testid="submit"
    >
      {canProceed
        ? 'Initiate disconnection'
        : 'Meet requirements to initiate disconnect'}
    </PermissionedSubmitButton>
  );
};
