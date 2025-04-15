import { FC, useMemo } from 'react';
import { Address, isAddress } from 'viem';
import { UseFormReturn } from 'react-hook-form';

import { Identicon, Input, Loader } from '@lidofinance/lido-ui';
import { AddressLinkEtherscan } from 'shared/components';
import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';
import {
  AddressInputWrapper,
  EtherScanLink,
  InputNotes,
  InputTitle,
} from './styles';

import {
  InputDataType,
  VaultMainSettingsType,
  MainSettingsKeys,
} from 'features/create-vault/types';

export interface AddressInputProps {
  form: UseFormReturn<VaultMainSettingsType>;
  name: MainSettingsKeys;
  label?: string;
  type?: string;
  title: string;
  notes?: string;
  dataType?: InputDataType;
  afterText?: string;
}

export const AddressInput: FC<AddressInputProps> = (props) => {
  const { form, name, label, title, notes, dataType } = props;
  const { getValues, getFieldState, register } = form;
  const { error, invalid, isValidating, isDirty } = getFieldState(name);
  const value = getValues(name) as string;

  const decorator = useMemo(() => {
    if (isAddress(value) || dataType === 'address') {
      if (invalid) return <ErrorTriangle />;
      if (isValidating) return <Loader size="small" />;
      if (!isDirty) return null;

      return <Identicon address={value} />;
    }

    return null;
  }, [value, dataType, invalid, isDirty, isValidating]);

  return (
    <div>
      <InputTitle>{title}</InputTitle>
      <AddressInputWrapper>
        <Input
          label={label}
          leftDecorator={decorator}
          type="text"
          error={error?.message}
          fullwidth
          {...register(name)}
        />
        {!invalid && value && (
          <EtherScanLink>
            <AddressLinkEtherscan address={value as Address} />
          </EtherScanLink>
        )}
      </AddressInputWrapper>
      {!!notes && (
        <InputNotes>
          <b>Note: </b>
          {notes}
        </InputNotes>
      )}
    </div>
  );
};
