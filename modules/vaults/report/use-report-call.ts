import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import { useVault } from '../vault-context';
import { ReportMissingError, vaultTexts } from '../consts';

export const useReportCalls = () => {
  const { activeVault } = useVault();
  return useCallback(async () => {
    invariant(activeVault, 'activeVault is required');

    const { report, lazyOracle, hub, address } = activeVault;

    // TODO: check report state against cached report, refetch report if nedeed,
    // Live check before tx submission to ensure that report is not already submitted
    const isReportFresh = await hub.read.isReportFresh([address]);

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
