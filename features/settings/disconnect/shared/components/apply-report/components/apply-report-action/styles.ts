import styled from 'styled-components';
import { PermissionedSubmitButton } from 'modules/vaults';

export const ButtonStyled = styled(PermissionedSubmitButton)`
  width: fit-content;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
`;
