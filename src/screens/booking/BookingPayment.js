import React, { useContext, useState } from 'react';
import Sheet, { SheetHeader, SheetTitle, SheetDescription, SheetForm, SheetFormInputs, SheetFormActions } from 'components/Sheet';
import styled, { keyframes } from 'styled-components/macro';
import Button from 'components/Button';
import { AppContext } from 'app';
import { BookingSheetWrapper, BookingContext } from './index';
import CreditCard from 'components/CreditCard';
import { formatMoney } from 'utils/currency';
import { Transition } from 'react-transition-group';
import { isVisible, reflow } from 'utils/transition';
import { Link } from 'react-router-dom';
import { ReactComponent as IconCheck } from 'assets/icon-check.svg';
import { rgba } from 'utils/color';
import particles from 'data/particles';
import { useScrollRestore } from 'hooks';

export default function BookingPayment(props) {
  const { bookingDetails, user, departureFlight, returnFlight } = useContext(AppContext);
  const [complete, setComplete] = useState(false);
  const [processing, setProcessing] = useState(false);
  const { status, direction, handleScroll } = useContext(BookingContext);
  const { passengers, oneWay } = bookingDetails;
  const totalPrice = (departureFlight.price + (oneWay ? 0 : returnFlight.price)) * passengers;
  const formattedPrice = formatMoney(totalPrice);
  useScrollRestore(status);

  const processPayment = async () => {
    const wait = () => new Promise(resolve => setTimeout(resolve, 2000));
    setProcessing(true);
    await wait();
    setProcessing(false);
    setComplete(true);
  };

  return (
    <BookingSheetWrapper
      status={status}
      transitionDirection={direction}
      onScroll={handleScroll}
      {...props}
    >
      <PaymentSheet>
        <Transition
          in={!complete}
          timeout={400}
          onEnter={reflow}
        >
          {status =>
            <PaymentSheetForm status={status} aria-hidden={!isVisible(status)}>
              <SheetHeader>
                <SheetTitle>Confirm your payment details</SheetTitle>
                <SheetDescription>Pay with card ending in {user.card.number}</SheetDescription>
              </SheetHeader>
              <SheetFormInputs gap={10} margin={30}>
                <CreditCard user={user} background="#282A42" color="white" />
              </SheetFormInputs>
              <SheetFormActions>
                <Button
                  type="button"
                  secondary
                  large
                  onClick={() => alert(`I Haven't built this yet. You probably shouldn't enter any credit card numbers into this prototype anyway 😉`)}
                >
                  Use another card
                </Button>
                <Button
                  primary
                  large
                  type="button"
                  onClick={processPayment}
                  isLoading={processing || status === 'exiting'}
                >
                  {`Pay ${formattedPrice} AUD`}
                </Button>
              </SheetFormActions>
            </PaymentSheetForm>
          }
        </Transition>
        <Transition
          mountOnEnter
          unmountOnExit
          in={complete}
          timeout={400}
          onEnter={reflow}
        >
          {status =>
            <PaymentSheetForm status={status}>
              <PaymentSuccess>
                <PaymentSuccessMessage status={status}>
                  <PaymentSuccessIconWrapper>
                    <PaymentSuccessIconParticles status={status} >
                      {particles.map((particle, index) =>
                        <PaymentSuccessIconParticle key={`${index}-${particle.x}`} {...particle} />
                      )}
                    </PaymentSuccessIconParticles>
                    <PaymentSuccessIcon status={status}>
                      <IconCheck width={48} height={48} />
                    </PaymentSuccessIcon>
                  </PaymentSuccessIconWrapper>
                  <SheetTitle>Payment successful</SheetTitle>
                  <SheetDescription>
                    {`Your ${oneWay ? 'flight is' : 'flights are'} booked and ready to go. View your boarding pass to manage seats and passengers.`}
                  </SheetDescription>
                </PaymentSuccessMessage>
                <PaymentSuccessAction status={status}>
                  <Button primary large as={Link} to="/boarding-pass">View boarding pass</Button>
                </PaymentSuccessAction>
              </PaymentSuccess>
            </PaymentSheetForm>
          }
        </Transition>
      </PaymentSheet>
    </BookingSheetWrapper>
  );
}

const PaymentSheet = styled(Sheet)`
  & > div {
    display: grid;
    grid-template-columns: 100%;
  }
`;

const PaymentSheetForm = styled(SheetForm)`
  opacity: ${props => isVisible(props.status) ? 1 : 0};
  pointer-events: ${props => isVisible(props.status) ? 'auto' : 'none'};
  transition: opacity 0.6s ease;
  grid-column: 1;
  grid-row: 1;
`;

const animIconPulse = props => keyframes`
  0% {
    box-shadow: 0 0 0 0 ${rgba(props.theme.colorSuccess, 0.4)};
  }
  50% {
    box-shadow: 0 0 0 20px ${rgba(props.theme.colorSuccess, 0.4)};
  }
  100% {
    box-shadow: 0 0 0 20px ${rgba(props.theme.colorSuccess, 0)};
  }
`;

const animIconIntro = keyframes`
  from {
    transform: translate3d(0, 50%, 0);
  }
  to {
    transform: none;
  }
`;

const PaymentSuccessIconWrapper = styled.div`
  transform: translate3d(0, 50%, 0);
  animation: ${animIconIntro} 0.6s ${props => props.theme.curveFastoutSlowin} 1.2s forwards;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PaymentSuccessIcon = styled.div`
  width: 96px;
  height: 96px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colorSuccess};
  margin-bottom: 20px;
  color: ${props => props.theme.colorWhite};
  transition: transform 0.4s ${props => props.theme.curveFastoutSlowin} 0.6s, opacity 0.4s ease 0.6s;
  transform: ${props => isVisible(props.status) ? 'none' : 'scale(0.8)'};
  opacity: ${props => isVisible(props.status) ? 1 : 0};
  animation: ${animIconPulse} 1.4s ${props => props.theme.curveFastoutSlowin} 0.6s;
`;

const animIconParticle = keyframes`
  0% {
    transform: translate3d(0, 30px, 0);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -30px, 0);
    opacity: 0;
  }
`;

const PaymentSuccessIconParticles = styled.div`
  opacity: ${props => isVisible(props.status) ? 1 : 0};
  transition: opacity 2s ease 1.5s;
`;

const PaymentSuccessIconParticle = styled.div`
  background-color: ${props => props.theme.colorSuccess};
  opacity: ${props => props.opacity};
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  position: absolute;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  border-radius: ${props => props.size / 2}px;
  animation: ${animIconParticle} 4s linear infinite;
  animation-delay: ${props => props.delay}s;
`;

const PaymentSuccess = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 0 auto;
`;

const PaymentSuccessMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;

  h1,
  p {
    transform: ${props => isVisible(props.status) ? 'none' : 'translate3d(0, -10px, 0)'};
    opacity: ${props => isVisible(props.status) ? 1 : 0};
  }

  h1 {
    transition: transform 0.6s ${props => props.theme.curveFastoutSlowin} 1.2s, opacity 0.4s ease 1.2s;
  }

  p {
    font-size: 18px;
    transition: transform 0.6s ${props => props.theme.curveFastoutSlowin} 1.4s, opacity 0.4s ease 1.4s;
  }
`;

const PaymentSuccessAction = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
  flex: 0 1 auto;
  align-self: stretch;
  transition: opacity 0.5s ease 2s;
  opacity: ${props => isVisible(props.status) ? 1 : 0};
`;
