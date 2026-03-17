import type { FC } from 'react';
import { Link, Button } from '@lidofinance/lido-ui';

import {
  type HubReportData,
  CID_TO_GATEWAY,
  useSendReport,
} from 'modules/vaults';
import { ConnectWalletButton } from 'shared/wallet';
import { formatCustomDate } from 'utils/formats';

import { TextContent } from '../../shared';

import { Action, Description, Content } from './styled';

type ReportInfoProps = {
  isFresh: boolean;
  report: HubReportData | undefined;
};

export const ReportInfo: FC<ReportInfoProps> = ({ isFresh, report }) => {
  const { applyReport } = useSendReport();

  if (!report) return null;

  return (
    <Content>
      <Description>
        <TextContent size="xxs">
          Last report: {formatCustomDate(Number(report.timestamp))}
        </TextContent>
        <TextContent size="xxs">
          <Link
            href={CID_TO_GATEWAY[0](report.cid)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="reportLink"
          >
            View oracle report
          </Link>
        </TextContent>
      </Description>
      {!isFresh && (
        <ConnectWalletButton size="xs">
          <Action>
            <TextContent size="xxs">
              Some stVault actions require the latest Oracle report. This UI
              applies it automatically when needed.
            </TextContent>
            <Button size="xs" variant="translucent" onClick={applyReport}>
              Apply fresh report
            </Button>
          </Action>
        </ConnectWalletButton>
      )}
    </Content>
  );
};
