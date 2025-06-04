import { FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { InlineLoader } from '@lidofinance/lido-ui';

import { RadioInput, RadioWithInput } from 'shared/components';
import { useVaultConfirmingRoles, useVaultPermission } from 'modules/vaults';
import { VaultInfo } from 'types';

import { ReadonlyView } from '../readonly-view';
import {
  RadioSelectorContainer,
  RadioSelectorTitle,
} from './radio-selector.styles';

export type RadioFormData = {
  type: string;
  value: string;
  tags: string[];
  symbol: string;
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
      {isLoading && <InlineLoader />}
      {isEditable && !isLoading ? (
        <>
          {data?.map(({ type, value, tags, symbol, placeholder }, index) => {
            const key = `${vaultKey}-${type}-${index}-${value}`;
            const isCustom = type === 'custom';
            const isMy = type === 'My proposal';

            if (isCustom)
              return (
                <RadioWithInput
                  key={key}
                  radioProps={{
                    value: value,
                    symbol: symbol,
                    tags: tags,
                    id: key,
                    ...register(vaultKey),
                  }}
                  type={vaultKey}
                  placeholder={placeholder}
                  setRadioValue={setValue}
                  error={inputError?.message as string}
                  shouldClearField={isSubmitSuccessful}
                />
              );

            return (
              <RadioInput
                key={key}
                value={value}
                tags={tags}
                id={key}
                symbol={symbol}
                {...register(vaultKey)}
                disabled={isMy}
              />
            );
          })}
        </>
      ) : (
        <ReadonlyView vaultKey={vaultKey} />
      )}
    </RadioSelectorContainer>
  );
};
