import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const NodeOperatorContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const NodeOperatorParameter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  gap: ${({ theme }) => theme.spaceMap.xs}px;

  @media ${devicesHeaderMedia.tablet} {
    align-items: start;
  }
`;
