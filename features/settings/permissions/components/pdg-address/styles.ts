import styled from 'styled-components';

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

export const PDGAddressInput = styled(AddressInputHookForm)<{
  $isNewAddress: boolean;
}>`
  & > span,
  &:hover > span {
    border-color: ${({ theme: { colors }, $isNewAddress }) =>
      $isNewAddress ? colors.success : colors.border};
  }
`;
