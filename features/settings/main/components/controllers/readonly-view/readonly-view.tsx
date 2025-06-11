import { FC, useMemo } from 'react';

import { Text } from '@lidofinance/lido-ui';
import { Wrapper } from './styles';

import { VaultInfo } from 'types';
import { useVaultInfo } from 'modules/vaults';

export interface ReadonlyViewProps {
  vaultKey: keyof VaultInfo;
}

export const ReadonlyView: FC<ReadonlyViewProps> = ({ vaultKey }) => {
  const { activeVault } = useVaultInfo();
  const renderData = useMemo(() => {
    let value = activeVault?.[vaultKey] as string | number | bigint | undefined;
    if (typeof value !== 'undefined') {
      // TODO: make it pretty
      if (vaultKey === 'confirmExpiry') {
        value = `${(value as bigint) / (60n * 60n)} hours`;
      }

      if (vaultKey === 'nodeOperatorFeeBP') {
        value = `${(value as bigint) / 100n}%`;
      }

      return String(value);
    }

    return value;
  }, [activeVault, vaultKey]);

  return (
    <Wrapper>
      <Text size="xs">{renderData}</Text>
    </Wrapper>
  );
};
