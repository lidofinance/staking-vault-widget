import { FC, useMemo } from 'react';

import {
  ConfirmInfoTitle,
  List,
  ListItem,
  PermissionTitle,
  Wrapper,
} from './styles';
import { ConfirmationData } from 'features/create-vault/create-vault-form/confirmation/confirmation-data';
import {
  InputDataType,
  ConfirmationList,
  FieldConfig,
  FieldName,
} from 'features/create-vault/types';
import { getCreateVaultFields } from 'features/create-vault/consts';

const mainSettingsList = [
  'nodeOperator',
  'nodeOperatorFeeBP',
  'curatorFeeBP',
  'confirmExpiry',
  'assetRecoverer',
  'defaultAdmin',
  'nodeOperatorManager',
] as const;

const managerPermissionsList = [
  'curatorFeeSetters', // TODO: Will be removed
  'curatorFeeClaimers', // TODO: Will be removed
  'withdrawers',
  'funders',
  'minters',
  'burners',
  'rebalancers',
  'depositPausers',
  'depositResumers',
  'validatorExitRequesters',
  'validatorWithdrawalTriggerers',
  'disconnecters',
] as const;

const nodeOperatorPermissionList = ['nodeOperatorFeeClaimers'] as const;

const mainSettings = getCreateVaultFields(mainSettingsList);
const vaultManagerPermissions = getCreateVaultFields(managerPermissionsList);
const nodeOperatorManagerPermissions = getCreateVaultFields(
  nodeOperatorPermissionList,
);

const lists: Record<ConfirmationList, FieldConfig<FieldName>[]> = {
  mainSettings,
  vaultManagerPermissions,
  nodeOperatorManagerPermissions,
};

export interface ConfirmationVaultInfoProps {
  title: string;
  list: ConfirmationList;
}

type ConfirmationRenderStruct = {
  rowTitle: string;
  formKey: string;
  dataType: InputDataType;
};

export const ConfirmationVaultInfo: FC<ConfirmationVaultInfoProps> = ({
  title = 'Main settings',
  list = 'mainSettings' as ConfirmationList,
}) => {
  const listToRender = useMemo(() => {
    return lists[list].map((item) => {
      const { title, dataType, name } = item;
      return {
        rowTitle: title,
        formKey: name,
        dataType: dataType as InputDataType,
      };
    });
  }, [list]);

  return (
    <Wrapper>
      <ConfirmInfoTitle>{title}</ConfirmInfoTitle>
      <List>
        {listToRender.map((item: ConfirmationRenderStruct) => {
          return (
            <ListItem key={item.formKey}>
              <PermissionTitle>{item.rowTitle}</PermissionTitle>
              <ConfirmationData
                permission={item.formKey}
                dataType={item.dataType}
              />
            </ListItem>
          );
        })}
      </List>
    </Wrapper>
  );
};
