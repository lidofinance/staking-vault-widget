import { NoticeContainer } from 'shared/components';
import { useMitigateRisks, vaultTexts } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { isUndefined } from 'utils';

import { DefaultTier } from './default-tier';
import { UnidentifiedNodeOperator } from './unidentified-node-operator';

const { title } = vaultTexts.actions.antiScam.banners.notOwner;

export const NotOwnerError = () => {
  const { isDappActive } = useDappStatus();

  const {
    isVaultOwner,
    isMultipleOwners,
    isSupplier,
    isTierDefault,
    isNodeOperatorVerified,
  } = useMitigateRisks();

  if (
    !isDappActive ||
    isVaultOwner ||
    isMultipleOwners ||
    !isSupplier ||
    isUndefined(isTierDefault) ||
    isUndefined(isNodeOperatorVerified)
  ) {
    return null;
  }

  return (
    <NoticeContainer title={title} type="error">
      {isTierDefault && <DefaultTier />}
      {!isTierDefault && !isNodeOperatorVerified && (
        <UnidentifiedNodeOperator />
      )}
    </NoticeContainer>
  );
};
