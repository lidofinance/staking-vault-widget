import { type FC, useCallback } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';
import { FormatToken } from 'shared/formatters';
import { WEI_PER_ETHER } from 'consts/tx';

import { useSendReport } from 'features/overview/hooks';
import { ListItem, ListItemContent } from '../styles';
import { ButtonLink } from './styles';

type ApplyReportProps = {
  lidoFees: bigint | undefined;
};

export const ApplyReport: FC<ApplyReportProps> = ({ lidoFees }) => {
  const { activeVault } = useVault();
  const { applyReport } = useSendReport();
  const onSendReport = useCallback(() => applyReport(), [applyReport]);

  if (
    !lidoFees ||
    lidoFees < WEI_PER_ETHER ||
    !activeVault?.isReportAvailable
  ) {
    return null;
  }

  return (
    <ListItem>
      <ListItemContent>
        <Text size="xxs">
          <ButtonLink role="button" onClick={onSendReport}>
            Apply the latest Oracle report
          </ButtonLink>{' '}
          to automatically settle <FormatToken amount={lidoFees} symbol="ETH" />{' '}
          in Lido fees.
          {/* TODO: add learn more link */}
        </Text>
      </ListItemContent>
    </ListItem>
  );
};
