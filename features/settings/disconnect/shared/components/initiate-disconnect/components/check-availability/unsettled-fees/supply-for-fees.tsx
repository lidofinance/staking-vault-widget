import { type FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Text, Button } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';

import { AvailabilityItem } from '../styles';

type SupplyForFeesProps = {
  diff: bigint;
};

export const SupplyForFees: FC<SupplyForFeesProps> = ({ diff }) => {
  const router = useRouter();
  const { vaultAddress } = useVault();

  const handleNavigate = useCallback(() => {
    if (!vaultAddress) return;

    void router.push(appPaths.vaults.vault(vaultAddress).eth('supply'));
  }, [vaultAddress, router]);

  return (
    <AvailabilityItem>
      <div>
        <Text size="xxs" strong data-testid="title">
          Supply ETH for unsettled fees
        </Text>
        <Text size="xxs" data-testid="value">
          Shortage = <FormatToken amount={diff} symbol="ETH" />
        </Text>
      </div>
      <Button
        variant="outlined"
        size="xs"
        onClick={handleNavigate}
        data-testid="action-btn"
      >
        Supply ETH
      </Button>
    </AvailabilityItem>
  );
};
