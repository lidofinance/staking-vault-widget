import {
  FC,
  PropsWithChildren,
  useMemo,
  createContext,
  useContext,
} from 'react';

import {
  MainSettingsDataContextValue,
  VotingOptionType,
} from 'features/settings/main/types';
import { useVaultInfo, VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults';
import { useConfirmationsInfo } from 'features/settings/main/hooks';
import { useDappStatus } from 'modules/web3';

const MainSettingsDataContext =
  createContext<MainSettingsDataContextValue | null>(null);
MainSettingsDataContext.displayName = 'MainSettingsDataContext';

export const useMainSettingsData = () => {
  return useContext(MainSettingsDataContext);
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
    const currentConfirmExpiry = activeVault.confirmExpiry / (60n * 60n);
    const currentNodeOperatorFeeBP = Number(
      (activeVault.nodeOperatorFeeBP * 100n) / VAULT_TOTAL_BASIS_POINTS_BN,
    );

    const confirmExpiry: VotingOptionType[] = [
      {
        value: String(currentConfirmExpiry),
        type: 'current',
        tags: ['Current'],
        symbol: ' hours',
      },
    ];
    const nodeOperatorFeeBP: VotingOptionType[] = [
      {
        value: String(currentNodeOperatorFeeBP),
        type: 'current',
        tags: ['Current'],
        symbol: '%',
      },
    ];

    confirmationsList.map((confirmation) => {
      const type =
        confirmation.member !== address ? 'Proposed to me' : 'My proposal';
      const expiry = (
        (new Date(confirmation.expiryDate).getTime() - new Date().getTime()) /
        (60 * 60 * 1000)
      ).toFixed(0);

      if (confirmation.decodedData.functionName === 'setConfirmExpiry') {
        confirmExpiry.push({
          value: String(confirmation.decodedData.args[0] / (60n * 60n)),
          tags: [`${String(expiry)} hours`, type],
          type,
          symbol: ' hours',
        });
      } else if (
        confirmation.decodedData.functionName === 'setNodeOperatorFeeBP'
      ) {
        nodeOperatorFeeBP.push({
          value: String(
            Number(confirmation.decodedData.args[0] * 100n) / 10000,
          ),
          tags: [`${String(expiry)} hours`, type],
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
      defaultAdmins: activeVault.defaultAdmins.map((address) => ({
        value: address,
        state: 'display',
        isGranted: true,
      })),
      nodeOperatorManagers: activeVault.nodeOperatorManagers.map((address) => ({
        value: address,
        state: 'display',
        isGranted: true,
      })),
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
