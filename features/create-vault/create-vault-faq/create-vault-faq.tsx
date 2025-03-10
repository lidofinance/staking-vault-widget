import { FC } from 'react';

import { SomeFaqItem, AnotherFaqItem } from './list';
import { Wrapper } from './styles';

export const CreateVaultFaq: FC = () => {
  return (
    <Wrapper title="FAQ">
      <SomeFaqItem />
      <AnotherFaqItem />
    </Wrapper>
  );
};
