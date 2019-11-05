import React, { Children, useRef, useState, useEffect, createRef, cloneElement } from 'react';
import styled from 'styled-components/macro';
import { rgba, tint } from 'utils/color';

export function SegmentedControlOption({ value, currentValue, childRef, ...props }) {
  return (
    <SegmentedControlOptionElement
      aria-pressed={value === currentValue}
      type="button"
      ref={childRef}
      {...props}
    >
      {value}
    </SegmentedControlOptionElement>
  );
}

export function SegmentedControl({ children, value, props }) {
  const [selectedPosition, setSelectedPosition] = useState({ width: 0, left: 0 });
  const buttonRefs = useRef([]);
  const valueRefs = useRef([]);

  useEffect(() => {
    const selectedIndex = valueRefs.current.indexOf(value);
    const currentButton = buttonRefs.current[selectedIndex];

    const rect = currentButton.current.getBoundingClientRect();
    setSelectedPosition({
      width: rect.width,
      left: currentButton.current.offsetLeft,
    });
  }, [value]);

  return (
    <SegmentedControlContainer role="group" {...props}>
      <SegmentedControlIndicator {...selectedPosition} />
      {Children.map(children, (child, index) => {
        const childRef = createRef();
        buttonRefs.current[index] = childRef;
        valueRefs.current[index] = child.props.value;

        return cloneElement(child, {
          childRef,
          currentValue: value,
          key: child.value,
        });
      })}
    </SegmentedControlContainer>
  );
}

const SegmentedControlContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 4px;
  border-radius: ${props => props.theme.borderRadius}px;
  background-color: ${props => props.theme.colorControlBackground};
`;

const SegmentedControlOptionElement = styled.button`
  flex: 1 1 auto;
  position: relative;
  margin: 0;
  padding: 0;
  border: 0;
  width: auto;
  background-color: transparent;
  appearance: none;
  height: 100%;
  transition: box-shadow 0.3s ease, background 0.3s ease;
  color: ${props => rgba(props.theme.colorTextLight, 0.6)};
  border-radius: ${props => props.theme.borderRadius / 2}px;
  font-size: 14px;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;

  &[aria-pressed="true"] {
    color: ${props => props.theme.colorText};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 4px ${props => rgba(props.theme.colorText, 0.2)};
  }
`;

const SegmentedControlIndicator = styled.div.attrs(({ left, width }) => ({
  style: {
    width,
    transform: `translate3d(${left}px, 0, 0)`,
  },
}))`
  border-radius: ${props => props.theme.borderRadius / 2}px;
  background-color: ${props => tint(props.theme.colorSurface, 0.1)};
  transition: 
    transform 0.4s ${props => props.theme.curveFastoutSlowin},
    width 0.4s ${props => props.theme.curveFastoutSlowin};
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: 0;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.12), 0px 1px 1px rgba(0, 0, 0, 0.1);
`;
