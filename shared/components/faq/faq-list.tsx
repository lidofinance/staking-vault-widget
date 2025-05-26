import type { ComponentProps, FC, PropsWithChildren } from 'react';
import { Section } from '../section/section';

type FAQProps = ComponentProps<typeof Section>;

export const FAQList: FC<PropsWithChildren<FAQProps>> = ({
  children,
  title = 'FAQ',
  ...props
}) => {
  return (
    <Section title={title} {...props}>
      {children}
    </Section>
  );
};
