import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { appPaths } from 'consts/routing';
import { vaultTexts } from 'modules/vaults';
import { isBigint } from 'utils';

import { useVaultOverview } from 'features/overview/vault-overview';

import { SectionDivider } from '../styles';
import { ActionContainer } from './styles';
import { Action } from './action';

const healthEmergencyGuideLink =
  'https://docs.lido.fi/run-on-lido/stvaults/operational-and-management-guides/health-emergency-guide';

const texts = vaultTexts.metrics.capacityExceeded;

export const RepayObligations = () => {
  const router = useRouter();
  const { values } = useVaultOverview();
  const { address, supplyETH, repayStETH } = values ?? {};

  const actions = useMemo(() => {
    if (!address) {
      return [];
    }

    const items = [];

    if (isBigint(supplyETH) && supplyETH >= 0n) {
      items.push({
        title: texts.actions.supply.title,
        children: texts.actions.supply.children,
        symbol: 'ETH',
        amount: supplyETH,
        onClick: () =>
          router.push(appPaths.vaults.vault(address).eth('supply')),
      });
    }

    if (isBigint(repayStETH) && repayStETH >= 0n) {
      items.push({
        title: texts.actions.repay.title,
        children: texts.actions.repay.children,
        symbol: 'stETH',
        amount: repayStETH,
        onClick: () =>
          router.push(appPaths.vaults.vault(address).steth('repay')),
      });
    }

    items.push({
      title: texts.actions.learnMore.title,
      children: texts.actions.learnMore.children,
      onClick: () => window.open(healthEmergencyGuideLink, '_blank'),
    });

    return items;
  }, [supplyETH, repayStETH, router, address]);

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
