import { LockSmall } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { CreateVaultInput } from './create-vault-input';

const texts = vaultTexts.actions.createVault.fields.lidoCoreConnectionDeposit;

export const ConnectionDeposit = () => {
  return (
    <CreateVaultInput
      name="connectionDeposit"
      dataType="number"
      dataTestId="createVault-connectionDeposit"
      rightDecorator={<LockSmall />}
      disabled
      {...texts}
    />
  );
};
