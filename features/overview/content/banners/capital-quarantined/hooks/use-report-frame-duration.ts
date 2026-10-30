import { useQuery } from '@tanstack/react-query';
import { LIDO_CONTRACT_NAMES } from '@lidofinance/lido-ethereum-sdk/common';

import {
  AccountingOracleConsensusAbi,
  HashConsensusAbi,
} from 'abi/hash-consensus-abi';
import { STRATEGY_CONSTANT } from 'consts/react-query-strategies';
import { useLidoSDK } from 'modules/web3';

// duration of the accounting oracle frame in seconds,
// vaults report timestamps are refSlot timestamps spaced by this value
export const useReportFrameDuration = () => {
  const { core, publicClient } = useLidoSDK();

  return useQuery({
    queryKey: ['report-frame-duration', core.chainId] as const,
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      const accountingOracle = await core.getContractAddress(
        LIDO_CONTRACT_NAMES.accountingOracle,
      );
      const hashConsensus = await publicClient.readContract({
        address: accountingOracle,
        abi: AccountingOracleConsensusAbi,
        functionName: 'getConsensusContract',
      });
      const [[slotsPerEpoch, secondsPerSlot], [, epochsPerFrame]] =
        await Promise.all([
          publicClient.readContract({
            address: hashConsensus,
            abi: HashConsensusAbi,
            functionName: 'getChainConfig',
          }),
          publicClient.readContract({
            address: hashConsensus,
            abi: HashConsensusAbi,
            functionName: 'getFrameConfig',
          }),
        ]);

      return epochsPerFrame * slotsPerEpoch * secondsPerSlot;
    },
  });
};
