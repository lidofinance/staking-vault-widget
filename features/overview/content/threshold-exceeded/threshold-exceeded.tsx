import { useMemo } from 'react';
import { useRouter } from 'next/router';

import { vaultTexts } from 'modules/vaults';

import { NoticeContainer } from 'features/overview/shared';

const {
  thresholdExceeded: { title, description, note, actions },
} = vaultTexts.metrics;

const actionsFundsMap_MOCK = {
  supply: {
    amount: '18.0034 ETH',
    path: '/vaults/0x70bc246439962111645cddaeab49e44154d02d22/eth/supply',
  },
  repay: {
    amount: '15.0034 stETH',
    path: '/vaults/0x70bc246439962111645cddaeab49e44154d02d22/steth/repay',
  },
  rebalance: {
    amount: '45.8855 ETH',
    path: '#',
  },
} as const;

export const ThresholdExceeded = () => {
  const router = useRouter();

  // TODO: calculate Supply, Repay, Rebalance
  const viewActions = useMemo(
    () =>
      actions.map(({ name, getText, title }) => {
        const event = actionsFundsMap_MOCK[name];
        const buttonText = getText(event.amount);
        const navigate = () => router.push(event.path);
        return {
          buttonText,
          navigate,
          title,
        };
      }),
    [router],
  );

  return (
    <NoticeContainer
      title={title}
      description={description}
      note={note}
      actions={viewActions}
      type="error"
    />
  );
};
