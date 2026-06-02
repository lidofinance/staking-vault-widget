import { useMemo } from 'react';
import { Text } from '@lidofinance/lido-ui';
import Link from 'next/link';

import { useVault, vaultTexts } from 'modules/vaults';
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

  const {
    title,
    text,
    thresholdText,
    restoreText,
    supplyLinkText,
    repayLinkText,
    noGuaranteeText,
  } = vaultTexts.actions.rebalance.description.forceRebalance;

  return (
    <Container>
      <Text size="sm" strong>
        {title}
      </Text>
      <Text size="xxs" color="secondary">
        {text}
        <br />
        {thresholdText}
        <br />
        {restoreText} <Link href={supplyLink}>{supplyLinkText}</Link> or{' '}
        <Link href={repayLink}>{repayLinkText}</Link>. {noGuaranteeText}
      </Text>
    </Container>
  );
};
