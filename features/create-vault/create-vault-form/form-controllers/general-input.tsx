import { FC, useMemo } from 'react';
import { isAddress } from 'viem';
import { useController, useFormContext } from 'react-hook-form';

import { Identicon, Input, InputProps } from '@lidofinance/lido-ui';
import { InputNotes, InputTitle } from './styles';

import { GeneralDataInputType } from 'types/form';

export interface InputAddressProps {
  name: string;
  label: string;
  type?: InputProps['type'];
  title: string;
  notes?: string;
  dataType?: GeneralDataInputType;
  afterText?: string; // TODO: add option for text like 'hours' (confirmExpiry field)
}

export const GeneralInput: FC<InputAddressProps> = (props) => {
  const {
    name,
    label,
    title,
    notes,
    dataType = 'address',
    type = 'text',
  } = props;
  const { control, getFieldState, register } = useFormContext();
  const { field } = useController({ name, control });
  const { error } = getFieldState(name);

  let inputProps = register(name);
  if (type === 'number') {
    inputProps = register(name, {
      valueAsNumber: true,
    });
  }

  const decorator = useMemo(() => {
    return isAddress(field.value) && dataType === 'address' ? (
      <Identicon address={field.value} />
    ) : null;
  }, [field.value, dataType]);

  return (
    <div>
      <InputTitle>{title}</InputTitle>
      <Input
        label={label}
        leftDecorator={decorator}
        type="text"
        error={error?.message}
        fullwidth
        {...inputProps}
      />
      {!!notes && (
        <InputNotes>
          <b>Note: </b>
          {notes}
        </InputNotes>
      )}
    </div>
  );
};
