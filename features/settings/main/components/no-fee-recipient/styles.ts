import styled from 'styled-components';

import { Block } from '@lidofinance/lido-ui';

export const Wrapper = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  padding: 0;
`;
