import { formatCustomDate, isNumber } from 'utils';
import { vaultTexts } from 'modules/vaults/consts';

import { NoticeContainer } from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/vault-overview';

import { TextStyled } from '../styles';

const { title, description } = vaultTexts.metrics.banners.outdatedMetrics;
export const OutdatedMetrics = () => {
  const { values } = useVaultOverview();
  const { outdatedReportData, dateOfLastReport } = values ?? {};

  if (!outdatedReportData || !isNumber(dateOfLastReport)) {
    return null;
  }

  const date = formatCustomDate(dateOfLastReport);

  return (
    <NoticeContainer title={title(date)}>
      <TextStyled size="xxs">{description(date)}</TextStyled>
    </NoticeContainer>
  );
};
