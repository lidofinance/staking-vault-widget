import { FC, useMemo } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Button } from '@lidofinance/lido-ui';

import { ConnectWalletButton } from 'shared/wallet';

import { RoleFieldSchema } from 'features/settings/main/types';
import { multipleDataFields } from 'features/settings/main/consts';

import { Container } from './styled';

export const MainSettingsAction: FC = () => {
  const { watch, setValue } = useFormContext();
  const { isValid, isDirty, isSubmitting, disabled } = useFormState();
  const isClearDisabled = !isDirty;
  const isSubmitDisabled = !isValid || !isDirty || isSubmitting || disabled;
  const formFields = watch();

  const handleClearMainForm = () => {
    const initialData: RoleFieldSchema[][] = Object.entries(formFields).map(
      ([key, itemsList]) => {
        if (multipleDataFields.includes(key)) {
          return itemsList
            .filter((item: RoleFieldSchema) =>
              ['display', 'remove'].includes(item.state),
            )
            .map((item: RoleFieldSchema) => ({
              ...item,
              state: 'display',
            })) as RoleFieldSchema[];
        }

        return [];
      },
    );

    Object.keys(formFields).map((key, index) =>
      setValue(key, initialData[index]),
    );
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

      if (formFields.nodeOperatorFeeBP.length > 0) {
        counter++;
      }

      if (formFields.confirmExpiry.length > 0) {
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
