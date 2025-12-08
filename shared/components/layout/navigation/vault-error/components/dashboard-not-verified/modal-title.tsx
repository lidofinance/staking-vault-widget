import { ReactComponent as WarningTriangle } from 'assets/icons/warning-triangle.svg';

import { TitleContainer } from './styles';

export const ModalTitle = () => {
  return (
    <TitleContainer>
      <WarningTriangle color="var(--lido-color-warning)" />
      <span>Unverified Dashboard contract detected</span>
    </TitleContainer>
  );
};
