import invariant from 'tiny-invariant';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { useVault, vaultTexts, GoToVault } from 'modules/vaults';

import { useVaultTierInfo } from './use-vault-tier-info';

export const useChangeTierRequest = () => {
  const [approving, setApproving] = useState(false);
  const { activeVault } = useVault();
  const { data: tierInfo } = useVaultTierInfo();
  const { sendTX, ...rest } = useSendTransaction();
  const { address } = useAccount();

  return {
    approving,
    approveMovingTier: useCallback(
      async (tierId: bigint, mintingLimit: bigint) => {
        invariant(tierInfo, '[useChangeTierRequest] tierInfo is undefined');
        invariant(
          activeVault,
          '[useChangeTierRequest] activeVault is undefined',
        );

        setApproving(true);
        const isNodeOperator = activeVault.nodeOperator === address;
        const transactions: TransactionEntry[] = [];

        // if node operator, use operator grid contract
        // if not node operator, use dashboard contract
        if (isNodeOperator) {
          transactions.push({
            ...activeVault.operatorGrid.encode.changeTier([
              activeVault.address,
              tierId,
              mintingLimit,
            ]),
            loadingActionText: vaultTexts.actions.settings.approveSelectedTier(
              tierId.toString(),
            ),
          });
        } else {
          transactions.push({
            ...activeVault.dashboard.encode.changeTier([tierId, mintingLimit]),
            loadingActionText: vaultTexts.actions.settings.approveSelectedTier(
              tierId.toString(),
            ),
          });
        }

        const result = await withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: `Approve moving to ${tierInfo.tier.tierName}`,
            mainActionCompleteText: `Request for ${tierInfo.tier.tierName} approved`,
            renderSuccessContent: GoToVault,
            allowRetry: false,
          }),
        );

        setApproving(false);

        return {
          result,
        };
      },
      [tierInfo, activeVault, address, sendTX],
    ),
    ...rest,
  };
};
