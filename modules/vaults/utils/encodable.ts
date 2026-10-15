import {
  encodeFunctionData,
  type Abi,
  type Address,
  type ContractFunctionArgs,
  type ContractFunctionName,
  type Hex,
} from 'viem';

// copy from view internals
const getFunctionParameters = (values: unknown[]) => {
  const hasArgs = values.length > 0 && Array.isArray(values[0]);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const args = (hasArgs ? values[0]! : []) as unknown[];
  const options = ((hasArgs ? values[1] : values[0]) ?? {}) as any;
  return { args, options };
};

type ContractType = {
  address: Address;
  abi: Abi;
  read?: object;
  simulate?: object;
};

// read + simulate cover all four mutabilities
type Mutability = 'pure' | 'view' | 'nonpayable' | 'payable';

// Function arguments tuple for K, coerced to a tuple (ContractFunctionArgs
// widens to `unknown` while TContract['abi'] is still the generic `Abi`).
type FnArgs<
  TAbi extends Abi,
  K extends ContractFunctionName<TAbi, Mutability>,
> =
  ContractFunctionArgs<TAbi, Mutability, K> extends infer TArgs extends
    readonly unknown[]
    ? TArgs
    : readonly unknown[];

// no inputs -> [options?]; has inputs -> [args, options?]
type CallParameters<TArgs extends readonly unknown[]> =
  TArgs extends readonly []
    ? [options?: { value?: bigint }]
    : [args: TArgs, options?: { value?: bigint }];

// Derived directly from the ABI (via viem's ContractFunctionName /
// ContractFunctionArgs) rather than from the contract's read/simulate function
// types, to keep type instantiation shallow.
type EncodableContract<TContract extends ContractType> = TContract & {
  prepare: {
    [K in ContractFunctionName<TContract['abi'], Mutability>]: (
      ...args: CallParameters<FnArgs<TContract['abi'], K>>
    ) => {
      address: TContract['address'];
      abi: TContract['abi'];
      functionName: K;
      args: FnArgs<TContract['abi'], K>;
    };
  };
  encode: {
    [K in ContractFunctionName<TContract['abi'], Mutability>]: (
      ...args: CallParameters<FnArgs<TContract['abi'], K>>
    ) => {
      to: TContract['address'];
      data: Hex;
      value?: bigint;
    };
  };
};

export const getEncodable = <TContract extends ContractType>(
  contract: TContract,
) => {
  (contract as any).prepare = new Proxy(
    {},
    {
      get(_, functionName: string) {
        return (...parameters: unknown[]) => {
          const { args } = getFunctionParameters(parameters);
          return {
            address: contract.address,
            abi: contract.abi,
            functionName,
            args,
          };
        };
      },
    },
  );
  (contract as any).encode = new Proxy(
    {},
    {
      get(_, functionName: string) {
        return (...parameters: unknown[]) => {
          const { args, options } = getFunctionParameters(parameters);
          return {
            to: contract.address,
            data: encodeFunctionData({
              abi: contract.abi,
              functionName,
              args,
            }),
            value: options.value,
          };
        };
      },
    },
  );
  return contract as EncodableContract<TContract>;
};
