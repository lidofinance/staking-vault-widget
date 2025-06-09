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
  const { hasConfirmingRole } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission();
  const { register, setValue } = useFormContext();
  const inputError = errors[vaultKey];
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
              const isHour = symbol?.includes('hours');
              // TODO: refactor leak logic abstraction
              const multiplier = isHour ? 3600 : 1;
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
                    setRadioValue={(type, value, options) => {
                      setValue(
                        type as keyof VaultInfo,
                        String(parseFloat(value) * multiplier),
                        options,
                      );
                    }}
                    error={inputError?.message as string}
                    shouldClearField={isSubmitSuccessful}
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
