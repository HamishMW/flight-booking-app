import React, { useContext, useState, useLayoutEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components/macro';
import Card from 'components/Card';
import FlightSummary from 'components/FlightSummary';
import { AppContext } from 'app';
import plural from 'utils/plural';
import { ReactComponent as IconExpandMore } from 'assets/icon-expand-more.svg';
import { ReactComponent as IconArrowRightThin } from 'assets/icon-arrow-right-thin.svg';
import { ReactComponent as IconEdit } from 'assets/icon-edit.svg';
import Button from 'components/Button';
import { isVisible, reflow } from 'utils/transition';
import { formatMoney } from 'utils/currency';
import { Transition } from 'react-transition-group';
import { useHistory } from 'react-router-dom';

function BookingSummaryContent({ flights, status, passengers, ...props }) {
  const filteredFlights = flights.filter(flight => !!flight.id);
  const [rect, setRect] = useState({ height: 0 });
  const history = useHistory();
  const itemsRef = useRef();

  useLayoutEffect(() => {
    const itemsRect = itemsRef.current.getBoundingClientRect();
    setRect(itemsRect);
  }, []);

  return (
    <BookingSummaryContentContainer status={status} itemsHeight={rect.height} {...props}>
      <BookingSummaryContentItems ref={itemsRef}>
        {filteredFlights.map(({ from, to, price, id }) =>
          <BookingSummaryItem key={id}>
            <BookingSummaryItemFlight>
              <BookingSummaryItemRow singleRow>
                <BookingSummaryLocation>{from.airport}</BookingSummaryLocation>
                <IconArrowRightThin />
                <BookingSummaryLocation>{to.airport}</BookingSummaryLocation>
              </BookingSummaryItemRow>
              <BookingSummaryItemRow>
                {`${from.day} ${from.time}—${to.day} ${to.time}`}
              </BookingSummaryItemRow>
            </BookingSummaryItemFlight>
            <BookingSummaryItemPrice>{formatMoney(price * passengers)}</BookingSummaryItemPrice>
            <Button iconOnly aria-label="Edit" onClick={() => history.push('/booking/flights')}>
              <IconEdit />
            </Button>
          </BookingSummaryItem>
        )}
      </BookingSummaryContentItems>
    </BookingSummaryContentContainer>
  );
}

export default function BookingSummaryCard({ status, direction, ...props }) {
  const { bookingDetails, departureFlight, returnFlight, scrolled } = useContext(AppContext);
  const { from, to } = departureFlight;
  const { passengers, oneWay } = bookingDetails;
  const totalPrice = (departureFlight.price + (oneWay ? 0 : returnFlight.price)) * passengers;
  const [expanded, setExpanded] = useState(false);

  if (!departureFlight.id) return null;

  return (
    <BookingSummaryCardContainer
      status={status}
      transitionDirection={direction}
      expanded={expanded}
      {...props}
    >
      {expanded && <BookingSummaryCardOverlay onClick={() => setExpanded(false)} />}
      <BookingSummaryCardContent scrolled={scrolled}>
        <BookingSummaryCardElement>
          <FlightSummary
            from={from.airport}
            to={to.airport}
            fromLabel={from.city}
            toLabel={to.city}
          />
          <Transition
            mountOnEnter
            unmountOnExit
            in={expanded}
            onEnter={reflow}
            timeout={400}
          >
            {status =>
              <BookingSummaryContent
                status={status}
                flights={[departureFlight, returnFlight]}
                passengers={passengers}
              />
            }
          </Transition>
          <BookingSummaryCardDetails>
            <BookingSummaryCardPrice>
              {formatMoney(totalPrice)}
            </BookingSummaryCardPrice>
            <BookingSummaryCardText>
              {`${plural('passenger', passengers)}, ${oneWay ? 'one way' : 'roundtrip'}`}
            </BookingSummaryCardText>
            <BookingSummaryCardButton
              iconOnly
              expanded={expanded}
              aria-label="Show details"
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
            >
              <IconExpandMore />
            </BookingSummaryCardButton>
          </BookingSummaryCardDetails>
        </BookingSummaryCardElement>
      </BookingSummaryCardContent>
    </BookingSummaryCardContainer>
  );
}

const BookingSummaryCardContainer = styled.div`
  width: 100%;
  z-index: ${props => props.expanded ? 2048 : 512};
  position: relative;
  transition: transform 0.6s ${props => props.theme.curveFastoutSlowin};
  transform: ${props => isVisible(props.status) ? 'none' : `translate3d(${props.transitionDirection * 100}%, 0, 0)`};
  ${props => props.expanded && css`height: 100%;`}
`;

const BookingSummaryCardOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const BookingSummaryCardContent = styled.div`
  padding: 0 ${props => props.theme.outerMargin}px;
  position: absolute;
  top: 64px;
  right: 0;
  left: 0;
  transition: transform 0.4s ${props => props.theme.curveFastoutSlowin}, opacity 0.4s ease;

  ${props => props.scrolled && css`
    transform: translate3d(0, -64px, 0);
    opacity: 0;
  `}
`;

const BookingSummaryCardElement = styled(Card)`
  padding: 16px;
  display: grid;
  grid-template-columns: 100%;
  border-radius: ${props => props.theme.borderRadius * 2}px;
`;

const BookingSummaryCardDetails = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: 10px;
  align-items: center;
  font-size: 14px;
  margin-top: 8px;
`;

const fixFirstLetter = keyframes`
  from { padding-right: 1px; }
  to { padding-right: 0; }
`;

const BookingSummaryCardPrice = styled.div`
  font-size: 20px;
  font-weight: 600;
  display: inline-block;
  animation: ${fixFirstLetter} 0.00000001s;

  &::first-letter {
    font-size: 15px;
    font-weight: 600;
    vertical-align: top;
  }
`;

const BookingSummaryCardText = styled.div`
  flex: 1 1 auto;
  line-height: 1.2;
`;

const BookingSummaryCardButton = styled(Button)`
  margin-left: auto;

  svg {
    transition: transform 0.4s ${props => props.theme.curveFastoutSlowin};
    transform: ${props => props.expanded ? 'rotate(180deg)' : 'none'};
  }
`;

const BookingSummaryContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: ${props => isVisible(props.status) ? props.itemsHeight : 0}px;
  transition: height 0.4s ${props => props.theme.curveFastoutSlowin};
`;

const BookingSummaryContentItems = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0;
  flex: 1 0 auto;
`;

const BookingSummaryItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-top: 1px solid ${props => props.theme.colorBorder};
  
  &:last-child {
    border-bottom: 1px solid ${props => props.theme.colorBorder};
  }
`;

const BookingSummaryItemFlight = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 5px;
`;

const BookingSummaryItemRow = styled.div`
  display: flex;
  align-items: center;
  height: ${props => props.singleRow ? '1em' : 'auto'};
  font-size: 14px;
  line-height: 1.2;

  svg {
    margin: 0 6px;
  }
`;

const BookingSummaryLocation = styled.h2`
  font-size: 16px;
  margin: 0;
`;

const BookingSummaryItemPrice = styled.div`
  flex: 1 1 auto;
  text-align: right;
  margin: 0 8px;
  font-size: 24px;
  font-weight: 600;
  display: inline-block;  

  &::first-letter {
    font-size: 16px;
    font-weight: 600;
    vertical-align: top;
  }
`;
