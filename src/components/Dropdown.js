import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components/macro';
import { reflow, isVisible } from 'utils/transition';
import { Transition } from 'react-transition-group';
import { rgba } from 'utils/color';
import { usePrevious } from 'hooks';

export function Dropdown({ children }) {
  const [selectionIndex, setSelectionIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const prevExpanded = usePrevious(expanded);
  const dropdownButtonRef = useRef();
  const dropdownMenuRef = useRef();
  const dropdownItemsRef = useRef([]);

  useEffect(() => {
    if (expanded) {
      if (selectionIndex !== -1) {
        dropdownItemsRef.current[selectionIndex].current.focus();
      } else {
        dropdownMenuRef.current.focus();
      }
    } else if (!expanded && prevExpanded) {
      dropdownButtonRef.current.focus();
    }
  }, [expanded, prevExpanded, selectionIndex]);

  return (
    <React.Fragment>
      {React.Children.map(children, child =>
        React.cloneElement(child, {
          dropdownButtonRef,
          dropdownMenuRef,
          dropdownItemsRef,
          selectionIndex,
          setSelectionIndex,
          expanded,
          setExpanded,
        })
      )}
    </React.Fragment>
  );
}

const genId = prefix => `${prefix}-${Math.random().toString(32).substr(2, 8)}`;

export function DropdownButton({ setExpanded, setSelectionIndex, expanded, dropdownButtonRef, ...props }) {
  const buttonId = useRef(genId('button'));

  const handleClick = () => {
    if (!expanded) {
      setSelectionIndex(0);
      setExpanded(true);
    } else {
      setSelectionIndex(-1);
      setExpanded(false);
    }
  };

  const handleKeyDown = event => {
    if (event.key === 'ArrowDown') {
      event.preventDefault(); // prevent scroll
      setExpanded(true);
      setSelectionIndex(0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault(); // prevent scroll
      setExpanded(true);
      setSelectionIndex(0);
    }
  };

  return (
    <DropdownButtonElement
      id={buttonId.current}
      ref={dropdownButtonRef}
      aria-expanded={expanded}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

const focusableChildrenTypes = [DropdownMenuItem];
const isFocusableChildType = child => focusableChildrenTypes.includes(child.type);
const getFocusableMenuChildren = children => {
  if (!children.length && isFocusableChildType(children)) return [children];
  return children.filter(child => isFocusableChildType(child));
};

function DropdownContainer({
  status,
  children,
  setExpanded,
  dropdownButtonRef,
  dropdownMenuRef,
  dropdownItemsRef,
  setSelectionIndex,
  selectionIndex,
  align,
  ...props
}) {
  const buttonRectRef = useRef(dropdownButtonRef.current.getBoundingClientRect());
  const [rect, setRect] = useState();
  const [position, setPosition] = useState({ top: buttonRectRef.current.bottom + 8, left: buttonRectRef.current.left });
  const focusableChildren = getFocusableMenuChildren(children);

  useEffect(() => {
    if (dropdownMenuRef.current) {
      requestAnimationFrame(() => {
        setRect(dropdownMenuRef.current.getBoundingClientRect());
      });
    }
  }, [dropdownMenuRef]);

  useEffect(() => {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const buttonRect = buttonRectRef.current;

    if (rect) {
      requestAnimationFrame(() => {
        const top = rect.bottom >= windowHeight ? null : buttonRect.bottom + 8;
        const right = rect.right >= windowWidth || align === 'right' ? windowWidth - buttonRect.right : null;
        const bottom = rect.bottom >= windowHeight ? windowHeight - buttonRect.top + 8 : null;
        const left = rect.right >= windowWidth ? null : align === 'right' ? null : buttonRect.left;
        setPosition({ top, right, bottom, left });
      });
    }
  }, [rect, align]);

  useEffect(() => {
    const handleOuterClick = event => {
      if (dropdownButtonRef.current.contains(event.target)) return;

      if (!dropdownMenuRef.current.contains(event.target)) {
        setExpanded(false);
        setSelectionIndex(-1);
      }
    };

    document.addEventListener('click', handleOuterClick);

    return function cleanup() {
      document.removeEventListener('click', handleOuterClick);
    };
  }, [dropdownButtonRef, dropdownMenuRef, setExpanded, setSelectionIndex]);


  const handleKeyDown = event => {
    if (event.key === 'Escape') {
      setExpanded(false);
      setSelectionIndex(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault(); // prevent window scroll
      const nextIndex = selectionIndex + 1;
      if (nextIndex !== focusableChildren.length) {
        setSelectionIndex(nextIndex);
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault(); // prevent window scroll
      const nextIndex = selectionIndex - 1;
      if (nextIndex !== -1) {
        setSelectionIndex(nextIndex);
      }
    } else if (event.key === 'Tab') {
      event.preventDefault(); // prevent leaving
    }
  };

  return (
    <DropdownMenuContainer
      aria-labelledby={dropdownButtonRef.current.id}
      ref={dropdownMenuRef}
      status={status}
      position={position}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {React.Children.map(children, child => {
        if (isFocusableChildType(child)) {
          const focusIndex = focusableChildren.indexOf(child);
          const itemRef = React.createRef();
          dropdownItemsRef.current[focusIndex] = itemRef;

          return React.cloneElement(child, {
            setSelectionIndex,
            selectionIndex,
            index: focusIndex,
            itemRef: itemRef,
          });
        }

        return child;
      })}
    </DropdownMenuContainer>
  );
}

export function DropdownMenu({ expanded, children, align, ...props }) {
  return (
    <Transition mountOnEnter unmountOnExit onEnter={reflow} in={expanded} timeout={400}>
      {status => createPortal((
        <DropdownContainer status={status} align={align} {...props}>
          {children}
        </DropdownContainer>
      ), document.body)}
    </Transition>
  );
}

export function DropdownMenuItem({ index, selectionIndex, setSelectionIndex, itemRef, onClick, ...props }) {
  const selected = index === selectionIndex;

  const handleClick = () => {
    setSelectionIndex(index);
    onClick();
  };

  return (
    <DropdownMenuItemElement ref={itemRef} onClick={handleClick} selected={selected} {...props} />
  );
}

DropdownMenuItem.defaultProps = {
  onClick: () => ({}),
};

const DropdownMenuContainer = styled.div.attrs(props => ({
  role: 'menu',
  tabIndex: -1,
  style: props.position,
}))`
  position: fixed;
  transform: translate3d(0, -8px, 0);
  opacity: 0;
  transition-property: opacity, transform;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colorSurface};
  padding: 8px;
  box-shadow: 0 5px 47px 10px rgba(0,0,0,0.15), 0 10px 20px 2px rgba(0,0,0,0.10), 0 7px 8px 0 rgba(0,0,0,0.10);
  border-radius: 6px;
  min-width: 140px;
  z-index: 2048;
  box-sizing: border-box;

  ${props => isVisible(props.status) && css`
    transform: translate3d(0, 0, 0);
    opacity: 1;
  `}
`;

const DropdownButtonElement = styled.button.attrs({
  'aria-haspopup': true,
})`
  border: 0;
  margin: 0;
  padding: 0;
  font-family: inherit;
  background: none;
  cursor: pointer;
`;

const DropdownMenuItemElement = styled.button.attrs({
  role: 'menuitem',
  tabIndex: -1,
})`
  border: 0;
  margin: 0;
  padding: 0 6px;
  height: 32px;
  background: none;
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  text-align: left;
  color: ${props => rgba(props.theme.colorText, 0.7)};
  transition-property: background, box-shadow;
  transition-duration: 0.3s;
  transition-timing-function: ease;
  cursor: pointer;
  display: flex;
  align-items: center;
  text-decoration: none;

  svg:last-child {
    margin-left: auto;
  }

  &:hover,
  &:focus {
    background: ${props => rgba(props.theme.colorText, 0.1)};
  }

  &:focus {
    box-shadow: inset 0 0 0 3px ${props => rgba(props.theme.colorText, 0.2)};
    outline: none;
  }

  ${props => props.active && css`
    color: ${props => props.theme.colorPrimary};
    background: ${props => rgba(props.theme.colorPrimary, 0.1)};

    &:hover,
    &:focus {
      background: ${props => rgba(props.theme.colorPrimary, 0.2)};
    }

    &:focus {
      box-shadow: inset 0 0 0 3px ${props => rgba(props.theme.colorPrimary, 0.2)};
    }
  `}
`;
