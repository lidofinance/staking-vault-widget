import styled from 'styled-components';
import { Input } from '@lidofinance/lido-ui';

export const InputStyled = styled(Input)`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
  padding-left: 35px;

  & > span:first-child {
    background: transparent;
    border: none;
  }
`;
