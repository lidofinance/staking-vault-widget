import { MainSettingsDataContextValue } from './types';
import invariant from 'tiny-invariant';

export const shouldIncrementTxCounter = (
  value: string,
  defaultValue: string | undefined,
) => {
  return value !== defaultValue;
};

export const prepareDefaultValues = (
  promisifiedSettingsData: Promise<MainSettingsDataContextValue | null>,
) => {
  return async () => {
    const settingsData = await promisifiedSettingsData;
    invariant(settingsData, '[prepareDefaultValues] settings data is empty.');

    const {
      confirmExpiry,
      defaultAdmins,
      nodeOperatorFeeBP,
      nodeOperatorManagers,
    } = settingsData;
    const confirmExpiryCurrent = confirmExpiry.find(
      (item) => item.type === 'current',
    )?.value;
    const nodeOperatorFeeBPCurrent = nodeOperatorFeeBP.find(
      (item) => item.type === 'current',
    )?.value;

    return {
      defaultAdmins,
      nodeOperatorManagers,
      confirmExpiry: String(confirmExpiryCurrent),
      nodeOperatorFeeBP: String(nodeOperatorFeeBPCurrent),
    };
  };
};

export const formatInputValue = (
  value: string,
  symbol: string | undefined,
  isFocused: boolean,
) => {
  if (symbol && value) {
    return isFocused ? value : `${value}${symbol}`;
  }

  return value;
};
