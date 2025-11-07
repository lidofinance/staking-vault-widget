import { Address, isAddress } from 'viem';

const regex = new RegExp('[-a-zA-Z0-9@._]{1,256}.eth');

export const isValidEns = (ens: string) => regex.test(ens);

export const isValidAnyAddress = (input: string): input is Address =>
  isAddress(input);

// TODO: move to utilsApi?
export interface AddressValidationFile {
  addresses: string[];
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
