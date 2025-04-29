import { useErrorMessage } from 'shared/wallet/fallback/useErrorMessage';

import { ErrorMessageWrapper, WarningIcon } from './styles';

export const ChainBanner = () => {
  const errorMessage = useErrorMessage();

  if (!errorMessage) return null;

  return (
    <ErrorMessageWrapper>
      <WarningIcon />
      {errorMessage}
    </ErrorMessageWrapper>
  );
};
