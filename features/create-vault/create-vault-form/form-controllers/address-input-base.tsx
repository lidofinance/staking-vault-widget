import { Input, Loader, Identicon } from '@lidofinance/lido-ui';
import { forwardRef, useState } from 'react';
import {
  UseFormRegisterReturn,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { AddressLinkEtherscan } from 'shared/components';
import { Address, isAddress } from 'viem';
import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';
import { AddressInputWrapper, EtherScanLink } from './styles';

type AddressInputProps = Omit<UseFormRegisterReturn, 'ref'> &
  React.ComponentProps<typeof Input>;

export const AddressInputBase = forwardRef<HTMLInputElement, AddressInputProps>(
  (props, ref) => {
    const [inFocus, setInFocus] = useState(false);
    const name = props.name as 'value';
    const { getFieldState } = useFormContext();

    const { invalid, isDirty, isValidating, error } = getFieldState(props.name);

    const value = useWatch<{ value: Address }>({ name });

    const decorator = (() => {
      if (isAddress(value)) {
        if (invalid) return <ErrorTriangle />;
        if (isValidating) return <Loader size="small" />;
        if (!isDirty) return null;

        return <Identicon address={value} />;
      }
      return null;
    })();

    return (
      <AddressInputWrapper>
        <Input
          {...props}
          ref={ref}
          leftDecorator={decorator}
          type="text"
          fullwidth
          onFocus={(e) => {
            setInFocus(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            void props.onBlur?.(e);
            setInFocus(false);
          }}
          error={inFocus ? error?.message : Boolean(error?.message)}
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
