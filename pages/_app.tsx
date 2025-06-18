import { ErrorBoundary } from 'react-error-boundary';
import { AppProps } from 'next/app';
import 'nprogress/nprogress.css';
import Head from 'next/head';

import { ToastContainer, CookiesTooltip } from '@lidofinance/lido-ui';

import { config } from 'config';
import { withCsp } from 'config/csp';
import { SecurityStatusBanner } from 'features/ipfs';
import { Providers } from 'providers';
import { BackgroundGradient } from 'shared/components/background-gradient/background-gradient';
import { ErrorBoundaryFallback } from 'shared/components/error-boundary';
import { MigrationBannerTestnetV2 } from 'shared/components/banner';
import NoSsrWrapper from 'shared/components/no-ssr-wrapper';
import { nprogress } from 'utils';

// Visualize route changes
nprogress();

const App = (props: AppProps) => {
  const { Component, pageProps } = props;

  return (
    <ErrorBoundary fallbackRender={ErrorBoundaryFallback}>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
};

const AppWrapper = (
  props: AppProps<{ ___prefetch_manifest___?: object }>,
): JSX.Element => {
  return (
    <Providers prefetchedManifest={props.pageProps?.___prefetch_manifest___}>
      {/* see https://nextjs.org/docs/messages/no-document-viewport-meta */}
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </Head>
      <BackgroundGradient
        width={1560}
        height={784}
        style={{
          opacity: 'var(--lido-color-darkThemeOpacity)',
        }}
      />
      <ToastContainer />
      <MigrationBannerTestnetV2 />
      <App {...props} />

      <NoSsrWrapper>
        <CookiesTooltip privacyLink={`${config.rootOrigin}/privacy-notice`} />
      </NoSsrWrapper>

      <SecurityStatusBanner />
    </Providers>
  );
};

export default config.ipfsMode || process.env.NODE_ENV === 'development'
  ? AppWrapper
  : withCsp(AppWrapper);
