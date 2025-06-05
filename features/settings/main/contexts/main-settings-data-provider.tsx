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
import { useVaultInfo } from 'modules/vaults';
import { useConfirmationsInfo } from 'features/settings/main/hooks';
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
  const { activeVault } = useVaultInfo();
  const { data: confirmationsList } = useConfirmationsInfo();

  const values: MainSettingsDataContextValue | null = useMemo(() => {
    if (!activeVault || !confirmationsList) {
      return null;
    }

    // Current values for voting
    const {
      confirmExpiryValue,
      nodeOperatorFeeBPValue,
      defaultAdmins,
      nodeOperatorManagers,
    } = formatSettingsValues(activeVault);

    const confirmExpiry: VotingOptionType[] = [
      {
        value: confirmExpiryValue,
        type: 'current',
        tags: ['Current'],
        format: formatSecondsToHours,
        symbol: ' hours',
      },
    ];
    const nodeOperatorFeeBP: VotingOptionType[] = [
      {
        value: nodeOperatorFeeBPValue,
        type: 'current',
        tags: ['Current'],
        symbol: '%',
      },
    ];

    confirmationsList.map((confirmation) => {
      const type =
        confirmation.member !== address ? 'Proposed to me' : 'My proposal';
      const expiry = formatSecondsToHours(
        (new Date(Number(confirmation.expiryTimestamp) * 1000).getTime() -
          new Date().getTime()) /
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
        confirmation.decodedData.functionName === 'setNodeOperatorFeeBP'
      ) {
        nodeOperatorFeeBP.push({
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
    nodeOperatorFeeBP.push({
      value: '',
      type: 'custom',
      tags: [],
      symbol: '%',
      placeholder: 'Propose new, %',
    });

    return {
      defaultAdmins,
      nodeOperatorManagers,
      nodeOperatorFeeBP: nodeOperatorFeeBP.sort((a, b) => {
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
  }, [activeVault, confirmationsList, address]);

  return (
    <MainSettingsDataContext.Provider value={values}>
      {children}
    </MainSettingsDataContext.Provider>
  );
};
