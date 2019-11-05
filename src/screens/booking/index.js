import React, { useContext, Fragment, cloneElement, createContext } from 'react';
import styled, { css } from 'styled-components/macro';
import { AppTransitionContext, AppContext } from 'app';
import { isVisible, getDirection, reflow } from 'utils/transition';
import { Switch, Route, useLocation, useRouteMatch } from 'react-router-dom';
import { TransitionGroup, Transition } from 'react-transition-group';
import BookingDetails from './BookingDetails';
import BookingFlights from './BookingFlights';
import BookingPassengers from './BookingPassengers';
import BookingPayment from './BookingPayment';
import { usePrevious } from 'hooks';
import BookingSummaryCard from './BookingSummaryCard';
import BookingSearchDetails from './BookingSearchDetails';

const routes = [
  {
    exact: true,
    path: '/booking',
    component: BookingDetails,
  },
  {
    path: '/booking/flights',
    component: BookingFlights,
  },
  {
    path: '/booking/passengers',
    component: BookingPassengers,
  },
  {
    path: '/booking/payment',
    component: BookingPayment,
  },
];

export const BookingContext = createContext();

export default function Booking(props) {
  const { dispatch } = useContext(AppContext);
  const { status } = useContext(AppTransitionContext);
  const location = useLocation();
  const match = useRouteMatch();
  const { step } = match.params;
  const index = routes.indexOf(routes.find(route => route.path === location.pathname));
  const prevIndex = usePrevious(index);
  const parentDirection = location.pathname === '/booking' ? 1 : -1;
  const showSummary = step === 'passengers' || step === 'payment';
  const showSearchDetails = step === 'flights';

  const handleScroll = event => {
    dispatch({ type: 'setScrolled', value: event.target.scrollTop > 20 });
  };

  return (
    <BookingContainer status={status} transitionDirection={parentDirection} {...props}>
      <TransitionGroup
        component={Fragment}
        childFactory={child => cloneElement(child, {
          direction: getDirection(child, index, prevIndex),
        })}
      >
        {showSearchDetails &&
          <Transition timeout={600} onEnter={reflow}>
            {(status, { direction }) =>
              <BookingSearchDetails status={status} direction={direction} />
            }
          </Transition>
        }
      </TransitionGroup>
      <Transition
        mountOnEnter
        unmountOnExit
        timeout={600}
        onEnter={reflow}
        in={showSummary}
      >
        {status =>
          <BookingSummaryCard status={status} direction={1} />
        }
      </Transition>
      <TransitionGroup
        component={Fragment}
        childFactory={child => cloneElement(child, {
          direction: getDirection(child, index, prevIndex),
        })}
      >
        <Transition
          timeout={600}
          key={location.pathname}
          onEnter={reflow}
        >
          {(status, { direction }) =>
            <BookingContext.Provider value={{ status, direction, handleScroll }}>
              <Switch location={location}>
                {routes.map(route =>
                  <Route key={route.path} {...route} />
                )}
              </Switch>
            </BookingContext.Provider>
          }
        </Transition>
      </TransitionGroup>
    </BookingContainer>
  );
}

const BookingContainer = styled.div`
  grid-column: 1;
  grid-row: 1;
  position: relative;
  transform: ${props => isVisible(props.status)
    ? 'none'
    : `translate3d(${props.transitionDirection * 100}%, 0, 0)`};
  transition: transform 0.6s ${props => props.theme.curveFastoutSlowin};
  pointer-events: ${props => props.status !== 'entered' ? 'none' : 'auto'};
`;

export const BookingSheetWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: ${props => props.theme.outerMargin}px;
  display: flex;
  flex-direction: column;
  padding-top: ${props => props.offset || 190}px;
  flex: 1 0 auto;
  transition: transform 0.6s ${props => props.theme.curveFastoutSlowin};
  transform: translate3d(${props => props.transitionDirection * 100}%, 0, 0);

  ${props => isVisible(props.status) && css`
    transform: translate3d(0, 0, 0);
  `}
`;
