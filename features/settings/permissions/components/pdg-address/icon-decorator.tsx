import type { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { Identicon } from '@lidofinance/lido-ui';
import { isAddress } from 'viem';

import { ReactComponent as ErrorTriangle } from 'assets/icons/error-triangle.svg';

import {
  EditPermissionsSchema,
  PGDRolesKeys,
} from 'features/settings/permissions/types';

type IconDecoratorProps = {
  formFieldName: PGDRolesKeys;
};

export const IconDecorator: FC<IconDecoratorProps> = ({ formFieldName }) => {
  const fieldData = useWatch<EditPermissionsSchema, PGDRolesKeys>({
    name: formFieldName,
  });

  if (isAddress(fieldData)) {
    return <Identicon address={fieldData} />;
  }

  return <ErrorTriangle />;
};
