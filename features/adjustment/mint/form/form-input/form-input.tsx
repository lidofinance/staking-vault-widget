import { InputGroup } from '@lidofinance/lido-ui';
import { VAULT_MINT_TOKENS } from 'modules/vaults';
import { InputAmount } from 'shared/components';
import { TokenSelectHookForm } from 'shared/hook-form/controls';

export const FormInput = () => {
  return (
    <InputGroup>
      <TokenSelectHookForm options={VAULT_MINT_TOKENS} />
      <InputAmount label="ETH amount" />
    </InputGroup>
  );
};
