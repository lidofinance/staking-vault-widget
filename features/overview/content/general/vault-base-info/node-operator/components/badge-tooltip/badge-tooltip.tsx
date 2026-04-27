import type { FC } from 'react';
import { Text, Link } from '@lidofinance/lido-ui';

import { config } from 'config';

import { BadgeContainer } from './styles';

type BadgeTooltipProps = {
  description: string;
};

const docsLink = `${config.docsOrigin}/run-on-lido/stvaults/operational-and-management-guides/node-operators-identification`;

export const BadgeTooltip: FC<BadgeTooltipProps> = ({ description }) => {
  return (
    <BadgeContainer>
      <Text size="xxs">
        {description}
        <br />
        <Link href={docsLink}>Learn more</Link>
      </Text>
    </BadgeContainer>
  );
};
