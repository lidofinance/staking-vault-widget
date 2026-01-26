import { Button } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { ConnectWalletButton } from 'shared/wallet';

import { useDisburse, useClaimData } from './hooks';

export const SubmitButton = () => {
  const { isDappActive } = useDappStatus();
  const { disburse, isSubmitting } = useDisburse();
  const { claimableFeeQuery, invalidateClaimData } = useClaimData();

  const handleClaim = async () => {
    await disburse();
    await invalidateClaimData();
  };

  const isDisabled =
    // state is not ready
    !isDappActive ||
    isSubmitting ||
    claimableFeeQuery.isPending ||
    !claimableFeeQuery.data ||
    // no fee or not enough to claim
    !claimableFeeQuery.data.noFee ||
    !claimableFeeQuery.data.isEnoughToClaim;

  const isNotEnoughEther =
    claimableFeeQuery.data && claimableFeeQuery.data.isEnoughToClaim === false;

  return (
    <ConnectWalletButton>
      <Button
        loading={isSubmitting}
        disabled={isDisabled}
        onClick={handleClaim}
      >
        {isNotEnoughEther
          ? vaultTexts.actions.disburse.notEnoughEther
          : vaultTexts.actions.disburse.claimButton(
              claimableFeeQuery.data?.noFee,
            )}
      </Button>
    </ConnectWalletButton>
  );
};
