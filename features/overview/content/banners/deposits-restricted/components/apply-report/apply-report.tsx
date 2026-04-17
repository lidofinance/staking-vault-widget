import { type FC, useCallback } from 'react';

import { useVault, useSendReport } from 'modules/vaults';
import { FormatToken } from 'shared/formatters';
import { WEI_PER_ETHER } from 'consts/tx';

import { ListItem, ListItemContent } from '../styles';
import { ButtonLink } from './styles';
import { TextStyled } from '../../../styles';

type ApplyReportProps = {
  lidoFees: bigint | undefined;
};

export const ApplyReport: FC<ApplyReportProps> = ({ lidoFees }) => {
  const { activeVault } = useVault();
  const { applyReport } = useSendReport();
  const onSendReport = useCallback(() => applyReport(), [applyReport]);
  const isReportAvailable = !!activeVault?.isReportAvailable;
  if (!lidoFees || lidoFees < WEI_PER_ETHER) {
    return null;
  }

  return (
    <ListItem>
      <ListItemContent>
        <TextStyled size="xxs">
          {isReportAvailable ? (
            <>
              <ButtonLink role="button" onClick={onSendReport}>
                Apply the latest Oracle report
              </ButtonLink>{' '}
              to automatically settle{' '}
              <FormatToken amount={lidoFees} symbol="ETH" /> in Lido fees.
            </>
          ) : (
            <>
              Wait for the next Oracle report, then apply it to automatically
              settle <FormatToken amount={lidoFees} symbol="ETH" /> in Lido
              fees.
            </>
          )}
          {/* TODO: add learn more link */}
        </TextStyled>
      </ListItemContent>
    </ListItem>
  );
};
