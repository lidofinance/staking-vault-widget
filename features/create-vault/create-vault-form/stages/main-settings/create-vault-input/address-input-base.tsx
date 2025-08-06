import { forwardRef, useState } from 'react';
import { Address } from 'viem';
import {
  UseFormRegisterReturn,
  useFormContext,
  useWatch,
} from 'react-hook-form';
import { Input, Loader, Identicon } from '@lidofinance/lido-ui';

import { AddressLinkEtherscan } from 'shared/components';
import { AddressInputWrapper, EtherScanLink } from './styles';

import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';
import { addressSchema } from 'utils/zod-validation';

type AddressInputProps = Omit<UseFormRegisterReturn, 'ref'> &
  React.ComponentProps<typeof Input> & {
    dataTestId?: string;
  };

export const AddressInputBase = forwardRef<HTMLInputElement, AddressInputProps>(
  ({ onFocus, onBlur, dataTestId, ...rest }, ref) => {
    const name = rest.name as 'value';

    const [inFocus, setInFocus] = useState(false);
    const { getFieldState } = useFormContext();

    const { invalid, isDirty, isValidating, error } = getFieldState(name);

    const { data: value } = addressSchema.safeParse(
      useWatch<{ value: Address }>({ name }),
    );

    const decorator = (() => {
      if (value) {
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
          data-testid={dataTestId ? `${dataTestId}-input` : null}
        />
        {!invalid && value && (
          <EtherScanLink
            data-testid={
              dataTestId ? `${dataTestId}-etherScanLinkWrapper` : null
            }
          >
            <AddressLinkEtherscan address={value} dataTestId={dataTestId} />
          </EtherScanLink>
        )}
      </AddressInputWrapper>
    );
  },
);
