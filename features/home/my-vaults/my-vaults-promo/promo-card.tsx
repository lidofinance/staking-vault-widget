import type { FC } from 'react';

import {
  Description,
  PromoCardAction,
  PromoCardHeader,
  PromoCardTitle,
  PromoCardWrapper,
} from './styles';

export type PromoCardProps = {
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  dataTestId: string;
};

export const PromoCard: FC<PromoCardProps> = ({
  title,
  description,
  actionLabel,
  href,
  dataTestId,
}) => (
  <PromoCardWrapper>
    <PromoCardHeader>
      <PromoCardTitle>{title}</PromoCardTitle>
      <PromoCardAction
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        data-testid={dataTestId}
      >
        {actionLabel}
      </PromoCardAction>
    </PromoCardHeader>
    <Description>{description}</Description>
  </PromoCardWrapper>
);
