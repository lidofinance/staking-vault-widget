import { type FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Text, Button } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { AvailabilityItem } from '../styles';

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
    <AvailabilityItem>
      <div>
        <Text size="xxs" strong data-testid="title">
          Repay all minted stETH
        </Text>
        <Text size="xxs" data-testid="value">
          stVault Liability = <FormatToken amount={liability} symbol="stETH" />
        </Text>
      </div>
      <Button
        variant="outlined"
        size="xs"
        onClick={handleNavigate}
        data-testid="action-btn"
      >
        Repay stETH
      </Button>
    </AvailabilityItem>
  );
};
