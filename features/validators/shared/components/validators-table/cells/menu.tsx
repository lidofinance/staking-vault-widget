import type { FC } from 'react';
import { Td } from '@lidofinance/lido-ui';

import { ValidatorMenu } from '../components';

export const MenuCell: FC = () => {
  return (
    <Td>
      <ValidatorMenu />
    </Td>
  );
};
