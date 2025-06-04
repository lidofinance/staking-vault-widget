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
  isFocused: boolean,
  hasError: boolean,
  symbol?: string | undefined,
  format?: (arg: string) => string,
) => {
  if (isFocused || hasError) {
    return value;
  }

  return formatValueView(value, symbol, format);
};

export const formatValueView = (
  value: string,
  symbol?: string,
  formatter?: (arg: string) => string,
) => {
  if (!value) {
    return '';
  }

  if (formatter) {
    return formatter(value);
  }

  if (symbol) {
    return `${value}${symbol}`;
  }

  return value;
};

export const formatSecondsToHours = (totalSeconds: number | string): string => {
  const seconds =
    typeof totalSeconds === 'string' ? Number(totalSeconds) : totalSeconds;

  if (isNaN(seconds)) {
    return totalSeconds as string;
  }

  const hours = Math.floor(seconds / 3600);
  const remainingSeconds = seconds % 3600;
  const minutes = Math.floor(remainingSeconds / 60);

  if (minutes === 0) {
    return `${hours} hours`;
  }

  return `${hours}h ${minutes}m`;
};
