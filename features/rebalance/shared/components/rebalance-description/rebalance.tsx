import { useMemo } from 'react';
import { Text } from '@lidofinance/lido-ui';
import Link from 'next/link';

import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { Container } from './styles';

export const Rebalance = () => {
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
        Rebalance
      </Text>
      <Text size="xxs" color="secondary">
        Rebalancing is sending ETH from the stVault balance to Lido Core,
        receiving stETH with a ratio of 1:1, and repaying received stETH back to
        stVault meaning reduce both Total Value and stETH Liability. To change
        the collateralization balance, you can also{' '}
        <Link href={supplyLink}>supply ETH</Link> or{' '}
        <Link href={repayLink}>repay stETH</Link>.
      </Text>
    </Container>
  );
};
