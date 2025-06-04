import type { FC } from 'react';

import { FAQ } from 'shared/components/faq';

import { FeeStructure, Roles } from './items';

export const CreateVaultFaq: FC = () => {
  return (
    <FAQ.List>
      <Roles defaultExpanded />
      <FeeStructure />
    </FAQ.List>
  );
};
