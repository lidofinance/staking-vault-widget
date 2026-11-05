import styled, { css } from 'styled-components';

import { AddressInputHookForm } from 'shared/hook-form/controls';

import { devicesHeaderMedia } from 'styles/global';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: ${({ theme }) => theme.spaceMap.sm}px;

  @media ${devicesHeaderMedia.mobile} {
    width: 100%;
  }
`;

// highlight only a new valid address, otherwise keep Input's own
// border states (default / hover / error)
export const PDGAddressInput = styled(AddressInputHookForm)<{
  $isNewAddress: boolean;
}>`
  ${({ theme: { colors }, $isNewAddress }) =>
    $isNewAddress &&
    css`
      & > span,
      &:hover > span {
        border-color: ${colors.success};
      }
    `}
`;
