import { useMemo } from 'react';
import NextLink from 'next/link';
import { Text, Link } from '@lidofinance/lido-ui';

import { NoticeContainer } from 'shared/components';
import { useMitigateRisks, useVault } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { appPaths } from 'consts/routing';

import { NOIdentificationLink, pdgLink } from '../../const';

export const UnguaranteedDepositsError = () => {
  const { isDappActive } = useDappStatus();
  const { vaultAddress } = useVault();
  const {
    nodeOperator,
    isUnguaranteedDepositsAllowed,
    isNodeOperatorVerified,
    isSupplier,
    isTierDefault,
  } = useMitigateRisks();
  const mainSettingsLink = useMemo(() => {
    if (!vaultAddress) return '#';
    return appPaths.vaults.vault(vaultAddress).settings('main');
  }, [vaultAddress]);

  if (
    !isDappActive ||
    !isSupplier ||
    isTierDefault ||
    !nodeOperator ||
    (!isUnguaranteedDepositsAllowed && isNodeOperatorVerified)
  ) {
    return null;
  }

  return (
    <NoticeContainer title="Unguaranteed deposits allowed" type="error">
      <Text size="xxs">
        Operator {nodeOperator} has not passed the{' '}
        <Link href={NOIdentificationLink}>identification process</Link>, and
        current <Link href={pdgLink}>Predeposit Guarantee Policy</Link> allows{' '}
        <NextLink href={mainSettingsLink}>unguaranteed deposits</NextLink>. Due
        to a higher risk of losing funds, this action is not allowed in this UI.
      </Text>
    </NoticeContainer>
  );
};
