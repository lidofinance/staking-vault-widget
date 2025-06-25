import { vaultTexts } from 'modules/vaults';

import { NoticeContainer } from 'features/overview/new/shared';

const { capacityExceeded } = vaultTexts.metrics;

export const CapacityExceeded = () => {
  const { title, description, note } = capacityExceeded;

  return (
    <NoticeContainer title={title} description={description} note={note}>
      Hello
    </NoticeContainer>
  );
};
