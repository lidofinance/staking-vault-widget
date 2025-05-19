import { useErrorMessage } from 'shared/wallet/fallback/useErrorMessage';

import { WarningMessage } from 'shared/components/warning-message';

export const ChainBanner = () => {
  const errorMessage = useErrorMessage();

  if (!errorMessage) return null;

  return <WarningMessage>{errorMessage}</WarningMessage>;
};
