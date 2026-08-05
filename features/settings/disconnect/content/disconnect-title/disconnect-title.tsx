import { vaultTexts } from 'modules/vaults';
import { InlineLoader, StatusBadge } from 'shared/components';

import { DISCONNECT_STATUS } from 'features/settings/shared/const';
import { useDisconnectStatus } from 'features/settings/shared/hooks';

import { BadgeWrapper, TitleContainer, TitleHeading } from './styles';

const { settingsTitle } = vaultTexts.actions.disconnect;

export const DisconnectTitle = () => {
  const { status, isLoading } = useDisconnectStatus();
  const isDisconnectInitiated =
    !!status && status !== DISCONNECT_STATUS.NOT_INITIATED;
  const badgeStatus =
    status === DISCONNECT_STATUS.COMPLETED ? 'completed' : 'ongoing';

  return (
    <TitleContainer data-testid="disconnect-header">
      <TitleHeading data-testid="title">{settingsTitle}</TitleHeading>
      <BadgeWrapper data-testid="status-badge">
        <InlineLoader isLoading={isLoading} height={32} width={124}>
          {isDisconnectInitiated && <StatusBadge status={badgeStatus} />}
        </InlineLoader>
      </BadgeWrapper>
    </TitleContainer>
  );
};
