import {
  FC,
  PropsWithChildren,
  useMemo,
  createContext,
  useContext,
} from 'react';
import invariant from 'tiny-invariant';

import {
  MainSettingsDataContextValue,
  VotingOptionType,
} from 'features/settings/main/types';
import { useVaultSettings } from 'features/settings/main/hooks';
import { useDappStatus } from 'modules/web3';

import { formatSecondsToHours, formatSettingsValues } from '../utils';

const MainSettingsDataContext = createContext<
  MainSettingsDataContextValue | undefined | null
>(undefined);
MainSettingsDataContext.displayName = 'MainSettingsDataContext';

export const useMainSettingsData = () => {
  const context = useContext(MainSettingsDataContext);
  if (context === undefined) {
    invariant(context, 'Attempt to use `feature flag` outside of provider');
  }
  return context;
};

export const MainSettingsDataProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { address } = useDappStatus();
  const { data: vaultSettingsData } = useVaultSettings();

  const values: MainSettingsDataContextValue | null = useMemo(() => {
    if (!vaultSettingsData) {
      return null;
    }

    const { confirmations, ...vaultSettings } = vaultSettingsData;

    // Current values for voting
    const {
      confirmExpiryValue,
      nodeOperatorFeeRateValue,
      defaultAdmins,
      nodeOperatorManagers,
      nodeOperatorFeeRecipient,
    } = formatSettingsValues(vaultSettings);

    const confirmExpiry: VotingOptionType[] = [
      {
        value: confirmExpiryValue,
        type: 'current',
        tags: ['Current'],
        format: formatSecondsToHours,
        symbol: ' hours',
      },
    ];
    const nodeOperatorFeeRate: VotingOptionType[] = [
      {
        value: nodeOperatorFeeRateValue,
        type: 'current',
        tags: ['Current'],
        symbol: '%',
      },
    ];

    confirmations.forEach((confirmation) => {
      const type =
        confirmation.member !== address ? 'Proposed to me' : 'My proposal';
      const expiry = formatSecondsToHours(
        (Number(confirmation.expiryTimestamp) * 1000 - new Date().getTime()) /
          1000,
        true,
      );

      if (confirmation.decodedData.functionName === 'setConfirmExpiry') {
        confirmExpiry.push({
          value: String(Number(confirmation.decodedData.args[0])),
          tags: [expiry, type],
          type,
          format: formatSecondsToHours,
          symbol: ' hours',
        });
      } else if (
        confirmation.decodedData.functionName === 'setNodeOperatorFeeRate'
      ) {
        nodeOperatorFeeRate.push({
          value: String(
            Number(confirmation.decodedData.args[0] * 100n) / 10000,
          ),
          tags: [expiry, type],
          type,
          symbol: '%',
        });
      }
    });

    // Custom values for voting
    confirmExpiry.push({
      value: '',
      type: 'custom',
      tags: [],
      symbol: ' hours',
      placeholder: 'Propose new, hours',
    });
    nodeOperatorFeeRate.push({
      value: '',
      type: 'custom',
      tags: [],
      symbol: '%',
      placeholder: 'Propose new, %',
    });

    return {
      defaultAdmins,
      nodeOperatorManagers,
      nodeOperatorFeeRecipient,
      nodeOperatorFeeRate: nodeOperatorFeeRate.sort((a, b) => {
        if (a.type === 'My proposal') return 1;
        if (b.type === 'My proposal') return -1;
        return 0;
      }),
      confirmExpiry: confirmExpiry.sort((a, b) => {
        if (a.type === 'My proposal') return 1;
        if (b.type === 'My proposal') return -1;
        return 0;
      }),
    };
  }, [vaultSettingsData, address]);

  return (
    <MainSettingsDataContext.Provider value={values}>
      {children}
    </MainSettingsDataContext.Provider>
  );
};
