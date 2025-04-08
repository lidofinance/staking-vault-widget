import { FC } from 'react';

import { usePermissionsSettingsData } from 'features/settings/permissions/contexts';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

export const PermissionsAction: FC = () => {
  const { handleCancelSubmit } = usePermissionsSettingsData();

  const handleSetPrevStep = () => {
    handleCancelSubmit();
  };

  const handleSetNextStep = () => {
    handleCancelSubmit();
  };

  return (
    <Container>
      <Button onClick={handleSetPrevStep} variant="outlined" fullwidth>
        Clear changes
      </Button>
      <Button onClick={handleSetNextStep} fullwidth>
        Submit transactions
      </Button>
    </Container>
  );
};
