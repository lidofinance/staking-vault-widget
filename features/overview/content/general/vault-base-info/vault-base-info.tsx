import { Vault } from './vault';
import { NodeOperator } from './node-operator';

import { Wrapper } from './styles';

export const VaultBaseInfo = () => {
  return (
    <Wrapper>
      <Vault />
      <NodeOperator />
    </Wrapper>
  );
};
