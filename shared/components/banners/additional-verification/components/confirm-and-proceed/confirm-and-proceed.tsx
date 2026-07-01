import type { FC } from 'react';
import { Divider, Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults/consts/texts';
import { CheckboxHookForm } from 'shared/hook-form';

import type { VerificationConfirmFieldName } from '../../types';

import { ConfirmContainer, ConfirmInputBlock } from './styles';

type ConfirmAndProceedProps = {
  fieldName: VerificationConfirmFieldName;
};

const { confirm } =
  vaultTexts.actions.additionalVerification.banners.multipleOwners;

export const ConfirmAndProceed: FC<ConfirmAndProceedProps> = ({
  fieldName,
}) => {
  return (
    <ConfirmContainer>
      <Divider />
      <ConfirmInputBlock>
        <CheckboxHookForm
          fieldName={fieldName}
          data-testid={`additionalVerification-${fieldName}-checkbox`}
        />
        <Text size="xxs">{confirm}</Text>
      </ConfirmInputBlock>
    </ConfirmContainer>
  );
};
