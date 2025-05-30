import { MainSettingsDataContextValue } from './types';

export const shouldIncrementTxCounter = (
  value: string,
  defaultValue: number | undefined,
  custom: string | undefined,
) => {
  return (
    (value !== 'other' && Number(value) !== defaultValue) ||
    (value === 'other' && Boolean(custom))
  );
};

export const getHoursDifference = (dateA: Date, dateB: Date) => {
  return Math.ceil((dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60));
};

export const prepareDefaultValues = (
  promisifiedSettingsData: Promise<MainSettingsDataContextValue | null>,
) => {
  return async () => {
    const settingsData = await promisifiedSettingsData;
    if (settingsData) {
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
        confirmExpiry: confirmExpiryCurrent ?? 0,
        confirmExpiryDefault: confirmExpiryCurrent ?? 0,
        nodeOperatorFeeBP: nodeOperatorFeeBPCurrent ?? 0,
        nodeOperatorFeeBPDefault: nodeOperatorFeeBPCurrent ?? 0,
      };
    }

    return {
      nodeOperatorManagers: [],
      defaultAdmins: [],
      confirmExpiry: 0,
      confirmExpiryDefault: 0,
      nodeOperatorFeeBP: 0,
      nodeOperatorFeeBPDefault: 0,
    };
  };
};
