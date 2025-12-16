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
  animation: wrapper-loader 0.15s ease-out 0.25s 1 both;

  @keyframes wrapper-loader {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;
