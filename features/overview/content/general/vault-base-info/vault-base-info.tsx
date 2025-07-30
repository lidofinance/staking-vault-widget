import { Vault } from './vault';
import { NodeOperator } from './node-operator';

import { Wrapper } from './styles';

export const VaultBaseInfo = () => {
  return (
    <Wrapper data-testid="baseInfoSection">
      <Vault />
      <NodeOperator />
    </Wrapper>
  );
};
