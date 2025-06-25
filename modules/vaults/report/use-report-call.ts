import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import { useLidoSDK } from 'modules/web3';

import { useVaultInfo } from '../vault-context';
import { getLazyOracleContract } from '../contracts';
import { vaultTexts } from '../consts';
import { encodeFunctionData } from 'viem';

export const useReportCalls = () => {
  const { publicClient } = useLidoSDK();
  const { activeVault } = useVaultInfo();
  return useCallback(() => {
    invariant(activeVault, 'activeVault is required');

    const { report, isReportFresh } = activeVault;

    const lazyOracle = getLazyOracleContract(publicClient);

    if (!report) {
      if (!isReportFresh) {
        // TODO: change to parsable error
        throw new Error('Report is not available');
      }
      return [];
    }

    return [
      {
        loadingActionText: vaultTexts.actions.report.loading,
        to: lazyOracle.address,
        data: encodeFunctionData({
          ...lazyOracle.prepare.updateVaultData([
            report.vault,
            report.totalValueWei,
            report.fee,
            report.liabilityShares,
            report.slashingReserve,
            report.proof,
          ]),
        }),
      },
    ];
  }, [activeVault, publicClient]);
};
