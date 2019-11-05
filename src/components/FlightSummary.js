import React from 'react';
import styled, { css } from 'styled-components/macro';
import { ReactComponent as IconFlight } from 'assets/icon-flight.svg';
import { rgba } from 'utils/color';

export default function FlightSummary({ from, to, centerLabel, size, fromLabel, toLabel, ...props }) {
  return (
    <FlightSummaryContainer size={size} {...props}>
      <FlightSummaryRow>
        <FlightSummaryAirport size={size}>{from}</FlightSummaryAirport>
        <FlightSummaryPlane><IconFlight /></FlightSummaryPlane>
        <FlightSummaryAirport size={size}>{to}</FlightSummaryAirport>
      </FlightSummaryRow>
      <FlightSummaryRow>
        <FlightSummaryLabel>{fromLabel}</FlightSummaryLabel>
        <FlightSummaryLabel center>{centerLabel}</FlightSummaryLabel>
        <FlightSummaryLabel>{toLabel}</FlightSummaryLabel>
      </FlightSummaryRow>
    </FlightSummaryContainer>
  );
}

const FlightSummaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 14px;

  ${props => (props.size === 'large' || props.size === 'medium') && css`
    font-size: 16px;
  `}
`;

const FlightSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const FlightSummaryAirport = styled.div`
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 0.04em;

  ${props => props.size === 'medium' && css`
    font-size: 20px;
  `}

  ${props => props.size === 'large' && css`
    font-size: 28px;
  `}
`;

const FlightSummaryLabel = styled.div`
  font-size: 14px;
  flex: ${props => props.center ? '1 0 auto' : '1 1 40%'};
  text-align: ${props => props.center ? 'center' : 'left'};
  margin: ${props => props.center ? '0 10px' : 0};
  line-height: 1.1;

  &:last-child {
    text-align: right;
  }
`;

const FlightSummaryPlane = styled.div`
  color: ${props => rgba(props.theme.colorText, 0.6)};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
  padding: 0 10px;

  svg {
    flex: 0 0 auto;
  }

  &::before,
  &::after {
    content: '';
    display: block;
    border-bottom: 1px dashed ${props => rgba(props.theme.colorText, 0.2)};
    width: 100%;
    height: 1px;
    margin: 0 10px;
  }
`;
