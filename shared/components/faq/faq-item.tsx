import { useMemo, type ComponentProps } from 'react';
import invariant from 'tiny-invariant';

import { AccordionStyled } from './styles';

import type { AccordionNavigatable } from './accordion-navigatable';

type FAQItemProps = { id?: string; title: string } & Omit<
  ComponentProps<typeof AccordionNavigatable>,
  'id' | 'summary' | 'title'
>;

const toKebabCase = (str: string) =>
  str
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '') // Remove non-word characters except hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with a single one
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens

export const FAQItem = ({ id, title, ...rest }: FAQItemProps) => {
  const navId = useMemo(() => {
    if (id) return id;
    if (typeof title === 'string') {
      return toKebabCase(title);
    }
    invariant(false, '[FAQItem] id or title must be provided');
  }, [id, title]);

  return <AccordionStyled id={navId} summary={title} {...rest} />;
};
