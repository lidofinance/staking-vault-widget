import styled from 'styled-components';

export const RadioInputSelector = styled.div`
  max-width: 20px;
  width: 100%;
  height: 20px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const RadioInputStyled = styled.input`
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  &:disabled + ${RadioInputSelector} {
    display: none;
  }
`;

export const Content = styled.div`
  z-index: 1;
`;

export const RadioInputLabel = styled.label<{
  hasError?: boolean;
  disabled?: boolean;
}>`
  min-height: 56px;
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  gap: 14px;
  border-radius: 10px;
  position: relative;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  background: ${({ disabled }) => (disabled ? '#F5F5F7' : 'transparent')};

  &:hover {
    &:after {
      border-width: ${({ disabled }) => (disabled ? '1px' : '2px')};
      transition: border ${({ theme }) => theme.duration.fast}
        ${({ theme }) => theme.ease.inOutSine};
    }
  }

  &:has(${RadioInputStyled}:checked):not(:disabled) {
    background: rgba(0, 163, 255, 0.08);

    &:has(${Content} input:focus) {
      background: ${({ theme }) => theme.colors.foreground};
    }

    &:after {
      border-width: 2px;
      border-color: ${({ hasError, theme }) =>
        hasError ? theme.colors.error : theme.colors.primary};
    }

    ${RadioInputSelector} {
      border: 4px solid ${({ theme }) => theme.colors.primary};
    }
  }

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: 10px;
  }
`;

export const RightDecorator = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  margin-left: auto;
`;

export const Chip = styled.div`
  padding: 2px 8px;
  background: rgba(39, 56, 82, 0.06);
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  border-radius: 4px;
`;
