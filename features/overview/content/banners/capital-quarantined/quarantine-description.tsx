import { FC } from 'react';

import { FormatToken } from 'shared/formatters';

type QuarantineDescriptionProps = {
  pendingTotalValueIncrease: bigint;
  totalValueRemainder: bigint;
  timestamp: bigint;
};

const dateTimeFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'UTC',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const formatUnixDate = (ts: bigint) => {
  return dateTimeFormat.format(Number(ts) * 1000);
};

export const QuarantineDescription: FC<QuarantineDescriptionProps> = ({
  pendingTotalValueIncrease,
  totalValueRemainder,
  timestamp,
}) => {
  const quarantineValue = pendingTotalValueIncrease + totalValueRemainder;

  return (
    <>
      A sudden jump in Total Value was detected based on the latest oracle
      report. As a result,{' '}
      <FormatToken amount={quarantineValue} maxDecimalDigits={4} symbol="ETH" />{' '}
      currently remains under quarantine. At least{' '}
      <FormatToken
        amount={pendingTotalValueIncrease}
        maxDecimalDigits={4}
        symbol="ETH"
      />{' '}
      will be unlocked {formatUnixDate(timestamp)}.
    </>
  );
};
