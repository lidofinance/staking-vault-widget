import { InputProps } from '@lidofinance/lido-ui';

import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { GeneralInput } from 'features/create-vault/create-vault-form/form-controllers';
import { Confirmation } from 'features/create-vault/create-vault-form/main-settings/confirmation';
import { MainSettingsAction } from 'features/create-vault/create-vault-form/main-settings/main-settings-action';
import { SectionContainer } from 'features/create-vault/styles';

import { GeneralDataInputType } from 'types/form';

const fieldsList = [
  {
    name: 'nodeOperator',
    title: 'Node Operator',
    label: 'Node Operator address',
    notes: 'Node Operator address cannot be changed after the vault is created',
  },
  {
    name: 'nodeOperatorFeeBP',
    title: 'Node Operator fee',
    label: 'Node Operator fee, %',
    dataType: 'number' as GeneralDataInputType,
    type: 'number' as InputProps['type'],
  },
  {
    name: 'curatorFeeBP',
    title: 'Curator fee',
    label: 'Curator fee, %',
    dataType: 'number' as GeneralDataInputType,
    type: 'number' as InputProps['type'],
  },
  {
    name: 'confirmExpiry',
    title: 'Confirmation Lifetime',
    label: 'Confirmation Lifetime, hours',
    afterText: 'hours',
    dataType: 'number' as GeneralDataInputType,
    type: 'number' as InputProps['type'],
  },
  {
    name: 'defaultAdmin',
    title: 'Vault Manager',
    label: 'Vault Manager address or ENS',
  },
  {
    name: 'nodeOperatorManager', // TODO: remove
    title: 'Node Operator Manager',
    label: 'Node Operator Manager address or ENS',
  },
];

export const MainSettings = () => {
  const { step } = useCreateVaultFormData();

  return (
    <SectionContainer step={step} currentStep={1}>
      {fieldsList.map((field) => (
        <GeneralInput key={field.name} {...field} />
      ))}
      <Confirmation />
      <MainSettingsAction />
    </SectionContainer>
  );
};
