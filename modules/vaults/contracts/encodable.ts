import type { Abi, Address } from 'viem';

type ContractType = {
  address: Address;
  abi: Abi;
  read?: {
    [functionName: string]: (...args: any[]) => Promise<any>;
  };
  simulate?: {
    [functionName: string]: (...args: any[]) => Promise<any>;
  };
};

type EncodableContract<
  TContract extends ContractType,
  TSimulate extends
    TContract['simulate'] = TContract['simulate'] extends undefined
    ? never
    : TContract['simulate'],
  TRead extends TContract['read'] = TContract['read'] extends undefined
    ? never
    : TContract['read'],
  TMethods extends TSimulate & TRead = TSimulate & TRead,
  TFunctionName extends keyof TMethods = keyof TMethods,
> = TContract & {
  encode: {
    [K in TFunctionName]: (
      ...args: Parameters<
        TMethods[K] extends (...args: any[]) => any ? TMethods[K] : never
      >
    ) => {
      address: TContract['address'];
      abi: TContract['abi'];
      functionName: K;
      args: Parameters<
        TMethods[K] extends (...args: any[]) => any ? TMethods[K] : never
      >;
    };
  };
};

export const getEncodable = <TContract extends ContractType>(
  contract: TContract,
) => {
  (contract as any).encode = new Proxy(
    {},
    {
      get(_, functionName: string) {
        return (...parameters: unknown[]) => {
          return {
            address: contract.address,
            abi: contract.abi,
            functionName,
            args: parameters[0],
          };
        };
      },
    },
  );
  return contract as EncodableContract<TContract>;
};
