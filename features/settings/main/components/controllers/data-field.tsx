import { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { useVaultConfirmingRoles, useVaultPermission } from 'modules/vaults';

import { Hint } from 'shared/components';
import { EditProperty } from './edit-property';
import { ReadonlyInput } from './readonly-input';
import { GroupWrapper } from './styles';

import type { MainSettingsOverview } from 'features/settings/main/types';

type InputResolverProps = MainSettingsOverview;

export const DataField: FC<InputResolverProps> = ({
  label,
  editLabel,
  name,
  title,
  hint,
  actionText = 'Initiate a change',
  vaultKey,
  canEditRole,
}) => {
  const isConfirmingRoles = canEditRole === 'confirmingRoles';
  const { hasConfirmingRole } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission(
    isConfirmingRoles ? undefined : canEditRole,
  );

  const isEditable = hasConfirmingRole || hasPermission;
  return (
    <GroupWrapper>
      <Text size="xs" strong>
        {title}
        <Hint text={hint} />
      </Text>
      <ReadonlyInput label={label} vaultKey={vaultKey} />
      {isEditable && (
        <EditProperty
          editLabel={editLabel}
          name={name}
          actionText={actionText}
        />
      )}
    </GroupWrapper>
  );
};
