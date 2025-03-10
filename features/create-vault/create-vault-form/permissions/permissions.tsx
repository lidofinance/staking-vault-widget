import { RoleDescription } from 'features/create-vault/create-vault-form/permissions/role-description';
import { AddressList } from './address-list';
import { useCreateVaultFormData } from '../create-vault-form-context';
import {
  PermissionBlock,
  PermissionContainer,
  PermissionGroupTitle,
  PermissionRoleWrapper,
  PermissionWrapper,
} from './styles';
import { PermissionsAction } from './permissions-action';

const permissionsTitleMap: Record<string, string> = {
  curatorFeeSetters: 'Set Vault Curator’s fee',
  curatorFeeClaimers: 'Claim Vault Curator’s fee (address)',
  funders: 'Fund ETH (sum)',
  withdrawers: 'Withdraw available ETH (sum)',
  depositPausers: 'Pause Deposits to beacon chain (all amount)',
  depositResumers: 'Resume Deposits to beacon chain (all amount)',
  validatorWithdrawalTriggerers:
    'Force NodeOperator to withdraw funds from validator(s) (public key, sum)',
  // minters: [],
  // burners: [],
  // rebalancers: [],
  // validatorExitRequesters: [],
  // disconnecters: [],
  nodeOperatorFeeClaimers: 'Claim NOs fees from the vault (ETH) (address)',
};

export const Permissions = () => {
  const { step } = useCreateVaultFormData();

  return (
    <PermissionWrapper step={step}>
      <PermissionContainer>
        <PermissionGroupTitle>Vault Manager Permissions</PermissionGroupTitle>
        <PermissionBlock>
          {Object.entries(permissionsTitleMap).map(([key, value]) => {
            return (
              <PermissionRoleWrapper key={key}>
                <RoleDescription permission={key} description={value} />
                <AddressList permission={key} />
              </PermissionRoleWrapper>
            );
          })}
        </PermissionBlock>
      </PermissionContainer>
      <PermissionContainer>
        <PermissionGroupTitle>
          Node Operator Manager Permissions
        </PermissionGroupTitle>
        <PermissionBlock>
          <PermissionRoleWrapper>
            <RoleDescription
              permission="nodeOperatorFeeClaimers"
              description="Claim NOs fees from the vault (ETH) (address)"
            />
            <AddressList permission="nodeOperatorFeeClaimers" />
          </PermissionRoleWrapper>
        </PermissionBlock>
      </PermissionContainer>
      <PermissionsAction />
    </PermissionWrapper>
  );
};
