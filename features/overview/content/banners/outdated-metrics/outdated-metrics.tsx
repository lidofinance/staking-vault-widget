import { NoticeContainer } from 'features/overview/shared';

import { TextStyled } from '../styles';

export const OutdatedMetrics = () => {
  const date = new Date().toDateString();
  const title = `Validator Balance Spike Detected — Metrics as of ${date}`;

  return (
    <NoticeContainer title={title}>
      <div>
        <TextStyled size="xxs">
          A balance spike was detected on one or more validators, likely caused
          by a side deposit or consolidation event. Due to current UI
          limitations, today&apos;s metrics — Rewards, APR, Carry Spread, and
          others — cannot be calculated accurately for this day. Data shown
          reflects the last valid snapshot: {date}.
        </TextStyled>
      </div>
    </NoticeContainer>
  );
};
