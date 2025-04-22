import { useForm } from 'react-hook-form';
import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { InputResolver } from 'features/create-vault/create-vault-form/form-controllers';
import { Confirmation } from 'features/create-vault/create-vault-form/main-settings/confirmation';
import { MainSettingsAction } from 'features/create-vault/create-vault-form/main-settings/main-settings-action';
import { SectionContainer } from 'features/create-vault/styles';

import { CREATE_VAULT_FORM_STEPS } from 'features/create-vault/consts';
import {
  InputDataType,
  MainSettingsKeys,
  VaultMainSettingsType,
} from 'features/create-vault/types';
import { validateMainSettings } from '../create-vault-form-context/validation';

type MainSettingsType = {
  name: MainSettingsKeys;
  dataType: InputDataType;
  title: string;
  label: string;
  notes?: string;
  type?: string;
  afterText?: string;
};

export const MAIN_SETTINGS: MainSettingsType[] = [
  {
    name: 'nodeOperator',
    title: 'Node Operator',
    label: 'Node Operator address',
    notes: 'Node Operator address cannot be changed after the vault is created',
    dataType: 'address',
  },
  {
    name: 'nodeOperatorFeeBP',
    title: 'Node Operator fee',
    label: 'Node Operator fee, %',
    dataType: 'percent',
    type: 'number',
  },
  {
    name: 'curatorFeeBP',
    title: 'Curator fee',
    label: 'Curator fee, %',
    dataType: 'percent',
    type: 'number',
  },
  {
    name: 'confirmExpiry',
    title: 'Confirmation Lifetime',
    label: 'Confirmation Lifetime, hours',
    afterText: 'hours',
    dataType: 'time',
    type: 'number',
  },
  {
    name: 'defaultAdmin',
    title: 'Vault Manager',
    label: 'Vault Manager address or ENS',
    dataType: 'address',
  },
  {
    name: 'nodeOperatorManager',
    title: 'Node Operator Manager',
    label: 'Node Operator Manager address or ENS',
    dataType: 'address',
  },
];

export const MainSettings = () => {
  const { step } = useCreateVaultFormData();

  const mainSettingsForm = useForm<VaultMainSettingsType>({
    defaultValues: {
      nodeOperator: '',
      nodeOperatorManager: '',
      nodeOperatorFeeBP: 5,
      curatorFeeBP: 5,
      confirmExpiry: 36,
      defaultAdmin: '',
      confirmMainSettings: false,
    },
    resolver: validateMainSettings,
    mode: 'all',
  });

  return (
    <SectionContainer step={step} currentStep={CREATE_VAULT_FORM_STEPS.main}>
      {MAIN_SETTINGS.map((field) => (
        <InputResolver form={mainSettingsForm} key={field.name} {...field} />
      ))}
      <Confirmation register={mainSettingsForm.register} />
      <MainSettingsAction form={mainSettingsForm} />
    </SectionContainer>
  );
};
