import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { appPaths } from 'consts/routing';

import { useVaultOverview } from 'features/overview/vault-overview';

import { SectionDivider } from '../styles';
import { ActionContainer } from './styles';
import { Action } from './action';

const healthEmergencyGuideLink =
  'https://docs.lido.fi/run-on-lido/stvaults/operational-and-management-guides/health-emergency-guide';

export const RepayObligations = () => {
  const router = useRouter();
  const { values } = useVaultOverview();
  const { stETHToBurn, obligationsShortfallValue, address } = values ?? {};

  const actions = useMemo(() => {
    if (!address) {
      return [];
    }

    return [
      {
        title: 'Increase Total Value',
        children: 'Supply',
        symbol: 'ETH',
        amount: obligationsShortfallValue,
        onClick: () =>
          router.push(appPaths.vaults.vault(address).eth('supply')),
      },
      {
        title: 'Decrease stETH Liability',
        children: 'Repay',
        symbol: 'stETH',
        amount: stETHToBurn,
        onClick: () =>
          router.push(appPaths.vaults.vault(address).steth('repay')),
      },
      {
        title: 'Decrease Total Value and stETH Liability',
        children: 'Learn how to rebalance',
        onClick: () => window.open(healthEmergencyGuideLink, '_blank'),
      },
    ];
  }, [stETHToBurn, obligationsShortfallValue, router, address]);

  return (
    <ActionContainer>
      {actions.map(({ title, amount, symbol, children, onClick }, index) => {
        const showDivider = index !== actions.length - 1;

        return (
          <>
            <Action
              key={title}
              title={title}
              amount={amount}
              onClick={onClick}
              symbol={symbol}
            >
              {children}
            </Action>
            {showDivider && <SectionDivider type="vertical" />}
          </>
        );
      })}
    </ActionContainer>
  );
};
