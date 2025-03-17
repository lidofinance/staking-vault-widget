import { FC } from 'react';
import { useRouter } from 'next/router';
import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

import { AppPaths } from 'consts/urls';
import { useFormContext } from 'react-hook-form';

const nextStepFields = [
  'nodeOperator',
  'nodeOperatorManager',
  'nodeOperatorFeeBP',
  'curatorFeeBP',
  'confirmExpiry',
  'defaultAdmin',
  'confirmMainSettings',
];

export const MainSettingsAction: FC = () => {
  const router = useRouter();
  const { step, handleSetStep } = useCreateVaultFormData();
  const {
    getFieldState,
    formState: { defaultValues, isValidating },
    getValues,
  } = useFormContext();

  const isNextStepDisabled =
    !isValidating &&
    (nextStepFields.some((fieldName) => {
      const { invalid, isTouched } = getFieldState(fieldName);
      const currentValue = getValues(fieldName);
      const hasDefault = defaultValues?.[fieldName] !== undefined;

      return (
        invalid ||
        (!hasDefault && !isTouched) ||
        (hasDefault && !invalid && currentValue === undefined)
      );
    }) ||
      !getValues('confirmMainSettings'));

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
