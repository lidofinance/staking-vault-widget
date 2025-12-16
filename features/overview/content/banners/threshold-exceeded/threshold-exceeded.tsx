import { vaultTexts } from 'modules/vaults';

import { NoticeContainer, RepayObligations } from 'features/overview/shared';
import { useVaultOverview } from '../../../vault-overview';

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
