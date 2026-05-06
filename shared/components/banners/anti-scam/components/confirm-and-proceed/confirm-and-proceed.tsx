import type { FC } from 'react';
import { Divider } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults/consts/texts';
import { CheckboxHookForm } from 'shared/hook-form';

import type { AntiScamConfirmFieldName } from '../../types';

import { ConfirmContainer, ConfirmInputBlock, Label } from './styles';

type ConfirmAndProceedProps = {
  fieldName: AntiScamConfirmFieldName;
};

const { confirm } = vaultTexts.actions.antiScam.banners.multipleOwners;

export const ConfirmAndProceed: FC<ConfirmAndProceedProps> = ({
  fieldName,
}) => {
  return (
    <ConfirmContainer>
      <Divider />
      <ConfirmInputBlock>
        <CheckboxHookForm
          fieldName={fieldName}
          label={<Label>{confirm}</Label>}
          data-testid={`antiScam-${fieldName}-checkbox`}
        />
      </ConfirmInputBlock>
    </ConfirmContainer>
  );
};
