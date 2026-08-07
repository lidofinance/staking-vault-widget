import { isAddressEqual } from 'viem';

import { useVault } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';

import { useConfirmOwnership } from '../../hooks';

import { ButtonStyled } from './styles';

export const OwnershipAction = () => {
  const { isLoading, isPending, activeVault } = useVault();
  const { pendingOwner, hasPendingOwner } = activeVault ?? {};
  const { address } = useDappStatus();
  const {
    acceptOwnership,
    mutation: { isPending: isTxPending },
  } = useConfirmOwnership();
  const showLoading = isLoading || isPending || isTxPending;
  const currentAccountIsOwner =
    !!pendingOwner && !!address && isAddressEqual(pendingOwner, address);

  if (!hasPendingOwner) {
    return null;
  }

  const text = currentAccountIsOwner
    ? 'Confirm the ownership transfer'
    : 'Please connect the wallet with a correct address';

  return (
    <ButtonStyled
      size="sm"
      onClick={acceptOwnership}
      disabled={!currentAccountIsOwner}
      loading={showLoading}
    >
      {text}
    </ButtonStyled>
  );
};
