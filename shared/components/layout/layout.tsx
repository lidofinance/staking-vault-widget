import { ReactNode, FC, PropsWithChildren } from 'react';
import { ContainerProps } from '@lidofinance/lido-ui';

import { config } from 'config';
import { useErrorMessage } from 'shared/wallet/fallback/useErrorMessage';

import { IPFSInfoBox } from 'features/ipfs/ipfs-info-box';
import { Header } from './header';
import { Main } from './main';
import { Navigation, AllVaultsMobile } from './navigation';
import { CookieLess } from './cookie-less';
import { Footer } from './footer';
import { ChainBanner } from './chain-banner';
import {
  LayoutTitle,
  LayoutSubTitle,
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
        <AllVaultsMobile />
        <LayoutTitle>{title}</LayoutTitle>
        <LayoutSubTitle>{subtitle}</LayoutSubTitle>
        {children}
      </Main>
      <CookieLess />
      <Footer />
    </LayoutStyles>
  );
};
