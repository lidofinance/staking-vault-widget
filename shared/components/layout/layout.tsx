import { ReactNode, FC, PropsWithChildren } from 'react';
import { ContainerProps } from '@lidofinance/lido-ui';

import { config } from 'config';
import { useErrorMessage } from 'shared/wallet/fallback/useErrorMessage';

import { IPFSInfoBox } from 'features/ipfs/ipfs-info-box';
import { Header } from './header';
import { Main } from './main';
import { Navigation } from './navigation';
import { Footer } from './footer';
import { ChainBanner } from './chain-banner';
import {
  LayoutTitleStyle,
  LayoutSubTitleStyle,
  IPFSInfoBoxOnlyMobileAndPortableWrapper,
  LayoutStyles,
} from './styles';

type LayoutProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  containerSize?: ContainerProps['size'];
  navigationMode?: React.ComponentProps<typeof Navigation>['mode'];
};

export const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  title,
  subtitle,
  containerSize,
  navigationMode,
  children,
}) => {
  const errorMessage = useErrorMessage();

  return (
    <LayoutStyles isError={!!errorMessage}>
      <Header />
      <ChainBanner />
      <Navigation mode={navigationMode} />
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
