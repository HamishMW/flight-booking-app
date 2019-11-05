import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { Transition } from 'react-transition-group';
import { isVisible, reflow } from 'utils/transition';
import { rgba } from 'utils/color';
import { useLocation } from 'react-router-dom';
import { AppContext } from 'app';

const navItems = [
  {
    path: '/',
    label: 'Home',
  },
  {
    path: '/boarding-pass',
    label: 'Bookings',
  },
  {
    path: '/team',
    label: 'Team',
  },
  {
    path: '/account',
    label: 'Account',
  },
];

export default function NavMenu({ visible, ...props }) {
  const { dispatch } = useContext(AppContext);
  const location = useLocation();

  const closeMenu = () => dispatch({ type: 'setMenuOpen', value: false });

  return (
    <Transition
      mountOnEnter
      unmountOnExit
      in={visible}
      timeout={600}
      onEnter={reflow}
    >
      {status =>
        <NavMenuContainer status={status} {...props}>
          <NavMenuItems>
            {navItems.map(({ path, label }) =>
              <NavMenuLink
                key={label}
                onClick={closeMenu}
                aria-current={location.pathname === path}
                to={path}
              >
                {label}
              </NavMenuLink>
            )}
          </NavMenuItems>
        </NavMenuContainer>
      }
    </Transition>
  );
}

const NavMenuContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2048;
  background: ${props => rgba(props.theme.colorSurface, 0.97)};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: transform 0.6s ${props => props.theme.curveFastoutSlowin};
  transform: ${props => isVisible(props.status) ? 'none' : 'translate3d(0, -100%, 0)'};
`;

const NavMenuItems = styled.nav`
  display: grid;
  grid-gap: 40px;
`;

const NavMenuLink = styled(Link)`
  color: ${props => props.theme.colorText};
  text-decoration: none;
  font-size: 30px;

  &[aria-current="true"] {
    color: ${props => props.theme.colorPrimaryText};
  }
`;
