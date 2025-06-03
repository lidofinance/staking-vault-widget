import { FC, useMemo } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Button } from '@lidofinance/lido-ui';

import { ConnectWalletButton } from 'shared/wallet';
import { vaultTexts } from 'modules/vaults';

import { RoleFieldSchema } from 'features/settings/main/types';
import { multipleDataFields } from 'features/settings/main/consts';
import { shouldIncrementTxCounter } from 'features/settings/main/utils';
import { useMainSettingsData } from 'features/settings/main/contexts';

import { Container } from './styled';

export const MainSettingsAction: FC = () => {
  const { watch, reset } = useFormContext();
  const { isValid, isDirty, isSubmitting, isValidating, disabled } =
    useFormState();
  const isClearDisabled = !isDirty;
  const mainSettingsData = useMainSettingsData();
  const isSubmitDisabled = isSubmitting || disabled || isValidating;

  const formFields = watch();

  const handleClearMainForm = () => {
    reset();
  };

  const counter = useMemo(() => {
    let counter = 0;

    if (isValid) {
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

      const { nodeOperatorFeeBP, confirmExpiry } = formFields;

      if (
        shouldIncrementTxCounter(
          nodeOperatorFeeBP,
          mainSettingsData?.nodeOperatorFeeBP.find(
            (item) => item.type === 'current',
          )?.value,
        )
      ) {
        counter++;
      }

      if (
        shouldIncrementTxCounter(
          confirmExpiry,
          mainSettingsData?.confirmExpiry.find(
            (item) => item.type === 'current',
          )?.value,
        )
      ) {
        counter++;
      }
    }

    return counter;
  }, [
    formFields,
    isValid,
    mainSettingsData?.confirmExpiry,
    mainSettingsData?.nodeOperatorFeeBP,
  ]);

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
          {vaultTexts.actions.settings.clearChanges}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitDisabled || !hasChanges}
          fullwidth
        >
          {vaultTexts.actions.settings.submit(counter)}
        </Button>
      </ConnectWalletButton>
    </Container>
  );
};
