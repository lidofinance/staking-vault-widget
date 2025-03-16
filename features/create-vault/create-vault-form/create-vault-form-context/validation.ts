import { Address, createPublicClient, http, isAddress } from 'viem';
import { normalize } from 'viem/ens';
import { z } from 'zod';
import { holesky } from 'viem/chains';

const INVALID_ADDRESS_MESSAGE = 'Invalid ethereum address';
const INVALID_NUMBER_MIN_MESSAGE = 'Must be 0.001 or above';
const INVALID_NUMBER_MAX_MESSAGE = 'Must be 99 or less';
const INVALID_NUMBER_DATA_MESSAGE = { message: 'Only number is valid' };

const validateAddress = (value: string) => isAddress(value);

const addressSchema = z
  .string()
  .refine(validateAddress, { message: INVALID_ADDRESS_MESSAGE })
  .transform((value) => value as Address);

export const createVaultSchema = z.object({
  nodeOperator: addressSchema,
  nodeOperatorManager: addressSchema,
  nodeOperatorFeeBP: z
    .number(INVALID_NUMBER_DATA_MESSAGE)
    .min(0.001, INVALID_NUMBER_MIN_MESSAGE)
    .max(99, INVALID_NUMBER_MAX_MESSAGE),
  curatorFeeBP: z.coerce
    .number(INVALID_NUMBER_DATA_MESSAGE)
    .min(0.001, INVALID_NUMBER_MIN_MESSAGE)
    .max(99, INVALID_NUMBER_MAX_MESSAGE),
  confirmExpiry: z.coerce
    .number(INVALID_NUMBER_DATA_MESSAGE)
    .min(1, INVALID_NUMBER_MIN_MESSAGE)
    .max(800, 'Must be 800 or less'),
  defaultAdmin: addressSchema,
  confirmMainSettings: z.boolean(),
  funders: z.array(addressSchema).optional(),
  withdrawers: z.array(addressSchema).optional(),
  minters: z.array(addressSchema).optional(),
  burners: z.array(addressSchema).optional(),
  rebalancers: z.array(addressSchema).optional(),
  depositPausers: z.array(addressSchema).optional(),
  depositResumers: z.array(addressSchema).optional(),
  validatorExitRequesters: z.array(addressSchema).optional(),
  validatorWithdrawalTriggerers: z.array(addressSchema).optional(),
  disconnecters: z.array(addressSchema).optional(),
  curatorFeeSetters: z.array(addressSchema).optional(),
  curatorFeeClaimers: z.array(addressSchema).optional(),
  nodeOperatorFeeClaimers: z.array(addressSchema).optional(),
});

// TODO: move to constants (rpc)
// TODO: replace http address
const publicClient = createPublicClient({
  chain: holesky,
  transport: http('https://1rpc.io/holesky'),
});

// TODO: move to shared validators
export const validateEnsDomain = async (value: string) => {
  try {
    const ensAddress = await publicClient.getEnsAddress({
      name: normalize(value),
    });

    return !!ensAddress;
  } catch (e) {
    return false;
  }
};

export type CreateVaultSchema = z.infer<typeof createVaultSchema>;
