import styled, { css } from 'styled-components';
import { Input } from '@lidofinance/lido-ui';

export const InputStyle = styled(Input)`
  width: 100%;

  // fix case when 'InputGroup' contains only one element
  &:only-child {
    & > span {
      border-radius: 10px !important;
    }
  }

  & > span {
    ${({ theme, disabled }) =>
      theme.name === 'dark'
        ? css`
            background: ${disabled && '#27272E8F'};
          `
        : css`
            background: ${disabled && '#EFF2F68F'};
          `}
  }
`;
