import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import { useLidoSDK } from 'modules/web3';

import { useVault } from '../vault-context';
import { getLazyOracleContract } from '../contracts';
import { vaultTexts } from '../consts';

export const useReportCalls = () => {
  const { publicClient } = useLidoSDK();
  const { activeVault } = useVault();
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
        ...lazyOracle.encode.updateVaultData([
          report.vault,
          report.totalValueWei,
          report.fee,
          report.liabilityShares,
          report.slashingReserve,
          report.proof,
        ]),
      },
    ];
  }, [activeVault, publicClient]);
};
