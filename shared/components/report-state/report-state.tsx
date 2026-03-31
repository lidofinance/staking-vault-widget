import type { FC } from 'react';
import { Text, Tooltip, type PopoverPlacements } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';
import { InlineLoader } from 'shared/components';

import { ReportContent } from './components';

import { Container, QuestionIcon } from './styles';

type ReportStateProps = {
  tooltipPlacement?: PopoverPlacements;
};

export const ReportState: FC<ReportStateProps> = ({ tooltipPlacement }) => {
  const { isLoading, error, activeVault } = useVault();
  const { isPendingConnect, isVaultDisconnected, isReportFresh } =
    activeVault ?? {};

  if (!activeVault || isPendingConnect || isVaultDisconnected) {
    return null;
  }

  const text = isReportFresh
    ? 'Oracle report up to date'
    : 'Oracle report outdated';

  return (
    <Container data-testid="reportSection">
      <InlineLoader isLoading={isLoading} height={20} width={140}>
        <Text
          color={isReportFresh ? 'success' : 'secondary'}
          size="xxs"
          data-testid="reportData"
        >
          {text}
        </Text>
        <Tooltip
          placement={tooltipPlacement}
          title={
            <ReportContent
              isFresh={isReportFresh}
              report={activeVault?.hubReport}
              error={error}
            />
          }
        >
          <QuestionIcon $isFresh={isReportFresh} />
        </Tooltip>
      </InlineLoader>
    </Container>
  );
};
