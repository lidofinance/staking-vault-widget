import { FC, useMemo } from 'react';

import { Input } from '@lidofinance/lido-ui';
import { GeneralInputWrapper } from './styles';

import { VaultInfo } from 'types';
import { useVaultInfo } from 'modules/vaults';

export interface GeneralInputProps {
  label: string;
  vaultKey: keyof VaultInfo;
}

export const ReadonlyInput: FC<GeneralInputProps> = ({ label, vaultKey }) => {
  const { activeVault } = useVaultInfo();
  const renderData = useMemo(() => {
    let value = activeVault?.[vaultKey] as string | number | bigint | undefined;
    if (typeof value !== 'undefined') {
      // TODO: make it pretty
      if (vaultKey === 'confirmExpiry') {
        value = (value as bigint) / (60n * 60n);
      }

      if (vaultKey === 'nodeOperatorFeeBP') {
        value = (value as bigint) / 100n;
      }

      return String(value);
    }

    return value;
  }, [activeVault, vaultKey]);

  return (
    <GeneralInputWrapper>
      <Input label={label} value={renderData} type="text" fullwidth disabled />
    </GeneralInputWrapper>
  );
};
