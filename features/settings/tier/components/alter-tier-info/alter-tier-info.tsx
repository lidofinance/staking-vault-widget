import { Text } from '@lidofinance/lido-ui';

import { ReactComponent as WarningTriangle } from 'assets/icons/warning-triangle.svg';

import { useAlterTier } from 'features/settings/tier/hooks';
import {
  InfoContainer,
  TitleContainer,
  Wrapper,
  TextStyled,
  ModalButton,
  ListOfUpdates,
} from './styles';

const tierPropsLabels = {
  reserveRatio: 'Reserve Ratio',
  forcedRebalanceThreshold: 'Forced Rebalance Threshold',
  infraFee: 'Infra Fee',
  liquidityFee: 'Liquidity Fee',
  reservationFee: 'Reservation Fee',
};

export const AlterTierInfo = () => {
  const { data } = useAlterTier();
  const { hasChanges, alterTierList, id } = data ?? {};

  if (!hasChanges) {
    return null;
  }
  // modal window

  // update getConfirmationsInfo
  // update getVaultTierConfirmation to handle more useful flow
  // update apply changes flow (3 type of voting)

  return (
    <Wrapper>
      <InfoContainer>
        <TitleContainer>
          <WarningTriangle color="#EC8600" />
          <Text size="xs" strong>
            Tier {id} update available
          </Text>
        </TitleContainer>
        <ListOfUpdates>
          {!!alterTierList &&
            alterTierList.map(({ name, prev, next }) => (
              <TextStyled key={name} size="xxs">
                The {tierPropsLabels[name]} for your current tier has been
                updated ({prev} → {next}).
              </TextStyled>
            ))}
          <TextStyled size="xxs">
            Apply the new settings to take effect.
          </TextStyled>
        </ListOfUpdates>
      </InfoContainer>
      <div>
        <ModalButton size="xs" variant="outlined" color="secondary">
          Review
        </ModalButton>
      </div>
    </Wrapper>
  );
};
