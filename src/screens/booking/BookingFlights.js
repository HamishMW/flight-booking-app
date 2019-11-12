import React, { useContext, useRef, Fragment } from 'react';
import styled from 'styled-components/macro';
import Sheet, { SheetHeader, SheetTitle, SheetForm, SheetFormInputs, SheetFormActions } from 'components/Sheet';
import Button from 'components/Button';
import { useHistory } from 'react-router-dom';
import { AppContext } from 'app';
import { BookingSheetWrapper, BookingContext } from './index';
import { isVisible, reflow } from 'utils/transition';
import FlightListItem from 'components/FlightListItem';
import flightData from 'data/flights';
import { TransitionGroup, Transition } from 'react-transition-group';
import gsap from 'gsap';
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { formatMoney } from 'utils/currency';
import { formatDateShort } from 'utils/date';
import { useScrollRestore } from 'hooks';
import locationData from 'data/locations';

gsap.registerPlugin(ScrollToPlugin);

export default function BookingFlights(props) {
  const { bookingDetails, departureFlight, returnFlight, dispatch } = useContext(AppContext);
  const { status, direction, handleScroll } = useContext(BookingContext);
  const { from, to, passengers, departureDate, returnDate, oneWay } = bookingDetails;
  const history = useHistory();
  const wrapperRef = useRef();
  const nextRoute = passengers > 1 ? '/booking/passengers' : '/booking/payment';
  const totalPrice = (departureFlight.price + (oneWay ? 0 : returnFlight.price)) * passengers;
  const formattedPrice = formatMoney(totalPrice);
  useScrollRestore(status);

  const formatData = (data, isReturn) => data.map(flight => {
    const fromCity = isReturn ? to : from;
    const toCity = isReturn ? from : to;
    const dayMs = 86400000;
    const flightDate = isReturn ? returnDate : departureDate;
    const toDate = isReturn ? new Date(new Date(flightDate).getTime() + (dayMs * 2)) : flightDate;
    const fromLocation = locationData.find(location => location.city === fromCity);
    const toLocation = locationData.find(location => location.city === toCity);

    return {
      ...flight,
      from: {
        ...flight.from,
        ...fromLocation,
        day: formatDateShort(flightDate),
      },
      to: {
        ...flight.to,
        ...toLocation,
        day: formatDateShort(toDate),
      },
    };
  });

  const filterFlights = (data, match) => data.filter(flight => {
    if (match.id) {
      return flight.id === match.id;
    }

    return true;
  });

  const departuresData = formatData(flightData.departures);
  const returnsData = formatData(flightData.returns, true);
  const departures = filterFlights(departuresData, departureFlight);
  const returns = filterFlights(returnsData, returnFlight);

  const handleFlightSelect = (flight, type, match) => {
    dispatch({ type, value: flight.id === match.id ? {} : flight });
    gsap.to(wrapperRef.current, 0.4, { scrollTo: 0, ease: 'power2.out' });
  };

  const handleSubmit = event => {
    event.preventDefault();
    history.push(nextRoute);
  };

  return (
    <BookingSheetWrapper
      status={status}
      transitionDirection={direction}
      onScroll={handleScroll}
      ref={wrapperRef}
      {...props}
    >
      <Sheet>
        <FlightSheetForm onSubmit={handleSubmit} method="post">
          <SheetFormInputs gap={0}>
            <Transition
              mountOnEnter
              unmountOnExit
              timeout={400}
              in={!departureFlight.id}
              onEnter={reflow}
            >
              {status =>
                <FlightSheetHeader status={status}>
                  <SheetTitle>Select a departure flight</SheetTitle>
                </FlightSheetHeader>
              }
            </Transition>
            <FlightList>
              <TransitionGroup component={Fragment}>
                {departures.map(flight =>
                  <Transition key={flight.id} timeout={400} onEnter={reflow}>
                    {status =>
                      <FlightListItemWrapper status={status}>
                        <FlightListItem
                          type="button"
                          selected={flight.id === departureFlight.id}
                          passengers={passengers}
                          onClick={() => handleFlightSelect(flight, 'setDepartureFlight', departureFlight)}
                          {...flight}
                        />
                      </FlightListItemWrapper>
                    }
                  </Transition>
                )}
              </TransitionGroup>
            </FlightList>

            <Transition
              mountOnEnter
              unmountOnExit
              timeout={400}
              in={departureFlight.id && !returnFlight.id && !oneWay}
              onEnter={reflow}
            >
              {status =>
                <FlightSheetHeader status={status}>
                  <SheetTitle>Select a return flight</SheetTitle>
                </FlightSheetHeader>
              }
            </Transition>
            <FlightList>
              <TransitionGroup component={Fragment}>
                {departureFlight.id && !oneWay && returns.map(flight =>
                  <Transition key={flight.id} timeout={400} onEnter={reflow}>
                    {status =>
                      <FlightListItemWrapper status={status}>
                        <FlightListItem
                          type="button"
                          selected={flight.id === returnFlight.id}
                          passengers={passengers}
                          onClick={() => handleFlightSelect(flight, 'setReturnFlight', returnFlight)}
                          {...flight}
                        />
                      </FlightListItemWrapper>
                    }
                  </Transition>
                )}
              </TransitionGroup>
            </FlightList>
          </SheetFormInputs>

          {departureFlight.id && (oneWay || returnFlight.id) &&
            <FlightSheetFormActions>
              <SheetTitle>{`Total price: ${formattedPrice}`}</SheetTitle>
              <Button primary large>
                Continue
              </Button>
            </FlightSheetFormActions>
          }
        </FlightSheetForm>
      </Sheet>
    </BookingSheetWrapper >
  );
}

const FlightListItemWrapper = styled.div`
  width: 100%;
  height: ${props => isVisible(props.status) ? 140 : 0}px;
  transition: height 0.4s ${props => props.theme.curveFastoutSlowin};
  overflow: ${props => props.status === 'entered' ? 'visible' : 'hidden'};
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const FlightList = styled.div``;

const FlightSheetHeader = styled(SheetHeader)`
  height: ${props => isVisible(props.status) ? 50 : 0}px;
  transition: height 0.4s ${props => props.theme.curveFastoutSlowin};
  overflow: hidden;
  padding: 0;

  h1 {
    padding-top: 6px;
  }
`;

const FlightSheetForm = styled(SheetForm)`
  padding-bottom: 0;
`;

const FlightSheetFormActions = styled(SheetFormActions)`
  padding-bottom: 20px;
`;
