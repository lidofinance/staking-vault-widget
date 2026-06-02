import { useMemo } from 'react';
import { Text } from '@lidofinance/lido-ui';
import Link from 'next/link';

import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { Container } from './styles';

export const ForceRebalance = () => {
  const { vaultAddress } = useVault();

  const [supplyLink, repayLink] = useMemo(() => {
    if (!vaultAddress) return ['#', '#'];

    return [
      appPaths.vaults.vault(vaultAddress).eth('supply'),
      appPaths.vaults.vault(vaultAddress).steth('repay'),
    ];
  }, [vaultAddress]);

  // TODO: add text to vault texts
  return (
    <Container>
      <Text size="sm" strong>
        Forced rebalance
      </Text>
      <Text size="xxs" color="secondary">
        Rebalancing is sending ETH from the stVault balance to Lido Core,
        receiving stETH with a ratio of 1:1, and repaying received stETH back to
        stVault meaning reduce both Total Value and stETH Liabiltiy.
        <br />
        The stVault’s Forced Rebalance Threshold has been exceeded, activating
        the permissionless rebalancing mechanism.
        <br />
        This means the stVault can be rebalanced at any time. You can still
        restore the collateralization balance by{' '}
        <Link href={supplyLink}>supplying ETH</Link> or{' '}
        <Link href={repayLink}>repaying stETH</Link>. However, there is no
        guarantee that a permissionless rebalance will not occur before your
        transaction is executed.
      </Text>
    </Container>
  );
};
