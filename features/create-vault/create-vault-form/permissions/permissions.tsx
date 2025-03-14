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

interface PermissionsRoles {
  role: string;
  title: string;
  tooltip: string;
}

// const rolesList: PermissionsRoles[] = [
//   {
//     role: 'defaultAdmin',
//     title: 'Vault Manager',
//     tooltip: 'One of two admin roles for the stVault. Allows to manage permissions and change key Vault parameters. Vault Manager role can be considered as Vault Owner for the User. Multiple addresses supported.',
//   },
//   {
//     role: 'nodeOperatorManager',
//     title: 'Node Operator Manager',
//     tooltip: 'One of two admin roles for the stVault. Allows to manage permissions and change key Vault parameters from the Node Operator perspective. Multiple addresses supported.',
//   },
// ];
//
// const vaultSettingList: PermissionsRoles[] = [
//   {
//     role: 'confirmExpiry',
//     title: 'Confirmation LifeTime',
//     tooltip: 'The main parameter of “Multi-role confirmation” mechanism. This mechanism is used for editing some of Vault’s parameters via finding consensus between two representatives of stVault: Vault Manager and Node Operator Manager. Mandatory parameter, hours [24h .. ‘no limit’]. In this mechanism, first representative initiates changing the parameter and another representative confirms the changing within “Confirmation LifeTime” period of time. Used for:\n- Node Operator Fee\n- Confirmation LifeTime',
//   },
//   {
//     role: 'curatorFeeBP',
//     title: 'Curator fee',
//     tooltip: 'Curator fee',
//   },
//   {
//     role: 'nodeOperatorFeeBP',
//     title: 'Node Operator fee',
//     tooltip: 'Node Operator fee',
//   },
// ];

const adminPermissionsList: PermissionsRoles[] = [
  {
    role: 'curatorFeeSetters',
    title: 'Set Curator’s Fee',
    tooltip:
      'Allows changing the Curator’s fee. Curator’s fee is optional. Curator’s fee are deducted from the rewards alongside Node Operator’s fee.',
  },
  {
    role: 'curatorFeeClaimers',
    title: 'Claim Curator’s Accumulated Fee',
    tooltip:
      'Allows claiming accumulated Curator’s fee. Claimer provides an address to receive fees every time.',
  },
  {
    role: 'funders',
    title: 'Fund ETH',
    tooltip: 'Allows Funding ETH',
  },
  {
    role: 'withdrawers',
    title: 'Withdraw ETH',
    tooltip: 'Allows Withdrawing unlocked ETH from stVault',
  },
  {
    role: 'depositPausers',
    title: 'Pause Deposits to Validators',
    tooltip:
      'Allows requesting the Node Operator to pause deposits to Validators to keep available ETH on the Vault balance.',
  },
  {
    role: 'depositResumers',
    title: 'Resume Deposits to Validators',
    tooltip:
      'Allows informing the Node Operator that deposits to Validators can be resumed.',
  },
  {
    role: 'validatorWithdrawalTriggerers',
    title: 'Force Withdrawals ETH from Validator',
    tooltip:
      'Allows forced withdrawing ETH from validator and returning it to Vault balance.',
  },
  {
    role: 'validatorExitRequesters',
    title: 'Request Node Operator to Exit Validator',
    tooltip:
      'Allows creating a request for Node Operator to exit a validator and return all ETH from this validator to the Vault balance.',
  },
  {
    role: 'rebalancers',
    title: 'Re-balance unhealthy Vault',
    tooltip: 'Allows rebalancing stVault if Health rate < 100%.',
  },
  {
    role: 'minters',
    title: 'Mint stETH',
    tooltip: 'Allows Minting stETH (considering ReserveRatio)',
  },
  {
    role: 'burners',
    title: 'Burn stETH',
    tooltip: 'Allows Burning stETH',
  },
  {
    role: 'disconnecters',
    title: 'Voluntary disconnect Vault from Lido Vault Hub',
    tooltip: 'Allows voluntary disconnecting stVault from the Lido Vault Hub.',
  },
];

const noPermissionsList: PermissionsRoles[] = [
  {
    role: 'nodeOperatorFeeClaimers',
    title: 'Claim Node Operator’s Accumulated Fees',
    tooltip:
      'Allows claiming accumulated Node Operator’s fee. Claimer provides an address to receive fees.',
  },
];

interface RenderPermissions {
  permissionsTitle: string;
  payload: PermissionsRoles[];
}

const renderPermissionsList: RenderPermissions[] = [
  {
    permissionsTitle: 'Vault Manager Permissions',
    payload: adminPermissionsList,
  },
  {
    permissionsTitle: 'Node Operator Manager Permissions',
    payload: noPermissionsList,
  },
];

export const Permissions = () => {
  const { step } = useCreateVaultFormData();

  return (
    <SectionContainer step={step} currentStep={2}>
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
