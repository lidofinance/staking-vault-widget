import { type Address, isAddressEqual } from 'viem';

// TODO: move to utilsApi?
export interface AddressValidationFile {
  addresses: Address[];
  isBroken?: boolean;
}

// TODO: move to utilsApi?
export const validateAddressLocally = (
  address: Address,
  validationFile: AddressValidationFile,
): { isValid: boolean } => {
  if (!address) return { isValid: true };
  const { addresses } = validationFile;
  const isValid = addresses.some((addr) => isAddressEqual(addr, address));

  return {
    isValid,
  };
};
