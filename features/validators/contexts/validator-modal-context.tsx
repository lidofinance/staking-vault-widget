import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { Hex } from 'viem';
import invariant from 'tiny-invariant';

import { TopupModal, WithdrawToVaultModal } from 'features/validators/shared';

import type { ValidatorsModalItem } from 'features/validators/types';

export type ModalData = {
  currentModal: ValidatorsModalItem;
  pubKey: Hex;
  index: number;
  balance: bigint;
};

export type ValidatorModalContextValue = {
  openModal: (modal: ModalData) => void;
  closeModal: () => void;
};

const ValidatorModalContext = createContext<ValidatorModalContextValue | null>(
  null,
);

export const useValidatorModal = () => {
  const context = useContext(ValidatorModalContext);

  invariant(
    context,
    '[useValidatorModal] must be used within ValidatorModalProvider',
  );

  return context;
};

export const ValidatorModalProvider: FC<PropsWithChildren> = ({ children }) => {
  const [modalData, setCurrentModal] = useState<ModalData | null>(null);

  const openModal = useCallback((payload: ModalData) => {
    setCurrentModal(payload);
  }, []);

  const closeModal = useCallback(() => {
    setCurrentModal(null);
  }, []);

  const value = useMemo(
    () => ({ openModal, closeModal }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <ValidatorModalContext.Provider value={value}>
      {children}
      <TopupModal modalData={modalData} onCloseModal={closeModal} />
      <WithdrawToVaultModal modalData={modalData} onCloseModal={closeModal} />
    </ValidatorModalContext.Provider>
  );
};
