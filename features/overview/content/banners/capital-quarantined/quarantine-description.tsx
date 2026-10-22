import { FC } from 'react';

import { FormatToken } from 'shared/formatters';

import { QUARANTINE_GUIDE_LINK } from 'features/overview/consts';
import { LearnMore } from '../deposits-restricted/components/learn-more';
import type { QuarantineBannerState } from './utils';

type QuarantineDescriptionProps = {
  state: QuarantineBannerState;
};

const dateTimeFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'UTC',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const dateTimeWithTimeFormat = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'UTC',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

const formatUnixDate = (ts: bigint) => {
  return dateTimeFormat.format(Number(ts) * 1000);
};

const formatUnixDateTime = (ts: bigint) => {
  return `${dateTimeWithTimeFormat.format(Number(ts) * 1000).replace(',', '')} UTC`;
};

const Eth: FC<{ amount: bigint }> = ({ amount }) => (
  <FormatToken amount={amount} maxDecimalDigits={4} symbol="ETH" />
);

export const QuarantineDescription: FC<QuarantineDescriptionProps> = ({
  state,
}) => {
  if (state.type === 'releasable') {
    return (
      <>
        <b>
          <Eth amount={state.total} /> is
        </b>{' '}
        currently under quarantine.{' '}
        <b>
          At least <Eth amount={state.releasable} /> can now be released from
          quarantine
        </b>
        . Apply a fresh Oracle report to the stVault to release the eligible
        amount. <LearnMore link={QUARANTINE_GUIDE_LINK} />
      </>
    );
  }

  const { expectedReportTimestamp, endTimestamp } = state;

  return (
    <>
      <b>
        <Eth amount={state.total} />
      </b>{' '}
      is currently under quarantine due to a recent sudden jump in Total Value.
      At least <Eth amount={state.pending} /> can be released after the{' '}
      <b>
        {expectedReportTimestamp
          ? `Oracle report expected on ${formatUnixDate(expectedReportTimestamp)}`
          : // release needs a report with timestamp >= endTimestamp,
            // so without the schedule bind the text to the quarantine end
            `first Oracle report after ${formatUnixDateTime(endTimestamp)}`}{' '}
        arrives and is applied to the stVault
      </b>
      . <LearnMore link={QUARANTINE_GUIDE_LINK} />
    </>
  );
};
