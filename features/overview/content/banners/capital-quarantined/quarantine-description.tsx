import { FC } from 'react';

import { FormatToken } from 'shared/formatters';

type QuarantineDescriptionProps = {
  amount: bigint;
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
  amount,
  timestamp,
}) => {
  return (
    <>
      <FormatToken amount={amount} maxDecimalDigits={4} symbol="ETH" /> increase
      in Total Value is pending due to a sudden jump in the value reported by
      the oracle. The amount will be unlocked gradually until{' '}
      {formatUnixDate(timestamp)}.
    </>
  );
};
