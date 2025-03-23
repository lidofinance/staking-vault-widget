import { FC } from 'react';

import { UseFormRegister } from 'react-hook-form';

import { Checkbox } from '@lidofinance/lido-ui';
import { InfoList, Wrapper } from './styles';

import { VaultMainSettingsType } from 'features/create-vault/types';

export interface ConfirmationProps {
  register: UseFormRegister<VaultMainSettingsType>;
}

export const Confirmation: FC<ConfirmationProps> = ({ register }) => {
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
