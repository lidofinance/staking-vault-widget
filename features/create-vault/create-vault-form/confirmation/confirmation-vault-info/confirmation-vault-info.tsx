import { FC } from 'react';

import {
  ConfirmInfoTitle,
  List,
  ListItem,
  PermissionTitle,
  Wrapper,
} from './styles';
import { ConfirmationData } from 'features/create-vault/create-vault-form/confirmation/confirmation-data';
import { InputDataType } from 'features/create-vault/types';

export type ConfirmationVaultInfoProps = {
  title: string;
  list: ConfirmationRenderStruct[];
};

type ConfirmationRenderStruct = {
  title: string;
  name: string;
  dataType: InputDataType;
};

export const ConfirmationVaultInfo: FC<ConfirmationVaultInfoProps> = ({
  title,
  list,
}) => {
  return (
    <Wrapper>
      <ConfirmInfoTitle>{title}</ConfirmInfoTitle>
      <List>
        {list.map((item: ConfirmationRenderStruct) => {
          return (
            <ListItem key={item.name}>
              <PermissionTitle>{item.title}</PermissionTitle>
              <ConfirmationData
                permission={item.name}
                dataType={item.dataType}
              />
            </ListItem>
          );
        })}
      </List>
    </Wrapper>
  );
};
