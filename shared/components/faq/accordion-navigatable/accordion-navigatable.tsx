import { useCallback } from 'react';
import { Accordion } from '@lidofinance/lido-ui';
import { useInpageNavigation } from 'providers/inpage-navigation';

type AccordionNavigatableProps = React.ComponentProps<typeof Accordion> & {
  id: string;
};

export const AccordionNavigatable = ({
  onCollapse,
  id,
  ...rest
}: AccordionNavigatableProps) => {
  const { hashNav, resetSpecificAnchor } = useInpageNavigation();

  const handleCollapse = useCallback(() => {
    resetSpecificAnchor(id);
    onCollapse?.();
  }, [resetSpecificAnchor, id, onCollapse]);

  return (
    <Accordion
      {...rest}
      defaultExpanded={hashNav === id}
      onCollapse={handleCollapse}
    />
  );
};
