import { WEI_PER_ETHER } from 'consts/tx';

import { ValidatorsStatistic } from 'features/validators/shared';
import { Wrapper } from './styles';

const fakeData = [
  {
    title: 'Deposited on validators',
    hint: 'Lorem ipsum set amet',
    amount: WEI_PER_ETHER,
  },
  {
    title: 'In a queue',
    hint: 'Lorem ipsum set amet',
    amount: WEI_PER_ETHER + WEI_PER_ETHER,
  },
];

export const AmountStatistic = () => {
  // TODO: get data from context
  return (
    <Wrapper>
      {fakeData.map((statistic) => (
        <ValidatorsStatistic key={statistic.title} {...statistic} />
      ))}
    </Wrapper>
  );
};
