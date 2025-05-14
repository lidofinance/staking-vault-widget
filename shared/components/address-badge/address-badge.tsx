// import { MouseEvent, forwardRef, ForwardedRef, ChangeEvent } from 'react';
//
// import {
//   Identicon,
//   Loader,
//   TextColors,
//   TextWeight,
// } from '@lidofinance/lido-ui';
// import { ButtonClose, ButtonRestore } from 'shared/components';
// import { PillContainer, AddressText } from './styles';
// import { zeroAddress } from 'viem';
//
// export type AddressBadgeProps = {
//   address?: string;
//   symbols?: number;
//   checked?: boolean;
//   isActive?: boolean;
//   size?: 'xs' | 'sm' | 'md' | 'lg';
//   color?: TextColors;
//   weight?: TextWeight;
//   bgColor?: 'transparent' | 'default' | 'error' | 'success' | 'active';
//   readonly?: boolean;
//   isLoading?: boolean;
//   onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
//   onClick?: (event: MouseEvent<HTMLDivElement>) => void;
// };
//
// export const AddressBadge = forwardRef<HTMLDivElement, AddressBadgeProps>(
//   (
//     {
//       address,
//       symbols = 6,
//       checked = false,
//       isActive = false,
//       size = 'xs',
//       color = 'default',
//       weight = 700,
//       bgColor = 'default',
//       onChange,
//       readonly,
//       isLoading,
//       onClick,
//     },
//     ref?: ForwardedRef<HTMLDivElement>,
//   ) => {
//     if (isLoading) {
//       return (
//         <PillContainer bgColor={bgColor} onClick={onClick} ref={ref}>
//           <Identicon address={zeroAddress} />
//           <Loader size="large" />
//         </PillContainer>
//       );
//     }
//
//     if (!address) {
//       return null;
//     }
//
//     const containerBgColor = isActive ? 'active' : bgColor;
//
//     return (
//       <PillContainer bgColor={containerBgColor} onClick={onClick} ref={ref}>
//         <Identicon address={address} />
//         <AddressText
//           size={size}
//           color={color}
//           weight={weight}
//           symbols={symbols}
//           address={address}
//           crossedText={checked}
//         />
//
//         {/*{!readonly && !!onChange && (*/}
//         {/*  <label htmlFor={address}>*/}
//         {/*    <input*/}
//         {/*      id={address}*/}
//         {/*      type="checkbox"*/}
//         {/*      checked={checked}*/}
//         {/*      onChange={onChange}*/}
//         {/*    />*/}
//         {/*  </label>*/}
//         {/*)}*/}
//
//         {!readonly && !checked && onChange && (
//           <ButtonClose onClick={onChange} />
//         )}
//         {!readonly && checked && onChange && (
//           <ButtonRestore onClick={onChange} />
//         )}
//       </PillContainer>
//     );
//   },
// );

import React, { forwardRef, MouseEventHandler } from 'react';
import {
  Identicon,
  Loader,
  TextColors,
  TextWeight,
} from '@lidofinance/lido-ui';
import { zeroAddress } from 'viem';
import { PillContainer, AddressText } from './styles';

export interface AddressBadgeProps {
  address?: string;
  symbols?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: TextColors;
  weight?: TextWeight;
  bgColor?: 'transparent' | 'default' | 'error' | 'success' | 'active';
  crossed?: boolean;
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const AddressBadge = forwardRef<HTMLDivElement, AddressBadgeProps>(
  (
    {
      address,
      symbols = 6,
      size = 'xs',
      color = 'default',
      weight = 700,
      bgColor = 'default',
      crossed = false,
      isLoading = false,
      onClick,
    },
    ref,
  ) => {
    if (isLoading) {
      return (
        <PillContainer
          crossed={crossed}
          bgColor={bgColor}
          onClick={onClick}
          ref={ref}
        >
          <Identicon address={zeroAddress} />
          <Loader size="large" />
        </PillContainer>
      );
    }

    if (!address) {
      return null;
    }

    return (
      <PillContainer
        crossed={crossed}
        bgColor={bgColor}
        onClick={onClick}
        ref={ref}
      >
        <Identicon address={address} />
        <AddressText
          size={size}
          color={color}
          weight={weight}
          symbols={symbols}
          address={address}
          crossedText={crossed}
        />
      </PillContainer>
    );
  },
);
