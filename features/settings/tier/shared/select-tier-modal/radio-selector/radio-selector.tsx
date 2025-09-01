import {
  InputHTMLAttributes,
  forwardRef,
  ChangeEvent,
  PropsWithChildren,
} from 'react';

import { CheckStyled, SelectorLabel, Selector } from './styles';

type RadioSelectorOwnProps = {
  tierIdString: string;
  name: string;
  showSelector: boolean;
  onChange: (e: ChangeEvent) => void;
};

export type RadioSelectorProps = PropsWithChildren<
  RadioSelectorOwnProps & InputHTMLAttributes<HTMLInputElement>
>;

export const RadioSelector = forwardRef<HTMLInputElement, RadioSelectorProps>(
  ({ tierIdString, children, showSelector, ...rest }, ref) => {
    if (showSelector) {
      return (
        <SelectorLabel htmlFor={tierIdString}>
          {children}
          <>
            <input
              id={tierIdString}
              type="radio"
              value={tierIdString}
              {...rest}
              ref={ref}
            />
            <CheckStyled />
          </>
        </SelectorLabel>
      );
    }

    return <Selector>{children}</Selector>;
  },
);
