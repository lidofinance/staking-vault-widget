import { VaultOverviewProvider } from 'features/overview/contexts';
import { OverviewContent } from './components';

export const OverviewPage = () => {
  return (
    <VaultOverviewProvider>
      <OverviewContent />
    </VaultOverviewProvider>
  );
};
