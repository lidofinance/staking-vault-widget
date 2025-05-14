import styled from 'styled-components';

export const BackdropContainer = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: color-mix(in display-p3, #000 80%, transparent);
  backdrop-filter: blur(2px);
`;
