import { forwardRef, useState } from 'react';
import { Address, isAddress } from 'viem';
import {
  UseFormRegisterReturn,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { Input, Loader, Identicon } from '@lidofinance/lido-ui';

import { AddressLinkEtherscan } from 'shared/components';
import { AddressInputWrapper, EtherScanLink } from './styles';

import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';

type AddressInputProps = Omit<UseFormRegisterReturn, 'ref'> &
  React.ComponentProps<typeof Input>;

export const AddressInputBase = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ onFocus, onBlur, ...rest }, ref) => {
    const name = rest.name as 'value';

    const [inFocus, setInFocus] = useState(false);
    const { getFieldState } = useFormContext();

    const { invalid, isDirty, isValidating, error } = getFieldState(name);

    const value = useWatch<{ value: Address }>({ name });

    const decorator = (() => {
      if (isAddress(value)) {
        if (invalid) return <ErrorTriangle />;
        if (invalid && isValidating) return <Loader size="small" />;
        if (!isDirty) return null;

        return <Identicon address={value} />;
      }
      return null;
    })();

    return (
      <AddressInputWrapper>
        <Input
          leftDecorator={decorator}
          type="text"
          fullwidth
          ref={ref}
          onFocus={(e) => {
            setInFocus(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setInFocus(false);
            void onBlur?.(e);
          }}
          error={inFocus ? error?.message : Boolean(error?.message)}
          {...rest}
        />
        {!invalid && value && (
          <EtherScanLink>
            <AddressLinkEtherscan address={value} />
          </EtherScanLink>
        )}
      </AddressInputWrapper>
    );
  },
);
