import { Button } from '@lidofinance/lido-ui';
import { useReportStatus } from '../hooks';

export type OracleReportButtonProps = React.PropsWithChildren<{
  ensureFreshReport?: boolean;
}>;

export const OracleReportButton = ({
  ensureFreshReport = true,
  children,
}: OracleReportButtonProps) => {
  const { shouldApplyReport } = useReportStatus();

  if (shouldApplyReport && ensureFreshReport) {
    return <Button>Apply Oracle Report</Button>;
  }

  return <>{children}</>;
};
