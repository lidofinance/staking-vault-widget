import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import { useVault } from '../vault-context';
import { ReportMissingError, vaultTexts } from '../consts';

export const useReportCalls = () => {
  const { activeVault } = useVault();
  return useCallback(() => {
    invariant(activeVault, 'activeVault is required');

    const { report, isReportFresh, lazyOracle } = activeVault;

    if (!report) {
      if (!isReportFresh) {
        throw new ReportMissingError();
      }

      return [];
    }

    if (report && isReportFresh) {
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
          report.maxLiabilityShares,
          report.slashingReserve,
          report.proof,
        ]),
      },
    ];
  }, [activeVault]);
};
