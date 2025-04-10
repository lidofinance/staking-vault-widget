import { AbstractLidoSDKErc20 } from '@lidofinance/lido-ethereum-sdk/erc20';
import { CHAINS, LidoSDKCore } from '@lidofinance/lido-ethereum-sdk';
import type { Address } from 'viem';

export const WETH_BY_NETWORK: {
  [key in CHAINS]?: Address;
} = {
  [CHAINS.Sepolia]: '0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9',
};

export class LidoSDKwETH extends AbstractLidoSDKErc20 {
  #address = WETH_BY_NETWORK[CHAINS.Sepolia] as Address;

  public async contractAddress(): Promise<Address> {
    return this.#address;
  }

  constructor(props: { core: LidoSDKCore }) {
    super(props);
  }
}
