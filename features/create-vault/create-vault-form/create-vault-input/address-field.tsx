import { useFormContext, useFormState, useWatch } from 'react-hook-form';
import { External, Identicon, Tooltip } from '@lidofinance/lido-ui';
import { type FC, useMemo } from 'react';
import { isAddress, type Address } from 'viem';

import { useDappStatus } from 'modules/web3';
import { AddressInputHookForm } from 'shared/hook-form/controls';
import { getEtherscanAddressLink } from 'utils/etherscan';

import { EtherscanLinkWrapper } from './styles';

type EtherscanLinkProps = {
  address: Address;
  testId: string;
};

const EtherscanLink: FC<EtherscanLinkProps> = ({ address, testId }) => {
  const { chainId } = useDappStatus();
  const href = useMemo(
    () => getEtherscanAddressLink(chainId, address),
    [chainId, address],
  );

  return (
    <EtherscanLinkWrapper target="_blank" href={href} data-testid={testId}>
      <Tooltip title="View on Etherscan">
        <External fill="var(--lido-color-primary)" />
      </Tooltip>
    </EtherscanLinkWrapper>
  );
};

type AddressFieldProps = {
  fieldName: string;
  placeholder?: string;
  deps?: string | string[];
};

export const AddressField: FC<AddressFieldProps> = ({
  fieldName,
  placeholder,
  deps,
}) => {
  const { getFieldState } = useFormContext();
  const value = useWatch({ name: fieldName }) as string | undefined;
  const formState = useFormState({ name: fieldName });
  const { error } = getFieldState(fieldName, formState);

  const validAddress =
    !!value && isAddress(value) && !error ? value : undefined;

  // Pass decorators only for a valid address: lido-ui renders a padded
  // wrapper even if the decorator element itself renders nothing.
  return (
    <AddressInputHookForm
      showRightDecorator={false}
      fieldName={fieldName}
      placeholder={placeholder}
      deps={deps}
      leftDecorator={
        validAddress ? (
          <Identicon address={validAddress} diameter={20} />
        ) : undefined
      }
      rightDecorator={
        validAddress ? (
          <EtherscanLink
            address={validAddress}
            testId={`createVault-${fieldName}-etherscanLink`}
          />
        ) : undefined
      }
    />
  );
};
