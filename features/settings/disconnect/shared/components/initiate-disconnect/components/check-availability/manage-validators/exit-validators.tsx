import { type FC, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Text, Button, Link } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';
import { formatCustomDate } from 'utils/formats';
import { config } from 'config';

import { AvailabilityItem } from '../styles';

type ExitValidatorsProps = {
  timestamp: number;
};

const { docsOrigin } = config;
const docLink = `${docsOrigin}/run-on-lido/stvaults/features-and-mechanics/exit-validators`;

export const ExitValidators: FC<ExitValidatorsProps> = ({ timestamp }) => {
  const router = useRouter();
  const { vaultAddress } = useVault();

  const handleNavigate = useCallback(() => {
    if (!vaultAddress) return;

    void router.push(appPaths.vaults.vault(vaultAddress).validators);
  }, [vaultAddress, router]);

  return (
    <AvailabilityItem>
      <div>
        <Text size="xxs" strong>
          Exit validators
        </Text>
        <Text size="xxs" as="span">
          Active validators or pending deposits detected
          <p>Last update: {formatCustomDate(timestamp)}</p>
        </Text>
        <Link href={docLink}>learn more</Link>
      </div>
      <Button variant="outlined" size="xs" onClick={handleNavigate}>
        Manage validators
      </Button>
    </AvailabilityItem>
  );
};
