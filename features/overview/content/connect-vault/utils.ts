import { encodeFunctionData } from 'viem';
import { DashboardAbi } from '@lidofinance/lido-ethereum-sdk/stvault';

import { Tier, VAULTS_CONNECT_DEPOSIT } from 'modules/vaults';
import { isBigint } from 'utils/is-bigint';

export const dataToTx = (
  proposedTier: Tier | undefined,
  proposedVaultLimitShares: bigint | undefined,
) => {
  if (
    proposedTier &&
    proposedTier.id !== 0n &&
    isBigint(proposedVaultLimitShares)
  ) {
    return {
      data: encodeFunctionData({
        abi: DashboardAbi,
        functionName: 'connectAndAcceptTier',
        args: [proposedTier.id, proposedVaultLimitShares],
      }),
      value: VAULTS_CONNECT_DEPOSIT,
    };
  }

  return {
    data: encodeFunctionData({
      abi: DashboardAbi,
      functionName: 'connectToVaultHub',
    }),
    value: VAULTS_CONNECT_DEPOSIT,
  };
};
