import styled from 'styled-components';

import { getColorTransparency } from 'styles';

export const BannerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  background-color: ${({ theme }) =>
    getColorTransparency(theme.colors.warning, '10%')};

  & svg {
    color: ${({ theme }) => theme.colors.warning};
  }
`;

export const IconWrapper = styled.div`
  width: fit-content;
  height: fit-content;
`;
