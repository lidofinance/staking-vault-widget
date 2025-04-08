import { FC } from 'react';
import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

export const MainSettingsAction: FC = () => {
  return (
    <Container>
      <Button type="button" variant="outlined" fullwidth>
        Clear changes
      </Button>
      <Button type="button" fullwidth>
        No changes
      </Button>
    </Container>
  );
};
