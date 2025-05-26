import { FC, useMemo } from 'react';
import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

import { useFormContext } from 'react-hook-form';
import { RoleFieldSchema } from 'features/settings/main/types';
import { multipleDataFields } from 'features/settings/main/consts';
import { ConnectWalletButton } from 'shared/wallet';

export const MainSettingsAction: FC = () => {
  const {
    watch,
    formState: { isValid, isDirty, isSubmitting, isValidating },
    reset,
  } = useFormContext();
  const isClearDisabled = !isDirty;
  const isSubmitDisabled = !isValid || !isDirty || isSubmitting || isValidating;
  const formFields = watch();

  const handleClearMainForm = () => {
    reset();
  };

  const [buttonText, counter] = useMemo(() => {
    let counter = 0;

    if (!isSubmitDisabled) {
      multipleDataFields.forEach((key) => {
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

      if (formFields.nodeOperatorFeeBP.selectedIndex > 0) {
        counter++;
      }

      if (formFields.confirmExpiry.selectedIndex > 0) {
        counter++;
      }

      if (counter) {
        return [
          `Submit ${counter} transaction${counter > 1 ? 's' : ''}`,
          counter,
        ];
      }
    }

    return ['No changes', counter];
  }, [formFields, isSubmitDisabled]);

  const hasChanges = counter > 0;

  return (
    <Container>
      <ConnectWalletButton>
        <Button
          type="button"
          variant="outlined"
          disabled={isClearDisabled || !hasChanges}
          onClick={handleClearMainForm}
          fullwidth
        >
          Clear changes
        </Button>
        <Button
          type="submit"
          disabled={isSubmitDisabled || !hasChanges}
          fullwidth
        >
          {buttonText}
        </Button>
      </ConnectWalletButton>
    </Container>
  );
};
