import { FC } from 'react';
import { useFormState } from 'react-hook-form';
import { ReadonlyView } from './readonly-view';
import { GroupWrapper } from './styles';

import { MainSettingsVoting } from 'features/settings/main/types';
import { EditProperty } from './edit-property';
import { Text } from '@lidofinance/lido-ui';
import {
  useVaultConfirmingRoles,
  useVaultPermission,
} from 'modules/vaults/hooks/use-vault-permissions';

type DataVotingFieldProps = MainSettingsVoting;

export const DataVotingField: FC<DataVotingFieldProps> = ({
  editLabel,
  name,
  title,
  vaultKey,
  canEditRole,
  mask,
}) => {
  const { disabled } = useFormState();
  const isConfirmingRoles = canEditRole === 'confirmingRoles';
  const { hasConfirmingRole } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission(
    isConfirmingRoles ? undefined : canEditRole,
  );

  const isEditable =
    !disabled && ((isConfirmingRoles && hasConfirmingRole) || hasPermission);

  return (
    <GroupWrapper>
      <Text size="xs" strong>
        {title}
      </Text>
      {!isEditable && <ReadonlyView vaultKey={vaultKey} />}
      {isEditable && (
        <EditProperty editLabel={editLabel} name={name} mask={mask} />
      )}
    </GroupWrapper>
  );
};
