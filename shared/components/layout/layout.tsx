import { ReactNode, FC, PropsWithChildren } from 'react';
import { ContainerProps } from '@lidofinance/lido-ui';
import { Address } from 'viem';

import { config } from 'config';

import { IPFSInfoBox } from 'features/ipfs/ipfs-info-box';
import { Header } from './header/header';
import { Main } from './main/main';
import { Navigation } from './navigation';
import { Footer } from './footer/footer';
import {
  LayoutTitleStyle,
  LayoutSubTitleStyle,
  IPFSInfoBoxOnlyMobileAndPortableWrapper,
  LayoutStyles,
} from './styles';

type LayoutProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  address?: Address;
  containerSize?: ContainerProps['size'];
};

export const Layout: FC<PropsWithChildren<LayoutProps>> = (props) => {
  const { title, subtitle, containerSize, address, children } = props;

  return (
    <LayoutStyles>
      <Header />
      <Navigation address={address} />
      <Main size={containerSize}>
        {config.ipfsMode && (
          <IPFSInfoBoxOnlyMobileAndPortableWrapper>
            <IPFSInfoBox />
          </IPFSInfoBoxOnlyMobileAndPortableWrapper>
        )}
        <LayoutTitleStyle>{title}</LayoutTitleStyle>
        <LayoutSubTitleStyle>{subtitle}</LayoutSubTitleStyle>
        {children}
      </Main>
      <Footer />
    </LayoutStyles>
  );
};
