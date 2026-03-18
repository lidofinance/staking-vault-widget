import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { CopyAddress } from 'shared/components';

import { AddressWithTooltip, ExternalLinkIcon } from './components';
import { Container, Content } from './styles';

type ContractAddressProps = {
  title: string;
  address: string | undefined;
};

export const ContractAddress: FC<ContractAddressProps> = ({
  title,
  address,
}) => {
  if (!address) {
    return null;
  }

  const lowerCaseAddress = address.toLowerCase();

  return (
    <Container>
      <Text size="xs" strong>
        {title}
      </Text>
      <Content>
        <AddressWithTooltip address={lowerCaseAddress} />
        <CopyAddress address={lowerCaseAddress} />
        <ExternalLinkIcon address={lowerCaseAddress} />
      </Content>
    </Container>
  );
};
