import { useRouter } from 'next/router';
import { useAdjustment } from 'features/adjustment/contexts/adjustment-provider';
import { useVaultInfo } from 'features/overview/contexts';

import { ToggleSwitch } from 'shared/components/toggle';
import { Mint } from './mint';
import { Repay } from './repay';
import { FormBlock, PageWrapper } from './styles';

import { AdjustmentPaths, adjustmentToggleList } from './const';
import { ManifestConfigPageEnum } from 'config/external-config';

export const AdjustmentTabs = () => {
  const router = useRouter();
  const initialPath = router.query.mode as AdjustmentPaths;
  const { isMintTab } = useAdjustment();
  const { activeVault } = useVaultInfo();

  const handleToggleCb = (value: AdjustmentPaths) => {
    void router.push(
      `/${activeVault?.address}/${ManifestConfigPageEnum.adjustment}/${value}`,
    );
  };

  return (
    <PageWrapper>
      <ToggleSwitch
        options={adjustmentToggleList}
        defaultActive={initialPath}
        onToggleCb={({ value }) => handleToggleCb(value as AdjustmentPaths)}
      />
      <FormBlock>{isMintTab ? <Mint /> : <Repay />}</FormBlock>
    </PageWrapper>
  );
};
