import { type FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Text, Button } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { RepayContainer } from './styles';

type RepayLiabilityProps = {
  liability: bigint;
};

export const RepayLiability: FC<RepayLiabilityProps> = ({ liability }) => {
  const router = useRouter();
  const { vaultAddress } = useVault();

  const handleNavigate = useCallback(() => {
    if (!vaultAddress) return;

    void router.push(appPaths.vaults.vault(vaultAddress).steth('repay'));
  }, [vaultAddress, router]);

  return (
    <RepayContainer>
      <div>
        <Text size="xxs" strong>
          Repay all minted stETH
        </Text>
        <Text size="xxs">
          stVault Liability = <FormatToken amount={liability} symbol="stETH" />
        </Text>
      </div>
      <Button variant="outlined" size="xs" onClick={handleNavigate}>
        Repay stETH
      </Button>
    </RepayContainer>
  );
};
