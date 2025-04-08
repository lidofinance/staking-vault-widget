import { Address } from 'viem';
import { useCallback } from 'react';
import { useConfig } from 'wagmi';
import { useWriteContracts } from 'wagmi/experimental';
import { useVaultInfo } from 'features/overview/contexts';
import { DelegationAbi } from 'abi/delegation';

export const useEditMainSettingsWithDelegation = (onMutate = () => {}) => {
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();
  // TODO: discuss
  // https://github.com/ethereum/EIPs/blob/815028dc634463e1716fc5ce44c019a6040f0bef/EIPS/eip-5792.md#wallet_sendcalls
  const { data: editMainSettingsTx, writeContractsAsync } = useWriteContracts({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  // TODO: add opportunity to get receipts
  const callEditMainSettings = useCallback(
    // TODO: fix type
    async (paylad: any) => {
      // getRoleMembers(NODE_OPERATOR_MANAGER_ROLE) -> NODE_OPERATOR_MANAGER_ROLE -> (grantRole)
      // confirmingRoles -> DEFAULT_ADMIN_ROLE -> (transferStakingVaultOwnership)
      // nodeOperatorFeeBP -> nodeOperatorFeeBP -> (setNodeOperatorFeeBP)
      // getConfirmExpiry -> confirmExpiry -> (setConfirmExpiry)
      // TODO: replace example below by real contacts calls
      return await writeContractsAsync({
        contracts: [
          {
            abi: DelegationAbi,
            address: activeVault?.owner as Address,
            functionName: 'setConfirmExpiry',
            args: [BigInt(paylad.confirmExpiry)],
          },
        ],
      });
    },
    [writeContractsAsync, activeVault?.owner],
  );

  return {
    callEditMainSettings,
    editMainSettingsTx,
  };
};
