import { FC } from 'react';

import { LoaderWrapper } from './styles';
import { Loader } from '@lidofinance/lido-ui';
import { Backdrop } from 'shared/components';

interface BackdropProps {
  open: boolean;
}

export const FormBackdrop: FC<BackdropProps> = ({ open = false }) => {
  return (
    <Backdrop open={open}>
      <LoaderWrapper>
        <Loader size="medium" />
      </LoaderWrapper>
    </Backdrop>
  );
};
