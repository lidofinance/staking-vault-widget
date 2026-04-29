import { Divider, Checkbox, Text } from '@lidofinance/lido-ui';

import { vaultTexts } from 'modules/vaults';

import { Container, InputBlock } from './styles';

const { confirm } = vaultTexts.actions.supply.banners.multipleOwners;

export const AgreeConfirm = () => {
  return (
    <Container>
      <Divider />
      <InputBlock>
        <Checkbox />
        <Text size="xxs">{confirm}</Text>
      </InputBlock>
    </Container>
  );
};
