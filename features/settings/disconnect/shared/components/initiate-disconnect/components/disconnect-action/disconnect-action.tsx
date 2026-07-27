import { PermissionedSubmitButton } from 'modules/vaults';

import { useCheckAvailability, useVoluntaryDisconnect } from '../../hooks';

export const DisconnectAction = () => {
  const { isError, isLoading, isNeedSupplyForFees, hasMintedStETH } =
    useCheckAvailability();
  const { disconnect } = useVoluntaryDisconnect();
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
      variant="outlined"
      color="error"
      size="sm"
      fullwidth
    >
      {canProceed
        ? 'Initiate disconnection'
        : 'Meet requirements to initiate disconnect'}
    </PermissionedSubmitButton>
  );
};
