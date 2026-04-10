import {
  ValidatorModalProvider,
  ValidatorsTableProvider,
} from 'features/validators/contexts';
import {
  Container,
  TopupModal,
  ValidatorsTable,
  WithdrawToVaultModal,
} from 'features/validators/shared';

export const Validators = () => {
  return (
    <Container>
      <ValidatorsTableProvider>
        <ValidatorModalProvider>
          <ValidatorsTable />
          <TopupModal />
          <WithdrawToVaultModal />
        </ValidatorModalProvider>
      </ValidatorsTableProvider>
    </Container>
  );
};
