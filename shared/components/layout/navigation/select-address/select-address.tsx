import { Identicon, Option, Select } from '@lidofinance/lido-ui';

import { IconWrapper, Wrapper } from './styles';

import { useDappStatus } from 'modules/web3';
import { truncateAddress } from 'utils/truncate-address';

// TODO: add accounts switcher
const handleChange = (): void => {};

export const SelectAddress = () => {
  const { address, addresses, isWalletConnected } = useDappStatus();
  const showSelectAddress = !!addresses;

  if (!isWalletConnected || !address) return null;

  return (
    <Wrapper>
      <IconWrapper>
        <Identicon address={address} diameter={20} />
      </IconWrapper>
      {showSelectAddress && (
        <Select
          onChange={handleChange}
          defaultValue={address}
          variant="small"
          arrow="small"
        >
          {addresses.map((address) => {
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
