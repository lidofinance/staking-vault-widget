import { FC, HTMLAttributes, SVGProps } from 'react';
import Link from 'next/link';
import { LidoLogo } from '@lidofinance/lido-ui';

import { config } from 'config';

import { LogoLidoStyle } from './styles';

export type LogoComponent = FC<Omit<SVGProps<SVGSVGElement>, 'ref'>>;

const { rootOrigin } = config;

export const LogoLido: FC<HTMLAttributes<HTMLDivElement>> = (props) => (
  <LogoLidoStyle {...props}>
    <Link href={rootOrigin}>
      <LidoLogo data-testid="lidoLogo" />
    </Link>
  </LogoLidoStyle>
);
