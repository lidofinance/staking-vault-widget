import { type FC, type PropsWithChildren, useMemo } from 'react';
import NextLink from 'next/link';
import { Text, Link } from '@lidofinance/lido-ui';

import { NoticeContainer } from 'shared/components';
import { useMitigateRisks, useVault } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { appPaths } from 'consts/routing';

import { ConfirmAndProceed } from '../confirm-and-proceed';

import { pdgLink } from '../../const';

export const UnguaranteedDeposits: FC<PropsWithChildren> = () => {
  const { isDappActive } = useDappStatus();
  const { vaultAddress } = useVault();
  const {
    isSupplier,
    isUnguaranteedDepositsAllowed,
    isNodeOperatorVerified,
    isTierDefault,
  } = useMitigateRisks();

  const mainSettingsLink = useMemo(() => {
    if (!vaultAddress) return '#';
    return appPaths.vaults.vault(vaultAddress).settings('main');
  }, [vaultAddress]);

  if (
    !isDappActive ||
    isTierDefault ||
    !isSupplier ||
    (!isUnguaranteedDepositsAllowed && !isNodeOperatorVerified)
  ) {
    return null;
  }

  return (
    <NoticeContainer title="Unguaranteed deposits allowed">
      <Text size="xxs">
        Current <Link href={pdgLink}>Predeposit Guarantee Policy</Link> allows{' '}
        <NextLink href={mainSettingsLink}>unguaranteed deposits</NextLink>. By
        proceeding, you confirm that there is mutual off-chain trust between the
        Node Operator and the Vault Owner.
      </Text>
      <ConfirmAndProceed fieldName="unguaranteedDeposits" />
    </NoticeContainer>
  );
};
