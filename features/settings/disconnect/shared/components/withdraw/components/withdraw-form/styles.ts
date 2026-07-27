import styled from 'styled-components';

import { FormController } from 'shared/hook-form';
import { CheckboxHookForm } from 'shared/hook-form/controls';

type FormControllerType = typeof FormController;

// the step is already rendered inside a card, so only spacing is needed here
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

// the checkbox box itself is hidden, only its label acts as the switch
export const AddressToggle = styled(CheckboxHookForm)`
  width: fit-content;

  && svg {
    display: none;
  }

  && p {
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
    text-decoration: underline;
  }
`;
