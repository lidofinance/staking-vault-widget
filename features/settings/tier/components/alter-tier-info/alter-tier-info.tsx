import { useState, useCallback } from 'react';
import { Text } from '@lidofinance/lido-ui';

import {
  useVault,
  useVaultConfirmingRoles,
  useVaultPermission,
  useVaultTierInfo,
} from 'modules/vaults';
import { ReactComponent as WarningTriangle } from 'assets/icons/warning-triangle.svg';
import { isNumber } from 'utils';

import { useAlterTier } from 'features/settings/tier/hooks';
import {
  AlterTierChanges,
  AlterTierModal,
} from 'features/settings/tier/shared';

import {
  InfoContainer,
  TitleContainer,
  Wrapper,
  TextStyled,
  ModalButton,
  ListOfUpdates,
} from './styles';

export const AlterTierInfo = () => {
  const [showModal, setModalVisibility] = useState(false);
  const { activeVault } = useVault();
  const { data: vaultTierInfo, isLoading } = useVaultTierInfo();
  const { data } = useAlterTier();
  const { hasChanges, alterTierList, id, tierName } = data ?? {};
  const { hasAdmin, isNodeOperator } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission('vaultConfiguration');

  const closeModal = useCallback(() => setModalVisibility(false), []);
  const openModal = useCallback(() => setModalVisibility(true), []);
  const extendLastProposal = vaultTierInfo?.proposals.extendLastProposal;
  if (
    isLoading ||
    !hasChanges ||
    !(hasAdmin || isNodeOperator || hasPermission) ||
    !isNumber(id) ||
    activeVault?.isPendingConnect ||
    (extendLastProposal?.tierId === BigInt(id) &&
      extendLastProposal.functionName === 'syncTier')
  ) {
    return null;
  }

  return (
    <>
      <Wrapper data-testid="syncTier-banner">
        <InfoContainer>
          <TitleContainer>
            <WarningTriangle color="#EC8600" />
            <Text size="xs" strong data-testid="syncTier-banner-title">
              {tierName} update available
            </Text>
          </TitleContainer>
          <ListOfUpdates data-testid="syncTier-banner-listOfUpdates">
            {!!alterTierList && (
              <AlterTierChanges
                alterTierList={alterTierList}
                dataTestId="syncTier-banner"
              />
            )}
            <TextStyled
              size="xxs"
              data-testid="syncTier-banner-applyChanges-text"
            >
              Apply the new settings to take effect.
            </TextStyled>
          </ListOfUpdates>
        </InfoContainer>
        <div>
          <ModalButton
            size="xs"
            variant="outlined"
            color="secondary"
            onClick={openModal}
            data-testid="syncTier-banner-reviewSubmitButton"
          >
            Review
          </ModalButton>
        </div>
      </Wrapper>
      <AlterTierModal isOpen={showModal} closeModal={closeModal} />
    </>
  );
};
