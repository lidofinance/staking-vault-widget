import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

import { AppPaths } from 'consts/urls';

export const MainSettingsAction: FC = () => {
  const router = useRouter();
  const { step, handleSetStep } = useCreateVaultFormData();

  const isNextStepDisabled = useMemo(() => {
    return false;
  }, []);

  const handleNavigateToRoot = () => {
    void router.push(AppPaths.main);
  };

  const handleSetNextStep = () => {
    const nextStep = step + 1;
    handleSetStep(nextStep);
  };

  return (
    <Container>
      <Button
        type="button"
        variant="outlined"
        onClick={handleNavigateToRoot}
        fullwidth
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={handleSetNextStep}
        disabled={isNextStepDisabled}
        fullwidth
      >
        Continue
      </Button>
    </Container>
  );
};
