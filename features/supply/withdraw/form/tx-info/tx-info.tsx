import { useFormContext } from 'react-hook-form';

import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import { AmountInfo, InfoRow, Wrapper } from './styles';

export const TxInfo = () => {
  const { watch } = useFormContext();
  const [amount, token] = watch(['amount', 'token']);

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          You will receive
        </Text>
        <AmountInfo>
          <FormatToken amount={amount} symbol={token} fallback="-" />
        </AmountInfo>
      </InfoRow>
    </Wrapper>
  );
};
