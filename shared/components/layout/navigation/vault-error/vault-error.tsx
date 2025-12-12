import { useEffect, useState, useCallback } from 'react';

import {
  DisplayableError,
  VaultOwnerNotDashboardError,
  useVault,
} from 'modules/vaults';
import { vaultTexts } from 'modules/vaults/consts';

import { BaseErrorModal, DashboardNotVerified } from './components';

const texts = vaultTexts.common;

export const VaultError = () => {
  const { error, refetch } = useVault();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onRefetch = useCallback(() => {
    void refetch({ cancelRefetch: true, throwOnError: false });
  }, [refetch]);

  // TODO: fix lido-ui, modal opened in SSR causes error on server
  if (!isMounted || !error) return null;

  let isRetryable = true;
  let errorMessage: string = texts.errors.vault.loadingVault;

  if (error instanceof VaultOwnerNotDashboardError) {
    return <DashboardNotVerified />;
  }

  if (error instanceof DisplayableError) {
    isRetryable = error.isRetryable;
    errorMessage = error.message;
  }

  return (
    <BaseErrorModal
      errorMessage={errorMessage}
      isRetryable={isRetryable}
      onRefetch={onRefetch}
    />
  );
};
