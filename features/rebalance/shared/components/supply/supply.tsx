import { Container } from './styles';
import { Description } from './description';
import { SupplyInput } from './supply-input';
import { SupplyToggle } from './supply-toggle';

export const Supply = () => {
  return (
    <Container>
      <SupplyToggle />
      <SupplyInput />
      <Description />
    </Container>
  );
};
