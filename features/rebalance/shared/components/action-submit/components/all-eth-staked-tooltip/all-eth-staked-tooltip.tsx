import { useMemo } from 'react';
import Link from 'next/link';

import { useVault, vaultTexts } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { TooltipText } from '../styles';

const { submit, description } = vaultTexts.actions.rebalance;

export const AllEthStakedTooltip = () => {
  const { vaultAddress } = useVault();

  const withdrawLink = useMemo(
    () => (vaultAddress ? appPaths.vaults.vault(vaultAddress).validators : '#'),
    [vaultAddress],
  );

  return (
    <TooltipText size="xxs">
      {submit.tooltips.allEthStaked}{' '}
      <Link href={withdrawLink}>{description.rebalance.withdrawLinkText}</Link>.
    </TooltipText>
  );
};
