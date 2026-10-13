import { ReactComponent as WarningTriangle } from 'assets/icons/warning-triangle.svg';

import { TitleContainer } from './styles';

export const ModalTitle = () => {
  return (
    <TitleContainer>
      <WarningTriangle color="var(--lido-color-warning)" />
      <span>Dashboard contract not belong to this stVault</span>
    </TitleContainer>
  );
};
