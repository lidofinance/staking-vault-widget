import { useMintFormData } from 'features/adjustment/mint/mint-form-context';

import { Text } from '@lidofinance/lido-ui';
import { AmountInfo, InfoRow, Wrapper } from './styles';

import { formatBalance } from 'utils';
import { useFormContext } from 'react-hook-form';

export const Balance = () => {
  const { mintableStETH, mintableWstETH } = useMintFormData();
  const { watch } = useFormContext();
  const token = watch('token');
  const balance = token === 'stETH' ? mintableStETH : mintableWstETH;

  return (
    <Wrapper>
      <InfoRow>
        <Text size="xxs" color="secondary">
          Available to mint
        </Text>
        <AmountInfo>
          {formatBalance(balance).trimmed} {token}
        </AmountInfo>
      </InfoRow>
    </Wrapper>
  );
};
