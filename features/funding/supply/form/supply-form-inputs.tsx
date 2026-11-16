import { useConnection } from 'wagmi';
import { useFormContext, useWatch } from 'react-hook-form';

import {
  AddressInputHookForm,
  CheckboxHookForm,
  TokenAmountInputGroup,
} from 'shared/hook-form/controls';
import { InlineLoader } from 'shared/components';
import { useWalletRestoring } from 'shared/hooks/use-wallet-restoring';
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
  const { hasPermission: canSupply, isPending: isSupplyRolePending } =
    useVaultPermission('supplier');
  const { hasPermission: canMint, isPending: isMintRolePending } =
    useVaultPermission('minter');
  const { status } = useConnection();
  const isWalletRestoring = useWalletRestoring();
  // the roles queries stay disabled until the vault base data and the wallet
  // address are available, and isLoading is false for disabled queries, so
  // isPending must be used to also cover that window — otherwise the
  // checkbox flashes for supply-only users on every page load
  const isRolesLoading =
    (isSupplyRolePending || isMintRolePending) &&
    // the roles can never resolve for a disconnected wallet, so fall back to
    // the pre-connect UI instead of loading forever
    (status !== 'disconnected' || isWalletRestoring);
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
        width={170}
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
