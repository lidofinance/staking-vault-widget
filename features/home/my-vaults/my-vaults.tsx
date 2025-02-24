import { useDappStatus } from 'modules/web3';

import { ConnectWallet } from 'features/home/my-vaults/connect-wallet';
import { AuthContent } from 'features/home/my-vaults/auth-content';
import { Wrapper } from './styles';

export const MyVaults = () => {
  const { address } = useDappStatus();

  return (
    <Wrapper>
      {!address ? <ConnectWallet /> : <AuthContent address={address} />}
    </Wrapper>
  );
};
