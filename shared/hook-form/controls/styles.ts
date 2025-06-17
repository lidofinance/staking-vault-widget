import styled from 'styled-components';
import { Checkbox, InputGroup } from '@lidofinance/lido-ui';

type InputGroupProps = React.ComponentProps<typeof InputGroup>;

export const CheckBoxStyled = styled(Checkbox)`
  & p {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const InputGroupStyled = styled(InputGroup)<{
  success?: InputGroupProps['success'];
}>`
  z-index: 2;
  span:nth-of-type(2) {
    white-space: ${({ success }) => !!success && 'unset'};
  }
`;
