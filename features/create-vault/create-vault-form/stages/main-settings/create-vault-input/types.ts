import type { ReactNode } from 'react';

export type CreateFormInputProps = {
  name: string;
  placeholder?: string;
  dataTestId?: string;
  disabled?: boolean;
  rightDecorator?: ReactNode;
};
