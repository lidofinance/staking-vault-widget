import type { FC } from 'react';
import { useFieldArray, useFormState } from 'react-hook-form';

import { useVaultPermission } from 'modules/vaults';
import { Hint } from 'shared/components';

import { Skeleton } from 'features/settings/main/styles';
import { EditPropertyAddress } from './edit-property-address';
import { DisplayAddress } from './display-address';
import { GroupWrapper, Title } from './styles';

import {
  MainSettingsFormValidatedValues,
  MainSettingsOverview,
  ManagersKeys,
} from 'features/settings/main/types';
import invariant from 'tiny-invariant';

type InputResolverProps = Omit<MainSettingsOverview, 'name'> & {
  name: ManagersKeys;
};

export const ManagerAddressField: FC<InputResolverProps> = ({
  editLabel,
  name,
  title,
  hint,
  canEditRole,
  dataTestId,
}) => {
  invariant(
    canEditRole !== 'confirmingRoles',
    'canEditRole cannot be "confirmingRoles" for this component',
  );
  const { disabled, isLoading } = useFormState();

  const { hasPermission } = useVaultPermission(canEditRole);

  const { fields, append, remove, update } =
    useFieldArray<MainSettingsFormValidatedValues>({ name });

  const isEditable = !disabled && hasPermission;

  return (
    <GroupWrapper
      data-testid={dataTestId ? `${dataTestId}-groupWrapper` : undefined}
    >
      <Title
        size="xs"
        strong
        data-testid={dataTestId ? `${dataTestId}-title` : undefined}
      >
        {title}
        <Hint
          text={hint}
          data-testid={dataTestId ? `${dataTestId}-hint` : undefined}
        />
      </Title>
      {isLoading && <Skeleton />}
      <DisplayAddress
        isEditable={isEditable}
        fields={fields}
        remove={remove}
        update={update}
        dataTestId={dataTestId}
      />
      {isEditable && (
        <EditPropertyAddress
          editLabel={editLabel}
          name={name as ManagersKeys}
          fields={fields}
          append={append}
          dataTestId={dataTestId}
        />
      )}
    </GroupWrapper>
  );
};
