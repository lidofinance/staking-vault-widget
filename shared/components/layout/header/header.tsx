import { FC } from 'react';
import { LogoLido } from 'shared/components/logos/logos';
import { Text } from '@lidofinance/lido-ui';

import { HeaderStyle, HeaderActionsStyle, Divider } from './styles';
import HeaderWallet from './components/header-wallet';

export const Header: FC = () => (
  <HeaderStyle size="full" forwardedAs="header">
    <LogoLido />
    <Divider />
    <Text size="md">stVaults</Text>
    <HeaderActionsStyle>
      <HeaderWallet />
    </HeaderActionsStyle>
  </HeaderStyle>
);
