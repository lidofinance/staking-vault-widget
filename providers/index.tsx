import { FC, PropsWithChildren, useState } from 'react';
import { CookieThemeProvider } from '@lidofinance/lido-ui';
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { GlobalStyle } from 'styles';
import { ConfigProvider } from 'config';

import { Web3Provider } from 'modules/web3';
import { VaultProvider } from 'modules/vaults';

import { bigIntHashKey } from 'utils/bn-int-hash-key';
import { AddressValidationFile } from 'utils/address-validation';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { NonRetriableQueryError } from 'consts/non-retriable-query-error';
import { TransactionModal } from 'shared/components/transaction-modal';

import { AddressValidationProvider } from './address-validation-provider';
import { AppFlagProvider } from './app-flag';
import { IPFSInfoBoxStatusesProvider } from './ipfs-info-box-statuses';
import { InpageNavigationProvider } from './inpage-navigation';
import { ModalProvider } from './modal-provider';
import { ExternalForbiddenRouteProvider } from './external-forbidden-route';

type ProvidersProps = {
  prefetchedManifest?: unknown;
  validationFile?: AddressValidationFile;
};

const initQueryClient = () =>
  new QueryClient({
    mutationCache: new MutationCache({
      onError: (error, variables, context, mutation) => {
        console.debug(
          `[QueryClient] Mutation error, mutationKey: ${mutation.options.mutationKey}`,
          { error, variables, mutation, context },
        );
      },
    }),
    queryCache: new QueryCache({
      onError: (error, query) => {
        console.debug(
          `[QueryClient] Query error, queryKey: ${query.options.queryKey}`,
          { error, query },
        );
      },
    }),
    defaultOptions: {
      queries: {
        ...STRATEGY_LAZY,
        queryKeyHashFn: bigIntHashKey,
        retry: (failureCount, error) =>
          failureCount < 3 && !(error instanceof NonRetriableQueryError),
      },
    },
  });

// Exposes queryClient instance for access outside of react tree
export let QUERY_CLIENT_UNSAFE_REF: QueryClient | undefined = undefined;

export const Providers: FC<PropsWithChildren<ProvidersProps>> = ({
  children,
  prefetchedManifest,
  validationFile,
}) => {
  // SSR Safe + useState value cannot be discarded/recomputed by React like useMemo
  const [queryClient] = useState(() => initQueryClient());

  QUERY_CLIENT_UNSAFE_REF = queryClient;
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider prefetchedManifest={prefetchedManifest}>
        <AppFlagProvider>
          <CookieThemeProvider>
            <GlobalStyle />
            <Web3Provider>
              <IPFSInfoBoxStatusesProvider>
                <InpageNavigationProvider>
                  <ModalProvider>
                    <ExternalForbiddenRouteProvider>
                      <AddressValidationProvider
                        validationFile={validationFile}
                      >
                        <VaultProvider>
                          <TransactionModal>{children}</TransactionModal>
                        </VaultProvider>
                      </AddressValidationProvider>
                    </ExternalForbiddenRouteProvider>
                  </ModalProvider>
                </InpageNavigationProvider>
              </IPFSInfoBoxStatusesProvider>
            </Web3Provider>
          </CookieThemeProvider>
        </AppFlagProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
};
