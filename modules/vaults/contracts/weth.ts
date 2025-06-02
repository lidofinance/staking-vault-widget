import invariant from 'tiny-invariant';
import { AbstractLidoSDKErc20 } from '@lidofinance/lido-ethereum-sdk/erc20';

import { getContractAddress } from 'config';

export class LidoSDKwETH extends AbstractLidoSDKErc20 {
  public async contractAddress() {
    const contractAddress = getContractAddress(this.core.chainId, 'weth');
    invariant(contractAddress, '[LidoSDKwETH] Contract address is not defined');
    return contractAddress;
  }
}
