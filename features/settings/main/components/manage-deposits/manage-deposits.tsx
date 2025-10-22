import { Text, Divider } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';
import { useVaultConfirmingRoles } from 'modules/vaults';
import { InputToggle } from 'shared/hook-form/controls';
import { vaultTexts } from 'modules/vaults';

import { useDepositorRolesPermissions } from 'features/settings/main/hooks';

import { ManageDepositsWrapper, TextWrapper } from './styles';

const text = vaultTexts.actions.settings.fields.isDepositAllowed;

export const ManageDeposits = () => {
  const { isDappActive } = useDappStatus();
  const { hasAdmin } = useVaultConfirmingRoles();
  const { showForPauserRole, showForResumerRole } =
    useDepositorRolesPermissions();

  if (!isDappActive || !(hasAdmin || showForPauserRole || showForResumerRole)) {
    return null;
  }

  return (
    <>
      <ManageDepositsWrapper>
        <TextWrapper>
          <Text size="xs" strong>
            {text.title}
          </Text>
          <Text size="xxs" color="secondary">
            {text.hint}
          </Text>
        </TextWrapper>
        <InputToggle
          name="isDepositAllowed"
          textPosition="left"
          textOn={text.allowed}
          textOff={text.paused}
          showText
        />
      </ManageDepositsWrapper>
      <Divider />
    </>
  );
};
