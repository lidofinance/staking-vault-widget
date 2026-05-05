import type { FC } from 'react';
import { Divider, Checkbox, Text } from '@lidofinance/lido-ui';
import { useFormContext } from 'react-hook-form';

import { vaultTexts } from 'modules/vaults';

import { Container, InputBlock } from './styles';

const { confirm } = vaultTexts.actions.antiScam.banners.multipleOwners;

type ConfirmAndProceedProps = {
  fieldName: 'notOwner' | 'multipleOwners' | 'unguaranteedDeposits';
};

export const ConfirmAndProceed: FC<ConfirmAndProceedProps> = ({
  fieldName,
}) => {
  const { register } = useFormContext();

  return (
    <Container>
      <Divider />
      <InputBlock>
        <Checkbox {...register(fieldName)} />
        <Text size="xxs">{confirm}</Text>
      </InputBlock>
    </Container>
  );
};
