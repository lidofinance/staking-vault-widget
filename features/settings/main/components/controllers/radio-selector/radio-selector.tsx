import { FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

import { RadioInput, RadioWithInput } from 'shared/components';
import { useVaultConfirmingRoles, useVaultPermission } from 'modules/vaults';
import { VaultInfo } from 'types';

import { ReadonlyView } from '../readonly-view';
import {
  RadioSelectorContainer,
  RadioSelectorTitle,
} from './radio-selector.styles';
import { Skeleton } from 'features/settings/main/styles';

export type RadioFormData = {
  type: string;
  value: string;
  tags: string[];
  symbol?: string;
  format?: (arg: string) => string;
  placeholder?: string;
};

type VotingSelectorProps = {
  data?: RadioFormData[];
  vaultKey: keyof VaultInfo;
  title: string;
};

export const RadioSelector: FC<VotingSelectorProps> = ({
  data,
  vaultKey,
  title,
}) => {
  const { isLoading, errors, disabled, isSubmitSuccessful } = useFormState();
  const { watch } = useFormContext();
  const { hasConfirmingRole } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission();
  const { register } = useFormContext();

  const selectedValue = watch(vaultKey);
  const isCustomSelected = selectedValue === 'custom';
  const inputKey = `${vaultKey}Custom`;
  const inputError = isCustomSelected ? errors[inputKey] : undefined;
  const isEditable = !disabled && (hasConfirmingRole || hasPermission);

  return (
    <RadioSelectorContainer>
      <RadioSelectorTitle>{title}</RadioSelectorTitle>
      {isLoading && <Skeleton />}
      {isEditable && !isLoading && (
        <>
          {data?.map(
            ({ type, value, tags, symbol, format, placeholder }, index) => {
              const key = `${vaultKey}-${type}-${index}-${value}`;
              const isCustom = type === 'custom';
              const isMy = type === 'My proposal';
              const radioProps = {
                value: value,
                symbol: symbol,
                format: format,
                tags: tags,
                id: key,
                ...register(vaultKey),
              };

              if (isCustom)
                return (
                  <RadioWithInput
                    key={key}
                    radioProps={radioProps}
                    type={vaultKey}
                    placeholder={placeholder}
                    error={inputError?.message as string}
                    shouldClearField={isSubmitSuccessful}
                    {...register(inputKey)}
                  />
                );

              return <RadioInput key={key} {...radioProps} disabled={isMy} />;
            },
          )}
        </>
      )}
      {!isEditable && !isLoading && <ReadonlyView vaultKey={vaultKey} />}
    </RadioSelectorContainer>
  );
};
