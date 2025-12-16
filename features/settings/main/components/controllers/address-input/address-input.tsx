import { FC, useMemo } from 'react';
import { Address, isAddress } from 'viem';
import { useController, useFormContext } from 'react-hook-form';

import { Identicon, Input, Loader, Text } from '@lidofinance/lido-ui';
import { AddressLinkEtherscan } from 'shared/components';
import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';
import { AddressInputWrapper, EtherScanLink } from './styles';

import {
  InputDataType,
  MainSettingsFormValidatedValues,
} from 'features/settings/main/types';

export interface AddressInputProps {
  name: keyof MainSettingsFormValidatedValues;
  label?: string;
  type?: string;
  title: string;
  dataType?: InputDataType;
  disabled?: boolean;
}

export const AddressInput: FC<AddressInputProps> = ({
  name,
  label,
  title,
  dataType,
}) => {
  const { getValues, getFieldState } = useFormContext();
  const { field } = useController({ name });
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
      <Text size="xs" strong>
        {title}
      </Text>
      <AddressInputWrapper>
        <Input
          label={label}
          leftDecorator={decorator}
          type="text"
          error={error?.message}
          fullwidth
          {...field}
        />
        {!invalid && value && (
          <EtherScanLink>
            <AddressLinkEtherscan address={value as Address} />
          </EtherScanLink>
        )}
      </AddressInputWrapper>
    </div>
  );
};
