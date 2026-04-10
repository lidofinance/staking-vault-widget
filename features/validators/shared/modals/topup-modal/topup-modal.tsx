import { Modal, Input } from '@lidofinance/lido-ui';

import { useValidatorModal } from 'features/validators/contexts';
import { VALIDATOR_MODALS } from 'features/validators/const';
import { ContentContainer } from './styles';

// TODO: add text to vaultTexts
export const TopupModal = () => {
  const { currentModal, closeModal } = useValidatorModal();
  return (
    <Modal
      open={VALIDATOR_MODALS.topUpValidator === currentModal}
      onClose={closeModal}
      windowSize="md"
      title="Top up validator"
    >
      <ContentContainer>
        <section>
          You can top-up this validator by ETH available on the stVault Balance
        </section>
        <section>
          <div>Icon</div>
          <div>list</div>
        </section>
        <section>
          <span>Available to top up</span>
          <span>48.0000 ETH</span>
        </section>
        <section>
          <Input fullwidth />
        </section>
      </ContentContainer>
    </Modal>
  );
};
