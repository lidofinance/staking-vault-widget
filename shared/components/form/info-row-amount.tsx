import { ComponentProps } from 'react';

import { InfoRow } from './info-row';
import { FormatToken } from 'shared/formatters';
import { DATA_UNAVAILABLE } from 'consts/text';

type InfoRowAmountProps = {
  amount?: bigint | null;
  token?: string;
  noDataLabel?: string;
} & ComponentProps<typeof InfoRow>;

export const InfoRowAmount = ({
  amount,
  token,
  noDataLabel = DATA_UNAVAILABLE,
  ...props
}: InfoRowAmountProps) => {
  return (
    <InfoRow {...props}>
      <FormatToken amount={amount} symbol={token} fallback={noDataLabel} />
    </InfoRow>
  );
};
