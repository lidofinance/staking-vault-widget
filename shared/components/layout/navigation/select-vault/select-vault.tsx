import { Address, isAddress } from 'viem';
import { useVaults } from 'providers/vaults';
import { useDappStatus } from 'modules/web3';

import { Identicon, Option, Select } from '@lidofinance/lido-ui';
import { IconWrapper, Wrapper } from './styles';

import { truncateAddress } from 'utils/truncate-address';

export const SelectVault = () => {
  const { isWalletConnected } = useDappStatus();
  const { vaults, setActiveVault, activeVault } = useVaults();
  const showSelectAddress = vaults.length > 0;

  const handleChange = (address: string | number): void => {
    if (isAddress(address as string)) {
      setActiveVault(address as Address);
    }
  };

  if (!isWalletConnected || !activeVault) return null;

  return (
    <Wrapper>
      <IconWrapper>
        <Identicon address={activeVault.address} diameter={20} />
      </IconWrapper>
      {showSelectAddress && (
        <Select
          onChange={handleChange}
          defaultValue={activeVault.address}
          variant="small"
          arrow="small"
        >
          {vaults.map(({ address }) => {
            const truncatePayload = {
              startLength: 5,
              endLength: 4,
              address: address,
            };

            return (
              <Option key={address} value={address}>
                {truncateAddress(truncatePayload)}
              </Option>
            );
          })}
        </Select>
      )}
    </Wrapper>
  );
};
