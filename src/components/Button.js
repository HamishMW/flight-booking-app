import React from 'react';
import styled, { css } from 'styled-components/macro';
import { rgba, tint } from 'utils/color';
import { Link } from 'react-router-dom';
import Spinner from 'components/Spinner';
import { Transition } from 'react-transition-group';
import { isVisible, reflow } from 'utils/transition';

export default function Button({ children, as, isLoading, ...props }) {
  return (
    <ButtonElement
      tabIndex={0}
      as={as === Link ? ButtonLink : as}
      disabled={isLoading}
      isLoading={isLoading}
      {...props}
    >
      <Transition
        mountOnEnter
        unmountOnExit
        timeout={400}
        in={!isLoading}
        onEnter={reflow}
      >
        {status =>
          <ButtonText status={status}>{children}</ButtonText>
        }
      </Transition>
      <Transition
        mountOnEnter
        unmountOnExit
        timeout={400}
        in={isLoading}
        onEnter={reflow}
      >
        {status =>
          <ButtonLoader aria-label="Loading" status={status}>
            <Spinner white />
          </ButtonLoader>
        }
      </Transition>
    </ButtonElement>
  );
}

const ButtonLink = ({ primary, large, flat, isLoading, iconOnly, ...rest }) => <Link {...rest} />;

const primaryStyle = css`
  background-color: ${props => props.theme.colorPrimary};
  color: ${props => props.theme.colorWhite};

  &:hover,
  &:active {
    background-color: ${props => tint(props.theme.colorPrimary, -0.1)};
  }

  &:focus {
    box-shadow: 0 0 0 4px ${props => rgba(props.theme.colorPrimary, 0.4)};
  }
`;

const secondaryStyle = css`
  background-color: ${props => rgba(props.theme.colorPrimaryText, 0.2)};
  color: ${props => props.theme.colorPrimaryText};

  &:hover,
  &:active {
    background-color: ${props => rgba(props.theme.colorPrimaryText, 0.3)};
  }

  &:focus {
    box-shadow: 0 0 0 4px ${props => rgba(props.theme.colorPrimaryText, 0.5)};
  }
`;

const flatStyle = css`
  background-color: ${props => props.theme.colorSurface};
  color: ${props => props.theme.colorPrimaryText};

  &:hover,
  &:active {
    background-color: ${props => rgba(props.theme.colorPrimaryText, 0.2)};
  }

  &:focus {
    box-shadow: 0 0 0 4px ${props => rgba(props.theme.colorPrimaryText, 0.4)};
  }
`;

const whiteStyle = css`
  background-color: ${props => rgba(props.theme.colorWhite, 0.2)};
  color: ${props => props.theme.colorWhite};

  &:hover,
  &:active {
    background-color: ${props => rgba(props.theme.colorWhite, 0.3)};
  }

  &:focus {
    box-shadow: 0 0 0 4px ${props => rgba(props.theme.colorWhite, 0.4)};
  }
`;

const ButtonElement = styled.button`
  border-radius: ${props => props.rounded ? 128 : props.theme.borderRadius}px;
  color: ${props => props.theme.colorText};
  background-color: transparent;
  margin: 0;
  border: 0;
  padding: ${props => props.iconOnly ? 0 : '0 10px'};
  height: ${props => props.large ? 48 : 32}px;
  font-size: ${props => props.large ? 18 : 14}px;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition-property: background, box-shadow;
  transition-timing-function: ease;
  transition-duration: 0.3s;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  &:hover,
  &:active {
    background-color: ${props => rgba(props.theme.colorText, 0.1)};
  }

  &:focus {
    box-shadow: 0 0 0 4px ${props => rgba(props.theme.colorText, 0.2)};
    outline: none;
  }

  ${props => props.iconOnly && css`
    width: ${props.large ? 48 : 32}px;
  `}

  ${props => props.primary && primaryStyle}
  ${props => props.flat && flatStyle}
  ${props => props.secondary && secondaryStyle}
  ${props => props.white && whiteStyle}
`;

const ButtonText = styled.span`
  transform: ${props => isVisible(props.status) ? 'none' : 'translate3d(0, -100%, 0)'};
  transition: transform 0.4s ${props => props.theme.curveFastoutSlowin}, opacity 0.4s ease;
  opacity: ${props => isVisible(props.status) ? 1 : 0};
`;

const ButtonLoader = styled.div`
  position: absolute;
  transform: ${props => isVisible(props.status) ? 'none' : 'translate3d(0, 100%, 0)'};
  transition: transform 0.4s ${props => props.theme.curveFastoutSlowin};
`;
