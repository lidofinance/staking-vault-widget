import { Button, Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import { WEI_PER_ETHER } from 'consts/tx';
import { vaultTexts } from 'modules/vaults';

import { ActionContainer, FeeContent } from './styles';

const { estimatedFee, action } =
  vaultTexts.actions.validators.modals.withdrawal;

// TODO: add estimatedFee data
export const WithdrawalAction = () => {
  return (
    <ActionContainer>
      <FeeContent>
        <Text size="xxs" color="secondary">
          {estimatedFee}
        </Text>
        <Text size="xxs">
          <FormatToken amount={WEI_PER_ETHER / 1000n} symbol="ETH" />
        </Text>
      </FeeContent>
      <Button fullwidth>{action}</Button>
    </ActionContainer>
  );
};
