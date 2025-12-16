import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { Text } from '@lidofinance/lido-ui';

import { appPaths } from 'consts/routing';
import { toEthValue, toStethValue } from 'utils';

import { useVaultOverview } from 'features/overview/vault-overview';

import { SectionDivider } from '../styles';
import { ActionButton, ActionContainer, ActionWrapper } from './styles';

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
        buttonText: `Supply ${toEthValue(obligationsShortfallValue)}`,
        onClick: () =>
          router.push(appPaths.vaults.vault(address).eth('supply')),
      },
      {
        title: 'Decrease stETH Liability',
        buttonText: `Repay ${toStethValue(stETHToBurn)}`,
        onClick: () =>
          router.push(appPaths.vaults.vault(address).steth('repay')),
      },
    ];
  }, [stETHToBurn, obligationsShortfallValue, router, address]);

  return (
    <ActionContainer>
      {actions.map(({ onClick, buttonText, title }, index) => {
        const showDivider = actions.length !== index + 1;

        return (
          <>
            <ActionWrapper key={title}>
              <Text size="xxs" strong>
                {title}
              </Text>
              <ActionButton
                onClick={onClick}
                size="xs"
                variant="outlined"
                color="secondary"
              >
                {buttonText}
              </ActionButton>
            </ActionWrapper>
            {showDivider && <SectionDivider type="vertical" />}
          </>
        );
      })}
    </ActionContainer>
  );
};
