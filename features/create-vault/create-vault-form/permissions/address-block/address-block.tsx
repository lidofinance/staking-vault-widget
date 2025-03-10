import { FC, useMemo } from 'react';
import { Address } from 'viem';
import { useFormContext } from 'react-hook-form';

import { AddressBadge } from 'shared/components/address-badge';
import { Wrapper } from './styles';

export interface AddressBlockProps {
  permission: string;
}

export const AddressBlock: FC<AddressBlockProps> = ({ permission }) => {
  const { watch, getFieldState } = useFormContext();
  const addresses = watch(permission) as { value: Address }[];

  const addressesForRender: { initialIndex: number; value: Address }[] =
    useMemo(() => {
      return addresses
        .map((item, index) => ({ ...item, initialIndex: index }))
        .filter((item, index) => {
          const { invalid } = getFieldState(`${permission}.${index}.value`);
          if (!item.value) return false;
          return !invalid;
        });
    }, [addresses, permission, getFieldState]);

  if (addressesForRender.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      {addressesForRender.map(({ value }) => {
        return <AddressBadge key={value} address={value} />;
      })}
    </Wrapper>
  );
};
