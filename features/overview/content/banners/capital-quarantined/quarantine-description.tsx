import { FC } from 'react';

import { FormatToken } from 'shared/formatters';

import { QUARANTINE_GUIDE_LINK } from 'features/overview/consts';
import { LearnMore } from '../deposits-restricted/components/learn-more';

type QuarantineDescriptionProps = {
  pendingTotalValueIncrease: bigint;
  totalValueRemainder: bigint;
  expectedReportTimestamp: bigint;
  isReleasable: boolean;
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
  expectedReportTimestamp,
  isReleasable,
}) => {
  const total = (
    <FormatToken
      amount={pendingTotalValueIncrease + totalValueRemainder}
      maxDecimalDigits={4}
      symbol="ETH"
    />
  );
  const pending = (
    <FormatToken
      amount={pendingTotalValueIncrease}
      maxDecimalDigits={4}
      symbol="ETH"
    />
  );

  if (isReleasable) {
    return (
      <>
        <b>{total} is</b> currently under quarantine.{' '}
        <b>At least {pending} can now be released from quarantine</b>. Apply a
        fresh Oracle report to the stVault to release the eligible amount.{' '}
        <LearnMore link={QUARANTINE_GUIDE_LINK} />
      </>
    );
  }

  return (
    <>
      <b>{total}</b> is currently under quarantine due to a recent sudden jump
      in Total Value. At least {pending} can be released after the{' '}
      <b>
        Oracle report expected on {formatUnixDate(expectedReportTimestamp)}{' '}
        arrives and is applied to the stVault
      </b>
      . <LearnMore link={QUARANTINE_GUIDE_LINK} />
    </>
  );
};
