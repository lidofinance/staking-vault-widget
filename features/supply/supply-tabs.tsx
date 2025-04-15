import { FC } from 'react';
import { useRouter } from 'next/router';
import { useVaultInfo } from 'features/overview/contexts';

import { ToggleSwitch } from 'shared/components/toggle';
import { FormBlock, PageWrapper } from './styles';
import { Fund } from './fund';
import { Withdraw } from './withdraw';

import { SupplyPaths, supplyToggleList } from './const';
import { ManifestConfigPageEnum } from 'config/external-config';

export interface SupplyTabProps {
  mode: 'fund' | 'withdraw';
}

export const SupplyTabs: FC<SupplyTabProps> = ({ mode }) => {
  const router = useRouter();
  const initialPath = router.query.mode as SupplyPaths;
  const isFundTab = mode === 'fund';
  const { activeVault } = useVaultInfo();

  const handleToggleCb = (value: SupplyPaths) => {
    void router.push(
      `/${activeVault?.address}/${ManifestConfigPageEnum.supply}/${value}`,
    );
  };

  return (
    <PageWrapper>
      <ToggleSwitch
        options={supplyToggleList}
        defaultActive={initialPath}
        onToggle={({ value }) => handleToggleCb(value as SupplyPaths)}
      />
      <FormBlock>{isFundTab ? <Fund /> : <Withdraw />}</FormBlock>
    </PageWrapper>
  );
};
