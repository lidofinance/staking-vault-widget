import { useDappStatus } from 'modules/web3';
import { WalletCardComponent } from 'shared/wallet/card/types';

import { useErrorMessage } from './useErrorMessage';
import { FallbackWalletStyle, TextStyle } from './styles';

type FallbackProps = React.ComponentProps<WalletCardComponent> & {
  toActionText?: string;
  error?: string;
};
export const Fallback = ({
  children,
  toActionText,
  error: errorProp,
  ...props
}: FallbackProps) => {
  const { isWalletConnected } = useDappStatus();
  let error = useErrorMessage();

  if (errorProp) error = errorProp;

  if (error) {
    return (
      <FallbackWalletStyle {...props}>
        <TextStyle>{error}</TextStyle>
      </FallbackWalletStyle>
    );
  }

  if (!isWalletConnected) return null;

  return children;
};
