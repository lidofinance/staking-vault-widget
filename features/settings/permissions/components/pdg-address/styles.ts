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

  // the lido-ui error popup (second span in the label) overlays the next
  // form row and eats the first click; keep it visible but click-through
  & > span + span {
    pointer-events: none;
  }
`;
