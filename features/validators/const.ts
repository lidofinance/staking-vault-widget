import { WEI_PER_ETHER } from 'consts/tx';

export enum VALIDATOR_MODALS {
  withdrawalToVault = 'withdrawalToVault',
  topUpValidator = 'topUpValidator',
}

export const BEACONCHA_LINK_BY_NETWORK: Record<1 | 560048, string> = {
  [1]: 'https://beaconcha.in',
  [560048]: 'https://hoodi.beaconcha.in',
};

export const numberRegex = /^\d+$/;

export const VALIDATOR_PUBKEY_LENGTH = 98;
export const MIN_ACTIVATION_BALANCE = WEI_PER_ETHER * 32n;
