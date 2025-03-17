import { FC } from 'react';

import { useFormContext } from 'react-hook-form';

import { Checkbox } from '@lidofinance/lido-ui';
import { InfoList, Wrapper } from './styles';

export const Confirmation: FC = () => {
  const { register } = useFormContext();

  return (
    <Wrapper>
      <Checkbox {...register('confirmMainSettings')} />
      <div>
        <p>I confirm that I&apos;ve read and agree:</p>
        <InfoList>
          <li>with the fees structure;</li>
          <li>mechanisms applied in extreme scenarios.</li>
        </InfoList>
      </div>
    </Wrapper>
  );
};
