import { Input, Loader } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { useClaimData } from './hooks';

const label = vaultTexts.actions.claim.addressLabel;

export const ClaimInputs = () => {
  const { recipientQuery } = useClaimData();

  return (
    <Input
      leftDecorator={recipientQuery.isLoading ? <Loader /> : null}
      label={label}
      value={recipientQuery.data}
      readOnly
      disabled
    />
  );
};
