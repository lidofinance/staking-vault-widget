import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const ReportStateContainer = styled.article`
  display: none;

  @media ${devicesHeaderMedia.mobile} {
    display: flex;
    align-self: flex-end;
    flex-direction: row;
    justify-content: flex-end;
    gap: 8px;
  }
`;
