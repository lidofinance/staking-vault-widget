import { config } from 'config';

export const validators: Record<number, string> = {
  [1]: 'https://beaconcha.in/validators/deposits?q=',
  [560048]: 'https://hoodi.beaconcha.in/validators/deposits?q=',
};

export const getValidatorsLink = (): string => {
  return validators[config.defaultChain];
};
