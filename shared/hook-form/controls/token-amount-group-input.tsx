/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { ComponentProps } from 'react';

import { TokenAmountInputHookForm } from './token-amount-input-hook-form';
import { TokenSelectHookForm } from './token-select-hook-form';
import { useInFocus } from 'shared/hooks/use-in-focus';
import { useFormContext, useFormState } from 'react-hook-form';
import { InputGroupStyled } from './styles';

type TokenAmountInputGroupProps = {
  amountFieldName: string;
  maxAmount?: bigint;
  tokenLabel?: string;
  tokenFieldName?: string;
  errorFieldName?: string;
  tokenOptions?: ComponentProps<typeof TokenSelectHookForm>['options'];
} & ComponentProps<typeof InputGroupStyled>;

export const TokenAmountInputGroup = ({
  amountFieldName,
  maxAmount,
  errorFieldName = amountFieldName,
  tokenLabel,
  tokenOptions,
  tokenFieldName,
  ...props
}: TokenAmountInputGroupProps) => {
  const { inFocus, onBlur, onFocus } = useInFocus();
  const { watch } = useFormContext();
  const { errors } = useFormState<Record<string, unknown>>({
    name: errorFieldName,
  });
  const tokenValue = tokenFieldName && watch(tokenFieldName);
  const amountLabel = tokenLabel ?? tokenValue;

  const hasTokenField = Boolean(tokenFieldName && tokenOptions);

  const errorMessage = inFocus && errors[errorFieldName]?.message;

  return (
    <InputGroupStyled data-testid="inputForm" error={errorMessage} {...props}>
      {hasTokenField && (
        <TokenSelectHookForm
          errorField={errorFieldName}
          fieldName={tokenFieldName}
          options={tokenOptions!}
        />
      )}
      <TokenAmountInputHookForm
        token={amountLabel}
        showErrorMessage={false}
        fieldName={amountFieldName}
        maxValue={maxAmount}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </InputGroupStyled>
  );
};
