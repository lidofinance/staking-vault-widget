import styled from 'styled-components';
import { InputGroup } from '@lidofinance/lido-ui';

type InputGroupProps = React.ComponentProps<typeof InputGroup>;

export const InputGroupStyled = styled(InputGroup)<{
  success?: InputGroupProps['success'];
}>`
  z-index: 2;
  span:nth-of-type(2) {
    white-space: ${({ success }) => !!success && 'unset'};
  }
`;
