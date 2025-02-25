import { useDappStatus } from 'modules/web3';

import { ConnectWallet } from 'features/home/my-vaults/connect-wallet';
import { ConnectedWalletContent } from 'features/home/my-vaults/auth-content';
import { Wrapper } from './styles';

export const MyVaults = () => {
  const { address } = useDappStatus();

  return (
    <Wrapper>
      {!address ? (
        <ConnectWallet />
      ) : (
        <ConnectedWalletContent address={address} />
      )}
    </Wrapper>
  );
};
