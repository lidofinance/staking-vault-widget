import { useMemo } from 'react';
import { Text } from '@lidofinance/lido-ui';
import Link from 'next/link';

import { useVault, vaultTexts } from 'modules/vaults';
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

  const { title, text, supplyLinkText, repayLinkText } =
    vaultTexts.actions.rebalance.description.rebalance;

  return (
    <Container>
      <Text size="sm" strong>
        {title}
      </Text>
      <Text size="xxs" color="secondary">
        {text} <Link href={supplyLink}>{supplyLinkText}</Link> or{' '}
        <Link href={repayLink}>{repayLinkText}</Link>.
      </Text>
    </Container>
  );
};
