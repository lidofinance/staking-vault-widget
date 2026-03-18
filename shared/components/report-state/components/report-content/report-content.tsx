import type { FC } from 'react';

import type { HubReportData } from 'modules/vaults';

import { ReportError } from '../report-error';
import { ReportInfo } from '../report-info';

import { Container } from './styled';

type ReportContentProps = {
  isFresh: boolean;
  report: HubReportData | undefined;
  error: Error | null;
};

export const ReportContent: FC<ReportContentProps> = ({
  isFresh,
  report,
  error,
}) => {
  return (
    <Container>
      <ReportInfo isFresh={isFresh} report={report} />
      <ReportError error={error} />
    </Container>
  );
};
