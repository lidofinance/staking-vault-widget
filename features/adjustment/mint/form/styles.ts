import styled from 'styled-components';
import { FormController } from 'shared/hook-form/form-controller';

export const FormControllerStyled = styled(FormController)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;
