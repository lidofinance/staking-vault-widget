import { Text } from '@lidofinance/lido-ui';

import { NoticeContainer } from 'shared/components';
import { useMitigateRisks, vaultTexts } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { isUndefined } from 'utils';

import { ConfirmAndProceed } from '../confirm-and-proceed';

import { OwnersList, Explanation } from './components';

const { title, description } = vaultTexts.actions.supply.banners.multipleOwners;

export const MultipleOwners = () => {
  const { isDappActive } = useDappStatus();
  const {
    isMultipleOwners,
    isTierDefault,
    isNodeOperatorVerified,
    isVaultOwner,
    defaultAdminList,
  } = useMitigateRisks();

  if (
    !isDappActive ||
    !isMultipleOwners ||
    isTierDefault ||
    !isVaultOwner ||
    !isNodeOperatorVerified ||
    isUndefined(defaultAdminList)
  ) {
    return null;
  }

  return (
    <NoticeContainer title={title} type="warning">
      <Text size="xxs">{description}</Text>
      <Explanation />
      <OwnersList ownersList={defaultAdminList} />
      <ConfirmAndProceed fieldName="multipleOwners" />
    </NoticeContainer>
  );
};
