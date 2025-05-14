import { useFormContext } from 'react-hook-form';

import { Checkbox } from '@lidofinance/lido-ui';
import { InfoList, Wrapper } from './styles';

import { CreateVaultSchema } from 'features/create-vault/types';

export const Confirmation = () => {
  const { register, trigger } = useFormContext<CreateVaultSchema>();

  return (
    <Wrapper>
      <Checkbox
        {...register('acceptTerms', {
          onChange: () => {
            // trigger validation on checkbox click (not onBlur)
            void trigger('acceptTerms', { shouldFocus: false });
          },
        })}
      />
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
