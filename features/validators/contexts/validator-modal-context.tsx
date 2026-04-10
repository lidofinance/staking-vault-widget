import {
  createContext,
  type FC,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import invariant from 'tiny-invariant';

import { useVault } from 'modules/vaults';

import type { ValidatorsModalItem } from 'features/validators/types';

type ValidatorModalContextValue = {
  currentModal: ValidatorsModalItem | null;
  openModal: (modal: ValidatorsModalItem) => void;
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
  const { vaultAddress } = useVault();
  const [currentModal, setCurrentModal] = useState<ValidatorsModalItem | null>(
    null,
  );

  const openModal = useCallback(
    (modal: ValidatorsModalItem) => {
      if (!vaultAddress) return;
      setCurrentModal(modal);
    },
    [vaultAddress],
  );

  const closeModal = useCallback(() => {
    if (!vaultAddress) return;
    setCurrentModal(null);
  }, [vaultAddress]);

  const value = useMemo(
    () => ({ currentModal, openModal, closeModal }),
    [closeModal, currentModal, openModal],
  );

  return (
    <ValidatorModalContext.Provider value={value}>
      {children}
    </ValidatorModalContext.Provider>
  );
};
