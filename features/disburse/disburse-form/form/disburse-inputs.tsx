import { Input, Loader } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { useClaimData } from './hooks';

const label = vaultTexts.actions.disburse.addressLabel;

export const DisburseInputs = () => {
  const { recipientQuery } = useClaimData();

  return (
    <Input
      leftDecorator={recipientQuery.isPending ? <Loader /> : null}
      label={label}
      value={recipientQuery.data}
      readOnly
      disabled
      data-testid="claimInput"
    />
  );
};
