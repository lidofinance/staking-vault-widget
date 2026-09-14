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

  return (
    <Container>
      <Text size="xs" strong>
        {title}
      </Text>
      <Content>
        <AddressWithTooltip address={address} />
        <CopyAddress address={address} />
        <ExternalLinkIcon address={address} />
      </Content>
    </Container>
  );
};
