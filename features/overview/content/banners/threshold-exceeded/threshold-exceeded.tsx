import { vaultTexts } from 'modules/vaults';
import { NoticeContainer } from 'shared/components';

import { RepayObligations } from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/vault-overview';

const {
  thresholdExceeded: { title, description },
} = vaultTexts.metrics;

export const ThresholdExceeded = () => {
  const { values } = useVaultOverview();
  const { healthFactorNumber } = values ?? {};

  if (!healthFactorNumber || healthFactorNumber >= 100) {
    return null;
  }

  return (
    <NoticeContainer title={title} description={description} type="error">
      <RepayObligations />
    </NoticeContainer>
  );
};
