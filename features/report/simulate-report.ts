import {
  decodeFunctionResult,
  encodeFunctionData,
  type Address,
  type Hex,
  type ContractFunctionParameters,
  type MulticallReturnType,
  type PublicClient,
} from 'viem';

const encodeCall = <
  TContract extends ContractFunctionParameters & {
    from?: Address;
  },
>(
  contract: TContract,
) => ({
  to: contract.address,
  data: encodeFunctionData({
    abi: contract.abi,
    functionName: contract.functionName,
    args: contract.args,
  }),
  from: contract.from,
});

type ReadWithReportArgs<
  TContracts extends
    readonly unknown[] = readonly (ContractFunctionParameters & {
    from?: Address;
  })[],
> = {
  publicClient: PublicClient;
  contracts: TContracts;
  reportCall?: ContractFunctionParameters;
};

export const readWithReport = async <
  TContracts extends readonly (ContractFunctionParameters & {
    from?: Address;
  })[],
>({
  publicClient,
  reportCall,
  contracts,
}: ReadWithReportArgs<TContracts>): Promise<
  MulticallReturnType<TContracts, false>
> => {
  const calls: {
    to: Address;
    data: Hex;
    from?: Address;
  }[] = contracts.map((contract) => encodeCall(contract));

  if (reportCall) {
    calls.unshift(encodeCall(reportCall));
    const simulateData = await publicClient.simulateCalls({ calls });
    const results = simulateData.results;

    results.shift();

    const parsedResults = results.map(({ data }, index) => {
      const { abi, functionName, args } = contracts[index];
      return decodeFunctionResult({
        abi,
        functionName,
        args,
        data: data,
      });
    });

    return parsedResults as MulticallReturnType<TContracts, false>;
  }

  // fallback to eth_call with multicall when no reportCall is provided
  return publicClient.multicall({
    contracts: contracts as any,
    allowFailure: false,
  }) as unknown as MulticallReturnType<TContracts, false>;
};
