import { createContext, FC, PropsWithChildren, useContext } from 'react';
import invariant from 'tiny-invariant';

type TierInfoProps = {
  tierId: string;
};

const TierInfoContext = createContext<TierInfoProps | null>(null);
TierInfoContext.displayName = 'TierInfoContext';

export const useTierInfo = () => {
  const context = useContext(TierInfoContext);
  invariant(context, 'useTierInfo must be used within an TierInfoProvider');
  return context;
};

export const TierInfoProvider: FC<PropsWithChildren> = ({ children }) => {
  return (
    <TierInfoContext.Provider value={{ tierId: '1' }}>
      {children}
    </TierInfoContext.Provider>
  );
};
