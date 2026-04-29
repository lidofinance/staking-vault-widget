import { Text } from '@lidofinance/lido-ui';

import { NoticeContainer } from 'shared/components';
import { useMitigateRisks, vaultTexts } from 'modules/vaults';

import { AgreeConfirm, OwnersList, Explanation } from './components';

const { title, description } = vaultTexts.actions.supply.banners.multipleOwners;

export const MultipleOwners = () => {
  const { isMultipleOwners } = useMitigateRisks();

  if (!isMultipleOwners) {
    return null;
  }

  return (
    <NoticeContainer title={title} type="warning">
      <Text size="xxs">{description}</Text>
      <Explanation />
      <OwnersList />
      <AgreeConfirm />
    </NoticeContainer>
  );
};
