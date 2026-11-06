// The vault state is re-read after every report attempt, whatever its outcome:
// applied, already applied by someone else, or failed. A success may carry no tx block
// (an AA batch without receipts), so queries keyed on the latest tx block alone
// would keep the report freshness and "Apply fresh report" stale.
//
// After a success the attempt waits for the refresh: the report's busy lock stays on until
// the UI knows the report is fresh, so another "Apply fresh report" click in between is
// dropped (a lagging node could still call the report stale and a redundant one be sent).
// After a failure it refreshes in the background: the attempt ends with the tx, so a Retry
// clicked on its error is not dropped by that lock while the vault state reloads.
export const sendReportAndRefresh = async (
  send: () => Promise<{ success: boolean }>,
  refresh: () => Promise<unknown>,
): Promise<boolean> => {
  const refreshSafely = () =>
    refresh().catch((error) =>
      console.error('[sendReportAndRefresh] vault state refresh failed', error),
    );

  let success = false;
  try {
    ({ success } = await send());
    return success;
  } finally {
    if (success) await refreshSafely();
    else void refreshSafely();
  }
};
