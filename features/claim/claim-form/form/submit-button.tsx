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
    isSubmitting ||
    isDappActive ||
    claimableFeeQuery.isLoading ||
    !claimableFeeQuery.data;

  return (
    <ConnectWalletButton>
      <Button disabled={isDisabled} onClick={handleClaim}>
        {vaultTexts.actions.claim.claimButton(claimableFeeQuery.data)}
      </Button>
    </ConnectWalletButton>
  );
};
