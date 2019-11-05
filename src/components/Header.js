import React, { useContext } from 'react';
import styled, { css, ThemeContext } from 'styled-components/macro';
import { useHistory } from 'react-router-dom';
import { ReactComponent as Logo } from 'assets/logo.svg';
import { ReactComponent as LogoWordmark } from 'assets/logo-wordmark.svg';
import { ReactComponent as IconExpandMore } from 'assets/icon-expand-more.svg';
import { ReactComponent as IconArrowLeft } from 'assets/icon-arrow-left.svg';
import { ReactComponent as IconCheck } from 'assets/icon-check.svg';
import { AppContext } from 'app';
import Avatar from 'components/Avatar';
import { rgba } from 'utils/color';
import { useViewportSize } from 'hooks';
import { isVisible } from 'utils/transition';
import { Transition } from 'react-transition-group';
import { Dropdown, DropdownButton, DropdownMenu, DropdownMenuItem } from 'components/Dropdown';

function HeaderLogo({ status, open, ...props }) {
  return (
    <HeaderLogoContainer {...props}>
      <HeaderLogoSvg open={open} />
      {!isVisible(status) &&
        <HeaderLogoWordmark open={open}>
          <LogoWordmark />
        </HeaderLogoWordmark>
      }
    </HeaderLogoContainer>
  );
}

export default function Header({ status, ...props }) {
  const { user, menuOpen, dispatch, scrolled } = useContext(AppContext);
  const { id: themeId } = useContext(ThemeContext);
  const { width } = useViewportSize();
  const history = useHistory();

  const handleBack = () => {
    history.goBack();
    dispatch({ type: 'setMenuOpen', value: false });
  };

  return (
    <Transition in={menuOpen} timeout={600}>
      {open =>
        <HeaderElement scrolled={scrolled} open={open} {...props}>
          {isVisible(status) &&
            <HeaderBackButton
              aria-label="Back"
              onClick={handleBack}
              open={open}
            >
              <IconArrowLeft />
            </HeaderBackButton>
          }
          <HeaderLogoButton
            status={status}
            viewportWidth={width}
            open={open}
            aria-expanded={menuOpen}
            aria-label="Menu"
            onClick={() => dispatch({ type: 'setMenuOpen', value: !menuOpen })}
          >
            <HeaderLogo open={open} status={status} />
            <HeaderLogoExpandIcon open={open} />
          </HeaderLogoButton>
          <Dropdown>
            <DropdownButton aria-label="Profile menu" as={HeaderProfileButton}>
              <Avatar user={user} white={!isVisible(open)} />
            </DropdownButton>
            <DropdownMenu align="right">
              <DropdownMenuItem onClick={() => dispatch({ type: 'toggleTheme', value: 'light' })}>
                Light theme
                {themeId === 'light' && <IconCheck />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => dispatch({ type: 'toggleTheme', value: 'dark' })}>
                Dark theme
                {themeId === 'dark' && <IconCheck />}
              </DropdownMenuItem>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenu>
          </Dropdown>
        </HeaderElement>
      }
    </Transition>
  );
}

const HeaderElement = styled.header`
  padding: ${props => props.theme.outerMargin}px;
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: ${props => props.open !== 'exited' ? 4096 : 512};
  height: 64px;
  transition: transform 0.4s ${props => props.theme.curveFastoutSlowin};

  ${props => props.scrolled && !isVisible(props.open) && css`
    transform: translate3d(0, -100%, 0);
  `}
`;

const HeaderLogoButton = styled.button`
  display: flex;
  align-items: center;
  background-color: transparent;
  border: 0;
  margin: 0;
  padding: 0;
  border-radius: ${props => props.theme.borderRadius}px;
  position: absolute;
  left: ${props => props.theme.outerMargin - 4}px;
  padding: 4px;
  transition: background 0.3s ease, box-shadow, 0.3s ease, transform 0.4s ${props => props.theme.curveFastoutSlowin} 0.01s;
  cursor: pointer;

  &:focus {
    box-shadow: 0 0 0 4px ${props => isVisible(props.open) ? rgba(props.theme.colorText, 0.3) : rgba(props.theme.colorWhite, 0.3)};
    background-color: ${props => isVisible(props.open) ? rgba(props.theme.colorText, 0.1) : rgba(props.theme.colorWhite, 0.1)};
    outline: none;
  }

  ${props => isVisible(props.status) && css`
    transform: translate3d(calc(${props => props.viewportWidth / 2}px - 50% - ${props => props.theme.outerMargin / 2}px), 0, 0);
  `}
`;

const HeaderLogoExpandIcon = styled(IconExpandMore)`
  transition: transform 0.4s ${props => props.theme.curveFastoutSlowin}, color 0.6s ease;
  transform: ${props => isVisible(props.open) ? 'rotate(180deg)' : 'none'};
  color: ${props => rgba(isVisible(props.open) ? props.theme.colorText : props.theme.colorWhite, 0.6)};
  margin-left: 4px;
`;

const HeaderLogoContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const HeaderLogoSvg = styled(Logo)`
  transition: fill 0.4s ease;
  fill: ${props => props.theme.colorWhite};

  ${props => props.theme.id === 'light' && css`
    fill: ${isVisible(props.open) ? props.theme.colorPrimary : props.theme.colorWhite};
  `}
`;

const HeaderLogoWordmark = styled.div`
  transition: color 0.6s ease;
  color: ${props => props.theme.colorWhite};
  margin-left: 4px;

  ${props => props.theme.id === 'light' && css`
    color: ${isVisible(props.open) ? props.theme.colorPrimaryDark : props.theme.colorWhite};
  `}
`;

const HeaderBackButton = styled.button`
  background-color: transparent;
  border: 0;
  margin: 0;
  padding: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  transition: background 0.3s ease, box-shadow 0.3s ease, color 0.6s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => isVisible(props.open) ? rgba(props.theme.colorText, 0.6) : rgba(props.theme.colorWhite, 0.8)};
  
  &:focus {
    box-shadow: 0 0 0 4px ${props => isVisible(props.open) ? rgba(props.theme.colorText, 0.3) : rgba(props.theme.colorWhite, 0.3)};
    background-color: ${props => isVisible(props.open) ? rgba(props.theme.colorText, 0.1) : rgba(props.theme.colorWhite, 0.1)};
    outline: none;
  }
`;

const HeaderProfileButton = styled.button`
  background-color: transparent;
  border: 0;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  transition: background 0.3s ease, box-shadow 0.3s ease, color 0.6s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => isVisible(props.open) ? rgba(props.theme.colorText, 0.6) : rgba(props.theme.colorWhite, 0.8)};
  margin-left: auto;

  &:focus {
    box-shadow: 0 0 0 4px ${props => isVisible(props.open) ? rgba(props.theme.colorPrimary, 0.3) : rgba(props.theme.colorWhite, 0.3)};
    outline: none;
  }
`;
