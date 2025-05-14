import { FC } from 'react';
import { isAddress } from 'viem';
import { useController } from 'react-hook-form';

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
  CreateVaultSchema,
  MainSettingsKeys,
} from 'features/create-vault/types';

export type AddressInputProps = {
  name: MainSettingsKeys;
  label?: string;
  title: string;
  notes?: string;
  dataType: 'address';
  afterText?: string;
};

export const AddressInput: FC<AddressInputProps> = ({
  name,
  label,
  title,
  notes,
  dataType,
}) => {
  const { field, fieldState } = useController<
    CreateVaultSchema,
    'defaultAdmin'
  >({ name: name as 'defaultAdmin' });
  const { invalid, isDirty, isValidating, error } = fieldState;

  const value = field.value;

  const decorator = (() => {
    if (isAddress(value) || dataType === 'address') {
      if (invalid) return <ErrorTriangle />;
      if (isValidating) return <Loader size="small" />;
      if (!isDirty) return null;

      return <Identicon address={value} />;
    }
    return null;
  })();

  return (
    <div>
      <InputTitle>{title}</InputTitle>
      <AddressInputWrapper>
        <Input
          {...field}
          label={label}
          leftDecorator={decorator}
          type="text"
          error={error?.message}
          fullwidth
        />
        {!invalid && value && (
          <EtherScanLink>
            <AddressLinkEtherscan address={value} />
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
