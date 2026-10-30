// minimal ABIs to read the oracle reporting frame
export const AccountingOracleConsensusAbi = [
  {
    inputs: [],
    name: 'getConsensusContract',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const HashConsensusAbi = [
  {
    inputs: [],
    name: 'getChainConfig',
    outputs: [
      { internalType: 'uint256', name: 'slotsPerEpoch', type: 'uint256' },
      { internalType: 'uint256', name: 'secondsPerSlot', type: 'uint256' },
      { internalType: 'uint256', name: 'genesisTime', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getFrameConfig',
    outputs: [
      { internalType: 'uint256', name: 'initialEpoch', type: 'uint256' },
      { internalType: 'uint256', name: 'epochsPerFrame', type: 'uint256' },
      {
        internalType: 'uint256',
        name: 'fastLaneLengthSlots',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
