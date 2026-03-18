import type { FC } from 'react';
import type { PopoverPlacements } from '@lidofinance/lido-ui';

import { ReportState } from 'shared/components/index';

import { ReportStateContainer } from './styles';
import { useRouter } from 'next/router';

const excludePaths = ['/', '/vaults', '/create-vault'];

type ReportProps = {
  tooltipPlacement?: PopoverPlacements;
};

export const Report: FC<ReportProps> = ({ tooltipPlacement }) => {
  const { pathname } = useRouter();

  if (excludePaths.includes(pathname)) {
    return null;
  }

  return (
    <ReportStateContainer data-testid="reportSection">
      <ReportState tooltipPlacement={tooltipPlacement} />
    </ReportStateContainer>
  );
};
