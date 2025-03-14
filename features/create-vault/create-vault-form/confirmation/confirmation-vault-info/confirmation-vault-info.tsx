import { FC, useMemo } from 'react';

import {
  ConfirmInfoTitle,
  List,
  ListItem,
  PermissionTitle,
  Wrapper,
} from './styles';
import { ConfirmationData } from 'features/create-vault/create-vault-form/confirmation/confirmation-data';
import { InputDataType } from 'features/create-vault/types';

interface ConfirmationDataStruct {
  [key: string]: {
    title: string;
    type: InputDataType;
  };
}

const confirmationMainSettings: ConfirmationDataStruct = {
  nodeOperator: {
    title: 'Node Operator',
    type: 'address',
  },
  nodeOperatorFeeBP: {
    title: 'Node Operator fee',
    type: 'percent',
  },
  curatorFeeBP: {
    title: 'Curator fee',
    type: 'percent',
  },
  confirmExpiry: {
    title: 'Confirmation Lifetime',
    type: 'time',
  },
  defaultAdmin: {
    title: 'Vault Manager',
    type: 'address',
  },
  nodeOperatorManager: {
    title: 'Node Operator Manager',
    type: 'address',
  },
};

const confirmationVaultManagerPermissions: ConfirmationDataStruct = {
  curatorFeeSetters: {
    title: 'Set Vault Curator’s fee',
    type: 'address',
  },
  curatorFeeClaimers: {
    title: 'Claim Vault Curator’s fee (address)',
    type: 'address',
  },
  withdrawers: {
    title: 'Withdrawers',
    type: 'address',
  },
  funders: {
    title: 'Funders',
    type: 'address',
  },
  minters: {
    title: 'Minters',
    type: 'address',
  },
  burners: {
    title: 'Burners',
    type: 'address',
  },
  rebalancers: {
    title: 'Rebalancers',
    type: 'address',
  },
  depositPausers: {
    title: 'Pause Deposits to beacon chain (all amount)',
    type: 'address',
  },
  depositResumers: {
    title: 'Resume Deposits to beacon chain (all amount)3',
    type: 'address',
  },
  validatorExitRequesters: {
    title: 'Initiate validator exit procedure (address)',
    type: 'address',
  },
  validatorWithdrawalTriggerers: {
    title:
      'Force NodeOperator to withdraw funds from validator(s) (public key, sum)',
    type: 'address',
  },
  disconnecters: {
    title: 'Disconnecters',
    type: 'address',
  },
};

const confirmationNodeOperatorManagerPermissions: ConfirmationDataStruct = {
  nodeOperatorFeeClaimers: {
    title: 'Claim NOs fees from the vault (ETH) (address)',
    type: 'address',
  },
};

const lists = {
  confirmationMainSettings,
  confirmationVaultManagerPermissions,
  confirmationNodeOperatorManagerPermissions,
};

export interface ConfirmationVaultInfoProps {
  title: string;
  list:
    | 'confirmationMainSettings'
    | 'confirmationVaultManagerPermissions'
    | 'confirmationNodeOperatorManagerPermissions';
}

type ConfirmationRenderStruct = {
  rowTitle: string;
  formKey: string;
  type: InputDataType;
};

export const ConfirmationVaultInfo: FC<ConfirmationVaultInfoProps> = ({
  title = 'Main settings',
  list = 'confirmationMainSettings',
}) => {
  const listToRender = useMemo(() => {
    const dataToRender = lists[list];

    return Object.keys(dataToRender).reduce((acc, key: string) => {
      const { title, type } = dataToRender[key];
      acc.push({ rowTitle: title, formKey: key, type: type as InputDataType });
      return acc;
    }, [] as ConfirmationRenderStruct[]);
  }, [list]);

  return (
    <Wrapper>
      <ConfirmInfoTitle>{title}</ConfirmInfoTitle>
      <List>
        {listToRender.map((item) => {
          return (
            <ListItem key={item.formKey}>
              <PermissionTitle>{item.rowTitle}</PermissionTitle>
              <ConfirmationData permission={item.formKey} type={item.type} />
            </ListItem>
          );
        })}
      </List>
    </Wrapper>
  );
};
