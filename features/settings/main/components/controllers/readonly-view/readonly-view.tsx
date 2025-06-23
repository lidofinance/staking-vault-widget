import { FC, useMemo } from 'react';

import { Text } from '@lidofinance/lido-ui';
import { Wrapper } from './styles';

import { VaultMainSettingsData } from 'features/settings/main/types';

export type ReadonlyViewProps = {
  vaultKey: keyof VaultMainSettingsData;
  value: VaultMainSettingsData[keyof VaultMainSettingsData];
};

export const ReadonlyView: FC<ReadonlyViewProps> = ({ vaultKey, value }) => {
  const renderData = useMemo(() => {
    let displayValue = value as string | number | bigint | undefined;
    if (typeof displayValue !== 'undefined') {
      // TODO: make it pretty
      if (vaultKey === 'confirmExpiry') {
        displayValue = `${(displayValue as bigint) / (60n * 60n)} hours`;
      }

      if (vaultKey === 'nodeOperatorFeeRate') {
        displayValue = `${(displayValue as bigint) / 100n}%`;
      }

      return String(displayValue);
    }

    return displayValue;
  }, [value, vaultKey]);

  return (
    <Wrapper>
      <Text size="xs">{renderData}</Text>
    </Wrapper>
  );
};
