const validators: Record<number, string> = {
  [1]: 'https://beaconcha.in/validators/deposits?q=',
  [560048]: 'https://hoodi.beaconcha.in/validators/deposits?q=',
};

export const getValidatorsLink = (chainId: number | undefined): string => {
  const defaultLink = validators[1];
  if (!chainId) return defaultLink;

  return validators[chainId] ?? defaultLink;
};
