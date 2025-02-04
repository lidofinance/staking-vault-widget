import { getPreConfig, PreConfigType } from './get-preconfig';
import * as cache from './groups/cache';
import * as locale from './groups/locale';
import * as revalidation from './groups/revalidation';
import * as web3 from './groups/web3';

export type ConfigType = {
  isClientSide: boolean;
  isServerSide: boolean;
} & typeof cache &
  typeof web3 &
  typeof locale &
  typeof revalidation &
  PreConfigType;

export const getConfig = (): ConfigType => {
  return {
    isClientSide: typeof window !== 'undefined',
    isServerSide: typeof window === 'undefined',

    ...cache,
    ...web3,
    ...locale,
    ...revalidation,

    // highest priority
    ...getPreConfig(),
  };
};

export const config = getConfig();
