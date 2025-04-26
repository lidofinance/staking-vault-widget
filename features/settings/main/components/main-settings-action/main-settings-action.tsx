import { FC, useMemo } from 'react';
import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

import { useFormContext } from 'react-hook-form';
import { RoleFieldSchema } from '../../types';

export const MainSettingsAction: FC = () => {
  const {
    reset,
    watch,
    formState: { isValid, isDirty, isSubmitting },
  } = useFormContext();
  const isClearDisabled = !isDirty;
  const isSubmitDisabled = !isValid || !isDirty || isSubmitting;
  const formFields = watch();

  const buttonText = useMemo(() => {
    let counter = 0;
    if (!isSubmitDisabled) {
      ['defaultAdmins', 'nodeOperatorManagers'].forEach((key) => {
        const fields = formFields[key];
        const [grant, remove] = fields.reduce(
          (acc: [number, number], field: RoleFieldSchema) => {
            acc[0] += Number(field.state === 'grant');
            acc[1] += Number(field.state === 'remove');
            return acc;
          },
          [0, 0],
        );
        counter += Number(grant > 0) + Number(remove > 0);
      });

      if (formFields.nodeOperatorFeeBP.length > 0) {
        counter++;
      }

      if (formFields.confirmExpiry.length > 0) {
        counter++;
      }

      if (counter) {
        return `Submit ${counter} transaction${counter > 1 ? 's' : ''}`;
      }
    }

    return 'No changes';
  }, [formFields, isSubmitDisabled]);

  return (
    <Container>
      <Button
        type="button"
        variant="outlined"
        disabled={isClearDisabled}
        onClick={() => reset()}
        fullwidth
      >
        Clear changes
      </Button>
      <Button type="submit" disabled={isSubmitDisabled} fullwidth>
        {buttonText}
      </Button>
    </Container>
  );
};
