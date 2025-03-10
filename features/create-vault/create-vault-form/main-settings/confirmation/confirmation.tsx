import { FC } from 'react';

import { Checkbox } from '@lidofinance/lido-ui';
import { InfoList, Wrapper } from './styles';
import { useController } from 'react-hook-form';

export const Confirmation: FC = () => {
  const { field } = useController({ name: 'confirmMainSettings' });

  return (
    <Wrapper>
      <Checkbox {...field} />
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
