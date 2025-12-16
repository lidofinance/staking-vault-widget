import invariant from 'tiny-invariant';
import { useCallback, useState } from 'react';
import { useAccount } from 'wagmi';

import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import {
  useVault,
  vaultTexts,
  GoToVault,
  useVaultTierInfo,
  useNodeOperatorTiersInfo,
  useReportCalls,
} from 'modules/vaults';

export const useChangeTierRequest = () => {
  const [approving, setApproving] = useState(false);
  const { activeVault } = useVault();
  const { data: tierInfo } = useVaultTierInfo();
  const { data: noTiersInfo } = useNodeOperatorTiersInfo();
  const prepareReportCalls = useReportCalls();
  const { sendTX, ...rest } = useSendTransaction();
  const { address } = useAccount();

  return {
    approving,
    approveMovingTier: useCallback(
      async (tierId: bigint, mintingLimit: bigint) => {
        invariant(tierInfo, '[useChangeTierRequest] tierInfo is undefined');
        invariant(
          noTiersInfo,
          '[useChangeTierRequest] noTiersInfo is undefined',
        );
        invariant(
          activeVault,
          '[useChangeTierRequest] activeVault is undefined',
        );

        setApproving(true);
        const isNodeOperator = activeVault.nodeOperator === address;
        const transactions: TransactionEntry[] = [...prepareReportCalls()];

        // if node operator, use operator grid contract
        // if not node operator, use dashboard contract
        if (isNodeOperator) {
          transactions.push({
            ...activeVault.operatorGrid.encode.changeTier([
              activeVault.address,
              tierId,
              mintingLimit,
            ]),
            loadingActionText:
              vaultTexts.actions.settings.approveSelectedTier(tierId),
          });
        } else {
          transactions.push({
            ...activeVault.dashboard.encode.changeTier([tierId, mintingLimit]),
            loadingActionText:
              vaultTexts.actions.settings.approveSelectedTier(tierId),
          });
        }

        const tierName = noTiersInfo.tiers.find(
          (tier) => tier.id === tierId,
        )?.tierName;

        const result = await withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: `Approve moving to ${tierName}`,
            mainActionCompleteText: `Request for ${tierName} approved`,
            renderSuccessContent: GoToVault,
            allowRetry: false,
          }),
        );

        setApproving(false);

        return {
          result,
        };
      },
      [tierInfo, noTiersInfo, activeVault, address, sendTX, prepareReportCalls],
    ),
    ...rest,
  };
};
