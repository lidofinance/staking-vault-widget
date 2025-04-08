import { useForm } from 'react-hook-form';

import { InputResolver } from 'features/settings/main/components';
import { MainSettingsAction } from 'features/settings/main/components';
import { SectionContainer } from 'features/settings/main/styles';

import { editMainSettingsSchema } from 'features/settings/main/consts';
import { EditMainSettingsSchema } from 'features/settings/main/types';
import { editMainSettingsValidator } from 'features/settings/main/validation';
import { InputProps } from '@lidofinance/lido-ui';

const fieldsForRender = [
  {
    name: 'nodeOperator',
    title: 'Node Operator',
    label: 'Node Operator address-field',
    notes:
      'Node Operator address-field cannot be changed after the vault is created',
    dataType: 'address',
  },
  {
    name: 'nodeOperatorFeeBP',
    title: 'Node Operator fee',
    label: 'Node Operator fee, %',
    dataType: 'percent',
    type: 'number' as InputProps['type'],
  },
  {
    name: 'confirmExpiry',
    title: 'Confirmation Lifetime',
    label: 'Confirmation Lifetime, hours',
    afterText: 'hours',
    dataType: 'time',
    type: 'number' as InputProps['type'],
  },
  {
    name: 'defaultAdmin',
    title: 'Vault Manager',
    label: 'Vault Manager address-field or ENS',
    dataType: 'address',
  },
  {
    name: 'nodeOperatorManager',
    title: 'Node Operator Manager',
    label: 'Node Operator Manager address-field or ENS',
    dataType: 'address',
  },
];

export const EditMainSettings = () => {
  const mainSettingsForm = useForm<EditMainSettingsSchema>({
    defaultValues: {
      nodeOperator: '',
      nodeOperatorManager: '',
      nodeOperatorFeeBP: 5,
      confirmExpiry: 36,
      defaultAdmin: '',
    },
    resolver: editMainSettingsValidator(editMainSettingsSchema),
    mode: 'all',
  });

  return (
    <SectionContainer>
      {fieldsForRender.map((field) => {
        // TODO: check types
        // @ts-expect-error ts types
        return (
          <InputResolver form={mainSettingsForm} key={field.name} {...field} />
        );
      })}
      <MainSettingsAction />
    </SectionContainer>
  );
};
