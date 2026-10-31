import { useFormContext, useWatch } from 'react-hook-form';

import {
  AddressInputHookForm,
  CheckboxHookForm,
  TokenAmountInputGroup,
} from 'shared/hook-form/controls';
import { InlineLoader } from 'shared/components';
import {
  useEthBalanceWarning,
  useVaultPermission,
  VAULT_FUNDING_TOKENS,
  vaultTexts,
} from 'modules/vaults';

import { useSupplyForm } from './supply-form-provider';
import type { SupplyFormValidatedValues } from './types';

export const SupplyFormInputs = () => {
  const { balanceQuery, isStethMintableQuery } = useSupplyForm();
  const { hasPermission: canSupply, isLoading: isSupplyRoleLoading } =
    useVaultPermission('supplier');
  const { hasPermission: canMint, isLoading: isMintRoleLoading } =
    useVaultPermission('minter');
  const isRolesLoading = isSupplyRoleLoading || isMintRoleLoading;
  const {
    formState: { disabled },
  } = useFormContext<SupplyFormValidatedValues>();

  const [mintSteth, amount, token] = useWatch<
    SupplyFormValidatedValues,
    ['mintSteth', 'amount', 'token']
  >({
    name: ['mintSteth', 'amount', 'token'],
  });

  const ethBalanceWarning = useEthBalanceWarning(
    token === 'ETH' ? amount : undefined,
  );

  const isStethMintable = isStethMintableQuery.data === true;
  const maxValue = balanceQuery.data;
  const isMintOptionHidden = canSupply && !canMint;

  return (
    <>
      <TokenAmountInputGroup
        amountFieldName="amount"
        tokenFieldName="token"
        tokenOptions={VAULT_FUNDING_TOKENS}
        maxAmount={maxValue}
        disabled={disabled}
        warning={ethBalanceWarning}
      />
      <InlineLoader
        isLoading={isRolesLoading}
        showBy={!isMintOptionHidden}
        height={24}
        width="100%"
      >
        <>
          <CheckboxHookForm
            fieldName="mintSteth"
            data-testid="mintStethCheckbox"
            label={vaultTexts.actions.supply.mint.isMint}
            disabled={!isStethMintable || !canMint}
          />
          <AddressInputHookForm
            hidden={!mintSteth}
            label={vaultTexts.actions.supply.mint.mintTo}
            fieldName="mintAddress"
          />
        </>
      </InlineLoader>
    </>
  );
};
