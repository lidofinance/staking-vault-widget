import { Input, Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import { vaultTexts } from 'modules/vaults';
import { WEI_PER_ETHER } from 'consts/tx';

import { useValidatorModal } from 'features/validators/contexts';
import { VALIDATOR_MODALS } from 'features/validators/const';

import { AmountContainer, AvailableContent } from './styles';

const { availableToWithdraw } = vaultTexts.actions.validators.modals.withdrawal;
// TODO: get amount data
export const WithdrawalAmount = () => {
  const { currentModal } = useValidatorModal();
  const isFull = VALIDATOR_MODALS.fullWithdrawal === currentModal;

  if (isFull) {
    return null;
  }

  return (
    <AmountContainer>
      <AvailableContent>
        <Text size="xxs" color="secondary">
          {availableToWithdraw}
        </Text>
        <Text size="xxs">
          <FormatToken amount={WEI_PER_ETHER} symbol="ETH" />
        </Text>
      </AvailableContent>
      <Input fullwidth />
    </AmountContainer>
  );
};
