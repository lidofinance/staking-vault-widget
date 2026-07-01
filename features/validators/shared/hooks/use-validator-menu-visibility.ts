import { useCallback, useRef, useState } from 'react';

export const useValidatorMenuVisibility = () => {
  const [popupVisible, setPopupVisibility] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  const openPopup = useCallback(() => setPopupVisibility(true), []);
  const closePopup = useCallback(() => setPopupVisibility(false), []);

  return {
    popupVisible,
    ref,
    openPopup,
    closePopup,
  };
};
