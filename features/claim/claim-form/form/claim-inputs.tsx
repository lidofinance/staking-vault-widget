import { Input, Loader } from '@lidofinance/lido-ui';

import { useVaultInfo, vaultTexts } from 'modules/vaults';

const label = vaultTexts.actions.claim.addressLabel;

export const ClaimInputs = () => {
  const { activeVault, isLoadingVault } = useVaultInfo();

  return (
    <Input
      leftDecorator={isLoadingVault ? <Loader /> : null}
      label={label}
      value={activeVault?.nodeOperatorFeeRecipient}
      readOnly
      disabled
    />
  );
};
