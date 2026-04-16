import styled from 'styled-components';

import { getColorTransparency } from 'styles';

export const WarmingContainer = styled.footer`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: 100%;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: 12px;
  background-color: ${({
    theme: {
      colors: { warning },
    },
  }) => getColorTransparency(warning, '20%')};
`;

export const IconWrapper = styled.div`
  width: fit-content;
  height: fit-content;
`;
