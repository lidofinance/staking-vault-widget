import { Address } from 'viem';

// TODO: move to utilsApi?
export interface AddressValidationFile {
  addresses: string[];
  isBroken?: boolean;
}

// TODO: move to utilsApi?
export const validateAddressLocally = (
  address: Address,
  validationFile: AddressValidationFile,
): { isValid: boolean } => {
  if (!address) return { isValid: true };

  const normalizedAddress = address.toLowerCase();

  const isNotValid = validationFile.addresses.some(
    (addr) => addr.toLowerCase() === normalizedAddress,
  );

  return {
    isValid: !isNotValid,
  };
};
