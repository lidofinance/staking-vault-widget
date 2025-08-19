import {
  InputHTMLAttributes,
  forwardRef,
  ChangeEvent,
  PropsWithChildren,
} from 'react';

import { CheckStyled, SelectorLabel } from './styles';

type RadioSelectorOwnProps = {
  tierIdString: string;
  name: string;
  onChange: (e: ChangeEvent) => void;
};

export type RadioSelectorProps = PropsWithChildren<
  RadioSelectorOwnProps & InputHTMLAttributes<HTMLInputElement>
>;

export const RadioSelector = forwardRef<HTMLInputElement, RadioSelectorProps>(
  ({ tierIdString, children, ...rest }, ref) => {
    return (
      <SelectorLabel htmlFor={tierIdString}>
        {children}
        <input
          id={tierIdString}
          type="radio"
          value={tierIdString}
          {...rest}
          ref={ref}
        />
        <CheckStyled />
      </SelectorLabel>
    );
  },
);
