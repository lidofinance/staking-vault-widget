import { useState, useCallback } from 'react';
import { Text } from '@lidofinance/lido-ui';

import {
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
  const { data: vaultTierInfo, isLoading } = useVaultTierInfo();
  const { data } = useAlterTier();
  const { hasChanges, alterTierList, id, tierName } = data ?? {};
  const { hasAdmin, isNodeOperator } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission('vaultConfiguration');

  const closeModal = useCallback(() => setModalVisibility(false), []);
  const openModal = useCallback(() => setModalVisibility(true), []);

  if (
    isLoading ||
    !hasChanges ||
    !(hasAdmin || isNodeOperator || hasPermission) ||
    !isNumber(id) ||
    vaultTierInfo?.proposals.extendLastProposal?.tierId === BigInt(id)
  ) {
    return null;
  }

  return (
    <>
      <Wrapper>
        <InfoContainer>
          <TitleContainer>
            <WarningTriangle color="#EC8600" />
            <Text size="xs" strong>
              {tierName} update available
            </Text>
          </TitleContainer>
          <ListOfUpdates>
            {!!alterTierList && (
              <AlterTierChanges alterTierList={alterTierList} />
            )}
            <TextStyled size="xxs">
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
          >
            Review
          </ModalButton>
        </div>
      </Wrapper>
      <AlterTierModal isOpen={showModal} closeModal={closeModal} />
    </>
  );
};
