import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import { useVault } from '../vault-context';
import { ReportMissingError, vaultTexts } from '../consts';
import { fetchReport } from '../api';
import { useLidoSDK } from 'modules/web3';

export const useReportCalls = () => {
  const { publicClient } = useLidoSDK();
  const { activeVault } = useVault();
  return useCallback(async () => {
    invariant(activeVault, 'activeVault is required');

    const {
      report: prefetchedReport,
      lazyOracle,
      hub,
      address,
      hubReport,
    } = activeVault;

    // Live check before tx submission to ensure that report is not already submitted
    const isReportFresh = await hub.read.isReportFresh([address]);

    // skip report if report is already fresh
    // can happen due with multiple vault users
    if (isReportFresh) return [];

    let report = prefetchedReport;

    // if we have report, check it's freshness and fetch fresh one if this one is stale
    // can happen rarely if new report came in and UI haven't updated yet
    if (report) {
      const [latestHubReportTimestamp, _, __, latestHubReportCID] =
        await lazyOracle.read.latestReportData();

      if (hubReport.timestamp < latestHubReportTimestamp) {
        report = await fetchReport(
          { publicClient },
          { cid: latestHubReportCID, vault: address },
        );
      }
    }

    // Quite rare case but theoretically possible
    // vault freshness has passed but no report is available so no with-report-TX can succeed
    if (!report) {
      throw new ReportMissingError();
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
  }, [activeVault, publicClient]);
};
