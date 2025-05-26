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

  const values: MainSettingsDataContextValue = useMemo(() => {
    if (!activeVault || !confirmationsList) {
      return null;
    }

    const confirmExpiry: VotingOptionType[] = [
      {
        value: Number(activeVault.confirmExpiry / (60n * 60n)),
        type: 'current',
      },
    ];

    const nodeOperatorFeeBP: VotingOptionType[] = [
      {
        value: Number(
          (activeVault.nodeOperatorFeeBP * 100n) / VAULT_TOTAL_BASIS_POINTS_BN,
        ),
        type: 'current',
      },
    ];

    confirmationsList.map((confirmation) => {
      const type = confirmation.member !== address ? 'to_me' : 'by_me';

      if (confirmation.decodedData.functionName === 'setConfirmExpiry') {
        confirmExpiry.push({
          value: Number(confirmation.decodedData.args[0] / (60n * 60n)),
          expiryDate: confirmation.expiryDate,
          type,
        });
      } else if (
        confirmation.decodedData.functionName === 'setNodeOperatorFeeBP'
      ) {
        nodeOperatorFeeBP.push({
          value: Number(
            (confirmation.decodedData.args[0] * 100n) /
              VAULT_TOTAL_BASIS_POINTS_BN,
          ),
          expiryDate: confirmation.expiryDate,
          type,
        });
      }
    });

    nodeOperatorFeeBP.push({
      value: 0,
      type: 'edit',
    });

    confirmExpiry.push({
      value: 0,
      type: 'edit',
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
      nodeOperatorFeeBP,
      confirmExpiry,
    };
  }, [activeVault, confirmationsList, address]);

  return (
    <MainSettingsDataContext.Provider value={values}>
      {children}
    </MainSettingsDataContext.Provider>
  );
};
