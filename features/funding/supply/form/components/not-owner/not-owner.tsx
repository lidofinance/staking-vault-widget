import { Text, Address, useBreakpoint } from '@lidofinance/lido-ui';

import { NoticeContainer } from 'shared/components';
import { useDappStatus } from 'modules/web3';
import { useMitigateRisks, vaultTexts } from 'modules/vaults';
import { isUndefined } from 'utils';

import { ConfirmAndProceed } from '../confirm-and-proceed';

const { title } = vaultTexts.actions.supply.banners.notOwner;

export const NotOwner = () => {
  const { isDappActive } = useDappStatus();

  const {
    isVaultOwner,
    isMultipleOwners,
    firstAdmin,
    isSupplier,
    isTierDefault,
    isNodeOperatorVerified,
  } = useMitigateRisks();
  const isMobile = useBreakpoint('sm');
  const addressSize = isMobile ? 10 : 22;

  if (
    !isDappActive ||
    isVaultOwner ||
    isMultipleOwners ||
    isUndefined(firstAdmin) ||
    !isSupplier ||
    isTierDefault ||
    !isNodeOperatorVerified
  ) {
    return null;
  }

  return (
    <NoticeContainer title={title} type="warning">
      <Text size="xxs">
        The permission to supply ETH to this stVault was delegated to your
        address by the Vault Owner.
      </Text>
      <Text size="xxs">
        Any tokens you supply will be fully controlled by the Vault Owner, and
        you will not be able to control or recover them.
      </Text>
      <Text size="xxs">
        Vault Owner:{' '}
        <Address
          as="span"
          style={{ fontWeight: 'bold' }}
          address={firstAdmin}
          symbols={addressSize}
        />
      </Text>
      <ConfirmAndProceed fieldName="notOwner" />
    </NoticeContainer>
  );
};
