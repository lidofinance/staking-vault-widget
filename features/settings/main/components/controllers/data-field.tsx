import { FC } from 'react';
import { ReadonlyInput } from './readonly-input';
import { DisplayAddress } from './display-address';
import { GroupWrapper } from './styles';

import { InputDataType } from 'features/settings/main/types';
import { VaultInfo } from 'types';
import { EditProperty } from './edit-property';
import { Text } from '@lidofinance/lido-ui';

interface InputResolverProps {
  name: string;
  label: string;
  editLabel: string;
  title: string;
  dataType: InputDataType;
  vaultKey: keyof VaultInfo;
  actionText?: string;
}

export const DataField: FC<InputResolverProps> = ({
  label,
  editLabel,
  name,
  dataType,
  title,
  actionText = 'Initiate a change',
  vaultKey,
}) => {
  const isTypeAddress = dataType === 'address';

  return (
    <GroupWrapper>
      <Text size="xs" strong>
        {title}
      </Text>
      {isTypeAddress && <DisplayAddress name={name} vaultKey={vaultKey} />}
      {!isTypeAddress && <ReadonlyInput label={label} vaultKey={vaultKey} />}
      <EditProperty editLabel={editLabel} name={name} actionText={actionText} />
    </GroupWrapper>
  );
};
