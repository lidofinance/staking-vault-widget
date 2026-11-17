import type { FC } from 'react';
import { Link } from '@lidofinance/lido-ui';

import { config } from 'config';

import { BadgeContainer, TextStyled } from './styles';

type BadgeTooltipProps = {
  description: string;
};

const docsLink = `${config.docsOrigin}/run-on-lido/stvaults/node-operators/basic-stvaults/node-operator-identification-guide`;

export const BadgeTooltip: FC<BadgeTooltipProps> = ({ description }) => {
  return (
    <BadgeContainer>
      <TextStyled size="xxs" color="default">
        {description}
        <br />
        <Link href={docsLink}>Learn more</Link>
      </TextStyled>
    </BadgeContainer>
  );
};
