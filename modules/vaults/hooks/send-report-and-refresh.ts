// The vault state is re-read after every report attempt, whatever its outcome:
// applied, already applied by someone else, or failed. A success may carry no tx block
// (an AA batch without receipts), so queries keyed on the latest tx block alone
// would keep the report freshness and "Apply fresh report" stale.
export const sendReportAndRefresh = async (
  send: () => Promise<{ success: boolean }>,
  refresh: () => Promise<unknown>,
): Promise<boolean> => {
  try {
    const { success } = await send();
    return success;
  } finally {
    await refresh();
  }
};
