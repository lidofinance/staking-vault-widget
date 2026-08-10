import styled from 'styled-components';

import { FormController } from 'shared/hook-form';
import { CheckboxHookForm } from 'shared/hook-form/controls';

type FormControllerType = typeof FormController;

export const FormControllerStyled: FormControllerType = styled(FormController)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const AddressToggle = styled(CheckboxHookForm)`
  width: fit-content;

  && svg {
    display: none;
  }

  && p {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
    font-weight: 400;
    line-height: 24px;
    text-decoration: none;
  }
`;

export const RecipientContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;
