import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

import {
  FieldSchema,
  PermissionKeys,
} from 'features/settings/permissions/types';
import { ConnectWalletButton } from 'shared/wallet';

export const PermissionsAction: FC = () => {
  const {
    getValues,
    setValue,
    formState: { isValid, isSubmitting, isDirty },
  } = useFormContext();
  const isSubmitDisabled = !isValid || !isDirty || isSubmitting;
  const isClearDisabled = !isDirty;

  const handleResetFields = () => {
    const formValues = getValues();
    const keys = Object.keys(formValues) as PermissionKeys[];
    keys.forEach((key) => {
      const permissionList: FieldSchema[] = formValues[key];
      const newList = permissionList
        .filter((field) => field.group === 'settled')
        .map((field) => {
          field.state = 'display';
          return field;
        });

      setValue(key, newList);
    });
  };

  return (
    <Container>
      <ConnectWalletButton>
        <Button
          onClick={handleResetFields}
          disabled={isClearDisabled}
          variant="outlined"
          fullwidth
        >
          Clear changes
        </Button>
        <Button type="submit" disabled={isSubmitDisabled} fullwidth>
          {isSubmitDisabled ? 'No changes' : 'Submit transactions'}
        </Button>
      </ConnectWalletButton>
    </Container>
  );
};
