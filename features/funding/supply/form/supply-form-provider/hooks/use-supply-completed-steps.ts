import { useCallback } from 'react';

import { useVault } from 'modules/vaults';

import { getSupplyResumeKey, type SupplyResumeValues } from '../supply-resume';

// steps confirmed by a failed attempt with these form values, which a resubmit skips
export const useSupplyCompletedSteps = (
  getCompletedSteps: (resumeKey: string | undefined) => ReadonlySet<string>,
) => {
  const { activeVault } = useVault();
  return useCallback(
    (values: SupplyResumeValues): ReadonlySet<string> =>
      getCompletedSteps(
        activeVault
          ? getSupplyResumeKey(activeVault.address, values)
          : undefined,
      ),
    [activeVault, getCompletedSteps],
  );
};
