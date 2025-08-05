import { Text, Divider } from '@lidofinance/lido-ui';

import { ExpiresInItem } from './content/expires-in-item';
import { RequestBy } from './content/request-by';
import { OldToNew } from './content/old-to-new';
import { DefaultItem } from './content/default-item';
import { VaultInfo } from './vault-info';

import {
  ContentContainer,
  List,
  ListContainer,
  ListItem,
  Wrapper,
} from './styles';

export const RequestAdditionalInfo = () => {
  // TODO: get voting info

  return (
    <Wrapper>
      <ListContainer>
        <List>
          <ListItem>
            <Text size="xxs" color="secondary">
              Tier minting limit
            </Text>
            <ContentContainer>
              <Text size="xxs">{'50 000 stETH'}</Text>
            </ContentContainer>
          </ListItem>
          <ListItem>
            <Text size="xxs" color="secondary">
              Tier remaining capacity
            </Text>
            <ContentContainer>
              <OldToNew old={'32 000 stETH'} supposed={'27 500 stETH'} />
            </ContentContainer>
          </ListItem>
        </List>
      </ListContainer>
      <Divider />
      <VaultInfo />
      <Divider />
      <ListContainer>
        <List>
          <ListItem>
            <Text size="xxs" color="secondary">
              stVault minting capacity
            </Text>
            <ContentContainer>
              <OldToNew old={'5 000 stETH'} supposed={'9000 stETH'} />
            </ContentContainer>
          </ListItem>
          <ListItem>
            <Text size="xxs" color="secondary">
              Reserve ratio
            </Text>
            <ContentContainer>
              <OldToNew old={'50%'} supposed={'30%'} />
            </ContentContainer>
          </ListItem>
          <ListItem>
            <Text size="xxs" color="secondary">
              Forced rebalance threshold
            </Text>
            <ContentContainer>
              <OldToNew old={'40%'} supposed={'20%'} />
            </ContentContainer>
          </ListItem>
          <ListItem>
            <Text size="xxs" color="secondary">
              Lido infrastructure fee
            </Text>
            <ContentContainer>
              <DefaultItem payload={'1%'} />
            </ContentContainer>
          </ListItem>
          <ListItem>
            <Text size="xxs" color="secondary">
              Lido liquidity fee
            </Text>
            <ContentContainer>
              <OldToNew old={'5,5%'} supposed={'6,5%'} />
            </ContentContainer>
          </ListItem>
        </List>
      </ListContainer>
      <Divider />
      <ListContainer>
        <List>
          <ListItem>
            <Text size="xxs" color="secondary">
              Request by
            </Text>
            <ContentContainer>
              <RequestBy
                address={'0x317Eb725E5eC272651e594e7D14f49ad9D46A98B'}
              />
            </ContentContainer>
          </ListItem>
          <ListItem>
            <Text size="xxs" color="secondary">
              Expires in
            </Text>
            <ContentContainer>
              <ExpiresInItem />
            </ContentContainer>
          </ListItem>
        </List>
      </ListContainer>
    </Wrapper>
  );
};
