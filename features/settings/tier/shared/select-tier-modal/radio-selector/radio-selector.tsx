import { InputHTMLAttributes, forwardRef, ChangeEvent } from 'react';

import { CheckStyled, Label } from './styles';

type RadioSelectorOwnProps = {
  tierIdString: string;
  name: string;
  onChange: (e: ChangeEvent) => void;
};

export type RadioSelectorProps = RadioSelectorOwnProps &
  InputHTMLAttributes<HTMLInputElement>;

export const RadioSelector = forwardRef<HTMLInputElement, RadioSelectorProps>(
  ({ tierIdString, ...rest }, ref) => {
    return (
      <Label htmlFor={tierIdString}>
        <input
          id={tierIdString}
          type="radio"
          value={tierIdString}
          {...rest}
          ref={ref}
        />
        <CheckStyled />
      </Label>
    );
  },
);
