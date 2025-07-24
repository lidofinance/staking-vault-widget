import { Text, Divider } from '@lidofinance/lido-ui';

import { ExpiresInItem } from './content/expires-in-item';
import { RequestBy } from './content/request-by';

import {
  ContentContainer,
  List,
  ListContainer,
  ListItem,
  Wrapper,
} from './styles';

export const RequestAdditionalInfo = () => {
  // Tier minting limit
  // Vault metrics base info
  // Vault metrics extended info
  // Request by

  return (
    <Wrapper>
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
