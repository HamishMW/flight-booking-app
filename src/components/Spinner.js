import React from 'react';
import styled, { keyframes, css } from 'styled-components/macro';
import { rgba } from 'utils/color';

export default function Spinner({ primary, white, size, ...props }) {
  return (
    <SpinnerContainer primary={primary} white={white} size={size} {...props}>
      <SpinnerElement primary={primary} white={white} size={size} />
    </SpinnerContainer>
  );
}

Spinner.defaultProps = {
  size: 24,
};

const SpinnerContainer = styled.div`
  box-shadow: inset 0 0 0 2px ${props => rgba(props.theme.colorText, 0.3)};
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;

  ${props => props.white && css`
    box-shadow: inset 0 0 0 2px ${props => rgba(props.theme.colorWhite, 0.3)};
  `}

  ${props => props.primary && css`
    box-shadow: inset 0 0 0 2px ${props => rgba(props.theme.colorPrimary, 0.3)};
  `}
`;

const animSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const SpinnerElement = styled.div`
  border-top: 2px solid transparent;
  border-right: 2px solid transparent;
  border-bottom: 2px solid transparent;
  border-left: 2px solid ${props => props.theme.colorText};
  animation: ${animSpin} 1s linear infinite;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;

  ${props => props.white && css`
    border-left: 2px solid ${props => props.theme.colorWhite};
  `}

  ${props => props.primary && css`
    border-left: 2px solid ${props => props.theme.colorPrimary};
  `}
`;
