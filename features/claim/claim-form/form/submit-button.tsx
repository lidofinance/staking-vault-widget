import { Button } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { ConnectWalletButton } from 'shared/wallet';

import { useClaim, useClaimData } from './hooks';

export const SubmitButton = () => {
  const { isDappActive } = useDappStatus();
  const { claim, isSubmitting } = useClaim();
  const { claimableFeeQuery, invalidateClaimData } = useClaimData();

  const handleClaim = async () => {
    await claim();
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
      <Button disabled={isDisabled} onClick={handleClaim}>
        {isNotEnoughEther
          ? vaultTexts.actions.claim.notEnoughEther
          : vaultTexts.actions.claim.claimButton(claimableFeeQuery.data?.noFee)}
      </Button>
    </ConnectWalletButton>
  );
};
