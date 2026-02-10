import {
  type MouseEvent as ReactMouseEvent,
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

type UseMobileMenuResult = {
  ref: RefObject<HTMLLIElement>;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: (event?: ReactMouseEvent<HTMLButtonElement>) => void;
};

export const useMobileMenu = (): UseMobileMenuResult => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    // check outside click
    const listenClose = (event: MouseEvent) => {
      if (!isOpenRef.current) {
        return;
      }

      const isClickInside = !!ref.current?.contains(
        event.target as Node | null,
      );

      if (!isClickInside) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', listenClose);

    return () => {
      document.removeEventListener('click', listenClose);
    };
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  const toggle = useCallback((event?: ReactMouseEvent<HTMLButtonElement>) => {
    event?.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  return {
    ref,
    isOpen,
    open,
    close,
    toggle,
  };
};
