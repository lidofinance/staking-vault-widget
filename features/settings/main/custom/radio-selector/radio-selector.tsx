import { FC } from 'react';

import { RadioInput } from '../radio';
import { RadioWithInput } from '../radio-with-input';
import {
  RadioSelectorContainer,
  RadioSelectorTitle,
} from './radio-selector.styles';
import { useFormContext, useFormState } from 'react-hook-form';
import { InlineLoader } from '@lidofinance/lido-ui';

export type RadioFormData = {
  type: string;
  value: string;
  tags: string[];
  symbol: string;
  placeholder?: string;
};

type VotingSelectorProps = {
  data?: RadioFormData[];
  radioType: string;
  title: string;
};

export const RadioSelector: FC<VotingSelectorProps> = ({
  data,
  radioType,
  title,
}) => {
  const { isLoading, errors } = useFormState();
  const { register, setValue } = useFormContext();
  const inputError = errors[radioType];

  if (isLoading) return <InlineLoader />;

  return (
    <RadioSelectorContainer>
      <RadioSelectorTitle>{title}</RadioSelectorTitle>
      {data?.map(({ type, value, tags, symbol, placeholder }, index) => {
        const key = `${radioType}-${type}-${index}-${value}`;
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
                ...register(radioType),
              }}
              type={radioType}
              placeholder={placeholder}
              setRadioValue={setValue}
              error={inputError?.message as string}
            />
          );

        return (
          <RadioInput
            key={key}
            value={value}
            tags={tags}
            id={key}
            symbol={symbol}
            {...register(radioType)}
            disabled={isMy}
          />
        );
      })}
    </RadioSelectorContainer>
  );
};
