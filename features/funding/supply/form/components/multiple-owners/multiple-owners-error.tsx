import { useMitigateRisks, vaultTexts } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { NoticeContainer } from 'shared/components';

import { UnidentifiedNodeOperator, DefaultTier } from './components';

const { title } = vaultTexts.actions.supply.banners.multipleOwners;

export const MultipleOwnersError = () => {
  const { isDappActive } = useDappStatus();
  const {
    isMultipleOwners,
    isTierDefault,
    isNodeOperatorVerified,
    isVaultOwner,
  } = useMitigateRisks();

  if (
    !isDappActive ||
    !isMultipleOwners ||
    !isVaultOwner ||
    !(isTierDefault || !isNodeOperatorVerified)
  ) {
    return null;
  }

  return (
    <NoticeContainer title={title} type="error">
      {isTierDefault && <DefaultTier />}
      {!isNodeOperatorVerified && <UnidentifiedNodeOperator />}
    </NoticeContainer>
  );
};
