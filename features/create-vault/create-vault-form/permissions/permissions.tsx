import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { RoleDescription } from 'features/create-vault/create-vault-form/permissions/role-description';
import { AddressList } from 'features/create-vault/create-vault-form/permissions/address-list';
import { PermissionsAction } from 'features/create-vault/create-vault-form/permissions/permissions-action';
import {
  PermissionBlock,
  PermissionContainer,
  PermissionGroupTitle,
  PermissionRoleWrapper,
} from './styles';
import { SectionContainer } from 'features/create-vault/styles';
import { PermissionKeys } from 'features/create-vault/types';
import { CREATE_VAULT_FORM_STEPS } from '../../consts';

type PermissionsRoles = {
  role: PermissionKeys;
  title: string;
  tooltip: string;
};

export const VAULT_MANAGER_PERMISSIONS_LIST: PermissionsRoles[] = [
  {
    role: 'funder',
    title: 'Mint ETH',
    tooltip: 'Allows Funding ETH',
  },
  {
    role: 'withdrawer',
    title: 'Repay ETH',
    tooltip: 'Allows Withdrawing unlocked ETH from stVault',
  },
  {
    role: 'minter',
    title: 'Mint stETH',
    tooltip: 'Allows Minting stETH (considering ReserveRatio)',
  },
  {
    role: 'burner',
    title: 'Burn stETH',
    tooltip: 'Allows Burning stETH',
  },
  {
    role: 'depositsPauser',
    title: 'Pause Deposits to Validators',
    tooltip:
      'Allows requesting the Node Operator to pause deposits to Validators to keep available ETH on the Vault balance.',
  },
  {
    role: 'depositsResumer',
    title: 'Resume Deposits to Validators',
    tooltip:
      'Allows informing the Node Operator that deposits to Validators can be resumed.',
  },

  {
    role: 'validatorWithdrawalTrigger',
    title: 'Force Withdrawals ETH from Validator',
    tooltip:
      'Allows forced withdrawing ETH from validator and returning it to Vault balance.',
  },
  {
    role: 'validatorExitRequester',
    title: 'Request Node Operator to Exit Validator',
    tooltip:
      'Allows creating a request for Node Operator to exit a validator and return all ETH from this validator to the Vault balance.',
  },
  {
    role: 'rebalancer',
    title: 'Re-balance unhealthy Vault',
    tooltip: 'Allows rebalancing stVault if Health rate < 100%.',
  },
  {
    role: 'volunataryDisconnecter',
    title: 'Voluntary disconnect Vault from Lido Vault Hub',
    tooltip: 'Allows voluntary disconnecting stVault from the Lido Vault Hub.',
  },
  {
    role: 'assetRecoverer',
    title: 'Recover tokens from Dashboard contract',
    tooltip: 'Allows to recover ERC20 & NFTs from the Dashboard contract.',
  },
  {
    role: 'depositorSetter',
    title: 'Set vault depositorin unconnected vault',
    tooltip:
      'Allows to change the vault depositor when not connected to Lido Vault Hub.',
  },
  {
    role: 'lockResetter',
    title: 'Reset lock amount in unconnected vault',
    tooltip:
      'Allows to reset lock amount when not connected to Lido Vault Hub.',
  },

  {
    role: 'locker',
    title: 'Increase lock amount in unconnected vault',
    tooltip:
      'Allows to increase lock amount when not connected to Lido Vault Hub.',
  },

  {
    role: 'ossifyer',
    title: 'Ossify vault',
    tooltip:
      'Allows to ossify vault implementation when not connected to Lido Vault Hub. Prevents changes to the vault.',
  },

  {
    role: 'pdgCompensater',
    title: 'Compensate disproven validator in PDG',
    tooltip:
      'Allows to return predeposted ETH from validator if it was proven invalid in PDG',
  },

  {
    role: 'pdgProver',
    title: 'Prove unknown validator in PDG',
    tooltip: 'Allows to prove validators with correct credentials to PDG ',
  },

  {
    role: 'unguaranteedDepositor',
    title: 'Perform unguaranteed deposit to beacon chain',
    tooltip:
      'Allows to withdraw vault funds and perform unguaranteed deposit to beacon chain',
  },

  {
    role: 'tierChangeRequester',
    title: 'Request tier change in Operator Grid',
    tooltip: 'Allows to request tier change in Operator Grid',
  },

  {
    role: 'vaultHubAuthorizer',
    title: 'Authorize Lido VaultHub to the vault',
    tooltip: 'Allows to authorize Lido VaultHub to the vault',
  },
  {
    role: 'vaultHubDeathorizer',
    title: 'Deauthorize Lido VaultHub to the vault',
    tooltip: 'Allows to deauthorize Lido VaultHub to the vault',
  },
];

export const NO_MANAGER_PERMISSION_LIST: PermissionsRoles[] = [
  {
    role: 'nodeOperatorFeeClaimer',
    title: 'ClaimPage Node Operator’s Accumulated Fees',
    tooltip:
      'Allows claiming accumulated Node Operator’s fee. Claimer provides an address to receive fees.',
  },
  {
    role: 'nodeOperatorRewardsAdjuster',
    title: 'Adjust Node Operator’s Rewards',
    tooltip:
      'Allows to adjust accrued rewards(due to side deposits or consolidations) to decrease claimable fee',
  },
];

type RenderPermissions = {
  permissionsTitle: string;
  payload: PermissionsRoles[];
};

const renderPermissionsList: RenderPermissions[] = [
  {
    permissionsTitle: 'Vault Manager Permissions',
    payload: VAULT_MANAGER_PERMISSIONS_LIST,
  },
  {
    permissionsTitle: 'Node Operator Manager Permissions',
    payload: NO_MANAGER_PERMISSION_LIST,
  },
];

export const Permissions = () => {
  const { step } = useCreateVaultFormData();

  return (
    <SectionContainer
      step={step}
      currentStep={CREATE_VAULT_FORM_STEPS.permissions}
    >
      {renderPermissionsList.map(({ permissionsTitle, payload }) => (
        <PermissionContainer key={permissionsTitle}>
          <PermissionGroupTitle>{permissionsTitle}</PermissionGroupTitle>
          <PermissionBlock>
            {payload.map(({ role, title, tooltip }) => {
              return (
                <PermissionRoleWrapper key={role}>
                  <RoleDescription
                    permission={role}
                    description={title}
                    tooltip={tooltip}
                  />
                  <AddressList permission={role} />
                </PermissionRoleWrapper>
              );
            })}
          </PermissionBlock>
        </PermissionContainer>
      ))}
      <PermissionsAction />
    </SectionContainer>
  );
};
