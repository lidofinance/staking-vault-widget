import styled from 'styled-components';
import { Input, Theme } from '@lidofinance/lido-ui';

const getBackgroundColor = ({
  theme,
  $checked,
}: {
  $checked: boolean;
  theme: Theme;
}) => {
  return $checked
    ? `color-mix(in display-p3, ${theme.colors.primary} 8%, transparent)`
    : theme.colors.primaryContrast;
};

export const Radio = styled.input`
  display: none;
`;

export const Label = styled.label`
  display: contents;
`;

export const InputField = styled(Input)<{
  $checked: boolean;
  $defaultDisabled: boolean;
  $invalid: boolean;
}>`
  width: 100%;

  &:has(input:checked) {
    & > span:first-child {
      border-color: ${({ theme: { colors }, $invalid }) =>
        $invalid ? colors.error : colors.primary};

      & > span:first-child > div {
        border: 4px solid ${({ theme }) => theme.colors.primary};
        cursor: default;
      }
    }
  }

  & > span:first-child {
    background-color: ${getBackgroundColor};

    & > div input[type='text'] {
      pointer-events: ${({ $defaultDisabled }) =>
        $defaultDisabled ? 'none' : 'inherit'};
    }

    & > span:first-child > div {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 1px solid ${({ theme }) => theme.colors.border};
      cursor: pointer;
    }
  }
`;

export const ChipsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;
