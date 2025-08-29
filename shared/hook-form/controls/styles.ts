import styled from 'styled-components';
import { Checkbox, InputGroup } from '@lidofinance/lido-ui';

type InputGroupProps = React.ComponentProps<typeof InputGroup>;

export const InputGroupStyled = styled(InputGroup)<{
  success?: InputGroupProps['success'];
}>`
  z-index: 2;
  span:nth-of-type(2) {
    white-space: ${({ success }) => !!success && 'unset'};
  }
`;

export const CheckBoxStyled = styled(Checkbox)<{ error?: boolean }>`
  & p {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
  svg {
    box-shadow: ${({ error, theme }) =>
      error ? ` inset 0 0 0 1px ${theme.colors.error} !important` : 'unset'};
  }
`;
