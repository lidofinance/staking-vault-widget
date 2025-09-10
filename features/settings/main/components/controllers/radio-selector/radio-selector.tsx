import { FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Text } from '@lidofinance/lido-ui';

import { RadioInput, RadioWithInput } from 'shared/components';
import { useVaultConfirmingRoles, useVaultPermission } from 'modules/vaults';

import { ReadonlyView } from '../readonly-view';
import { RadioSelectorContainer } from './radio-selector.styles';
import { Skeleton } from 'features/settings/main/styles';
import type { VaultMainSettingsData } from 'features/settings/main/types';

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
  vaultKey: keyof VaultMainSettingsData;
  title: string;
};

export const RadioSelector: FC<VotingSelectorProps> = ({
  data,
  vaultKey,
  title,
}) => {
  const { isLoading, errors, disabled, isSubmitSuccessful, isDirty } =
    useFormState();
  const { watch, register } = useFormContext();
  const { hasConfirmingRole } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission();

  const selectedValue = watch(vaultKey);
  const isCustomSelected = selectedValue === 'custom';
  const inputKey = `${vaultKey}Custom`;
  const inputError = isCustomSelected ? errors[inputKey] : undefined;
  const isEditable = !disabled && (hasConfirmingRole || hasPermission);

  return (
    <RadioSelectorContainer data-testid={`${vaultKey}-container`}>
      <Text size="xs" strong data-testid={`${vaultKey}-title`}>
        {title}
      </Text>
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
                    shouldClearField={isSubmitSuccessful || !isDirty}
                    dataTestId={`${vaultKey}-proposeNew`}
                    {...register(inputKey)}
                  />
                );

              return (
                <RadioInput
                  key={key}
                  {...radioProps}
                  disabled={isMy}
                  dataTestId={`${vaultKey}-${value}`}
                />
              );
            },
          )}
        </>
      )}
      {!isEditable && !isLoading && (
        <ReadonlyView value={selectedValue} vaultKey={vaultKey} />
      )}
    </RadioSelectorContainer>
  );
};
