import { vaultTexts } from 'modules/vaults';

import { NoticeContainer } from 'features/overview/new/shared';

const { thresholdExceeded } = vaultTexts.metrics;

export const ThresholdExceeded = () => {
  const { title, description, note } = thresholdExceeded;

  return (
    <NoticeContainer
      title={title}
      description={description}
      note={note}
      type="error"
    >
      Hello
    </NoticeContainer>
  );
};
