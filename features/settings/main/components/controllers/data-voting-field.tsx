import { FC } from 'react';
import { useFormState } from 'react-hook-form';
import { InlineLoader, Text } from '@lidofinance/lido-ui';

import {
  useVaultConfirmingRoles,
  useVaultPermission,
} from 'modules/vaults/hooks/use-vault-permissions';

import { EditProperty } from './edit-property';
import { ReadonlyView } from './readonly-view';
import { GroupWrapper } from './styles';

import { MainSettingsVoting } from 'features/settings/main/types';

type DataVotingFieldProps = MainSettingsVoting;

export const DataVotingField: FC<DataVotingFieldProps> = ({
  editLabel,
  name,
  title,
  vaultKey,
  canEditRole,
  unitIndicator,
  ...rest
}) => {
  const { disabled, isLoading } = useFormState();
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
      {isLoading && <InlineLoader />}
      {isEditable ? (
        <EditProperty
          editLabel={editLabel}
          name={name}
          unitIndicator={unitIndicator}
          {...rest}
        />
      ) : (
        <ReadonlyView vaultKey={vaultKey} />
      )}
    </GroupWrapper>
  );
};
