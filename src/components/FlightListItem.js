import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { rgba } from 'utils/color';
import FlightSummary from 'components/FlightSummary';
import Button from 'components/Button';
import { ReactComponent as IconCheck } from 'assets/icon-check.svg';
import { ReactComponent as IconDelete } from 'assets/icon-delete.svg';
import plural from 'utils/plural';
import { formatMoney } from 'utils/currency';

export default function FlightListItem({ from, to, price, stops, selected, id, passengers, ...props }) {
  return (
    <FlightListItemContainer
      aria-pressed={!!selected}
      {...props}
    >
      <FlightSummary
        from={from.airport}
        to={to.airport}
        fromLabel={`${from.day}, ${from.time}`}
        toLabel={`${to.day}, ${to.time}`}
        centerLabel={stops ? plural('stop', stops) : 'Direct'}
      />
      <FlightListItemRow>
        <FlightListItemPrice>
          {formatMoney(price * passengers)}
        </FlightListItemPrice>
        <FlightListItemAction>
          {!selected && <Button as="div" secondary>Select</Button>}
          {selected && <Button iconOnly as="div" aria-label="Remove flight"><IconDelete /></Button>}
        </FlightListItemAction>
      </FlightListItemRow>
      {selected &&
        <FlightListItemCheck>
          <IconCheck />
        </FlightListItemCheck>
      }
    </FlightListItemContainer>
  );
}

FlightListItem.defaultProps = {
  passengers: 1,
};

const FlightListItemContainer = styled.button`
  position: relative;
  background-color: ${props => rgba(props.theme.colorText, 0.05)};
  border-radius: ${props => props.theme.borderRadius}px;
  padding: 16px;
  height: 120px;
  appearance: none;
  border: 0;
  margin: 0;
  color: ${props => props.theme.colorText};
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: space-between;
  transition: box-shadow 0.3s ease, background 0.3s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 3px ${props => rgba(props.theme.colorText, 0.1)};
  }

  &[aria-pressed="true"] {
    background-color: ${props => rgba(props.theme.colorPrimary, 0.2)};
    box-shadow: inset 0 0 0 2px ${props => props.theme.colorPrimary};

    &:focus {
      outline: none;
      box-shadow: 
        inset 0 0 0 2px ${props => props.theme.colorPrimary},
        0 0 0 3px ${props => rgba(props.theme.colorPrimary, 0.3)};
    }
  }
`;

const FlightListItemRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FlightListItemPrice = styled.div`
  font-size: 24px;
  font-weight: 600;
  display: inline-block;  

  &::first-letter {
    font-size: 16px;
    font-weight: 600;
    vertical-align: top;
  }
`;

const animCheck = keyframes`
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
`;

const FlightListItemCheck = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.theme.colorPrimary};
  color: ${props => props.theme.colorWhite};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: -6px;
  right: -6px;
  opacity: 0;
  animation: ${animCheck} 0.4s ${props => props.theme.curveFastoutSlowin} 0.4s forwards;
`;

const FlightListItemAction = styled.div`

`;
