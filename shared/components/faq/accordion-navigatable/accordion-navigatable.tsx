import { useCallback } from 'react';
import { Accordion } from '@lidofinance/lido-ui';
import { useInpageNavigation } from 'providers/inpage-navigation';

type AccordionNavigatableProps = React.ComponentProps<typeof Accordion> & {
  id: string;
};

export const AccordionNavigatable = ({
  onCollapse,
  id,
  defaultExpanded,
  ...rest
}: AccordionNavigatableProps) => {
  const { hashNav, resetSpecificAnchor } = useInpageNavigation();

  const handleCollapse = useCallback(() => {
    resetSpecificAnchor(id);
    onCollapse?.();
  }, [resetSpecificAnchor, id, onCollapse]);

  const shouldExpand = hashNav ? hashNav === id : defaultExpanded;

  return (
    <Accordion
      {...rest}
      id={id}
      defaultExpanded={shouldExpand}
      onCollapse={handleCollapse}
    />
  );
};
