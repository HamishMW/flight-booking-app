import React, { useContext, useEffect, lazy, Suspense, Fragment } from 'react';
import styled from 'styled-components/macro';
import Sheet, { SheetHeader, SheetTitle, SheetForm, SheetFormInputs } from 'components/Sheet';
import { AppContext, AppTransitionContext } from 'app';
import { isVisible } from 'utils/transition';
import FlightSummary from 'components/FlightSummary';
import { useHistory } from 'react-router-dom';
import { ReactComponent as QRCode } from 'assets/qr-code.svg';
import { ReactComponent as IconBag } from 'assets/icon-bag.svg';
import { ReactComponent as PlaneType } from 'assets/plane-type.svg';
import { ReactComponent as IconCheck } from 'assets/icon-check.svg';
import { rgba } from 'utils/color';
import Button from 'components/Button';
import UserListItem from 'components/UserListItem';
import { shareUsers } from 'data/user';
import { useScrollRestore } from 'hooks';

const Plane = lazy(() => import('components/Plane'));

export default function BoardingPass(props) {
  const { departureFlight, passengerData, dispatch } = useContext(AppContext);
  const history = useHistory();
  const { status } = useContext(AppTransitionContext);
  const { from, to } = departureFlight;
  useScrollRestore(status);

  const matchedPassengerData = passengerData.map(passenger => {
    const match = shareUsers.find(user => user.email === passenger.email);
    return match || passenger;
  });

  const handleScroll = event => {
    dispatch({ type: 'setScrolled', value: event.target.scrollTop > 20 });
  };

  useEffect(() => {
    if (!departureFlight.id) {
      history.push('/');
    };
  }, [departureFlight.id, history]);

  if (!departureFlight.id) return null;

  return (
    <BoardingPassContainer status={status} {...props}>
      <BoardingPassSheetWrapper onScroll={handleScroll}>
        <BoardingPassPlane>
          {(status === 'entered' || status === 'exiting') &&
            <Suspense fallback={<Fragment />}>
              <Plane />
            </Suspense>
          }
        </BoardingPassPlane>
        <BoardingPassPlaneDetails>
          <PlaneType />
          <BoardingPassPlaneSeat>
            <span>Seat 42B</span>
            <Button white>Change</Button>
          </BoardingPassPlaneSeat>
        </BoardingPassPlaneDetails>
        <Sheet shrinkable>
          <SheetForm>
            <SheetFormInputs gap={30}>
              <SheetHeader>
                <SheetTitle>Boarding pass</SheetTitle>
              </SheetHeader>
              <FlightSummary
                size="large"
                from={from.airport}
                to={to.airport}
                fromLabel={`${from.day}, ${from.time}`}
                toLabel={`${to.day}, ${to.time}`}
                centerLabel="12hrs"
              />
              <BoardingPassRow>
                <BoardingPassDetails>
                  <BoardingPassDetail>
                    <BoaringPassDetailValue>127</BoaringPassDetailValue>
                    <BoaringPassDetailLabel>Gate</BoaringPassDetailLabel>
                  </BoardingPassDetail>
                  <BoardingPassDetail>
                    <BoaringPassDetailValue>10:00</BoaringPassDetailValue>
                    <BoaringPassDetailLabel>Boarding</BoaringPassDetailLabel>
                  </BoardingPassDetail>
                  <BoardingPassDetail>
                    <BoaringPassDetailValue>42B</BoaringPassDetailValue>
                    <BoaringPassDetailLabel>Seat</BoaringPassDetailLabel>
                  </BoardingPassDetail>
                  <BoardingPassDetail>
                    <BoaringPassDetailValue>BL256</BoaringPassDetailValue>
                    <BoaringPassDetailLabel>Flight</BoaringPassDetailLabel>
                  </BoardingPassDetail>
                </BoardingPassDetails>
                <BoardingPassCode>
                  <QRCode />
                </BoardingPassCode>
              </BoardingPassRow>
              <BoardingPassRow>
                <BoardingPassBags>
                  <IconBag />
                  1 checked bag, 1 carry on
                  <Button flat type="button">Add bags</Button>
                </BoardingPassBags>
              </BoardingPassRow>
            </SheetFormInputs>
          </SheetForm>
        </Sheet>
        {!!passengerData.length &&
          <Sheet shrinkable style={{ marginTop: 14 }}>
            <SheetForm>
              <SheetFormInputs>
                <BoardingPassPassengers>
                  {matchedPassengerData.map((passenger, index) =>
                    <UserListItem key={passenger.email} user={passenger}>
                      {index < 2 &&
                        <BoardingPassPassengerStatus>
                          <IconCheck />
                          {index === 0 ? '47C' : '62A'}
                        </BoardingPassPassengerStatus>
                      }
                      {index >= 2 &&
                        <BoardingPassPassengerStatus>Pending</BoardingPassPassengerStatus>
                      }
                    </UserListItem>
                  )}
                </BoardingPassPassengers>
              </SheetFormInputs>
            </SheetForm>
          </Sheet>
        }
      </BoardingPassSheetWrapper>
    </BoardingPassContainer>
  );
}

const BoardingPassContainer = styled.div`
  display: flex;
  flex-direction: column;
  grid-column: 1;
  grid-row: 1;
  padding-top: 64px;
  transform: ${props => isVisible(props.status) ? 'none' : 'translate3d(100%, 0, 0)'};
  transition: transform 0.6s ${props => props.theme.curveFastoutSlowin};
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
`;

const BoardingPassSheetWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  transform: translate3d(0, 0, 0);
  padding: ${props => props.theme.outerMargin}px;
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  padding-top: 300px;
`;

const BoardingPassPlane = styled.div`
  flex: 1 0 300px;
  overflow: visible;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
`;

const BoardingPassPlaneDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${props => rgba(props.theme.colorWhite, 0.7)};
  position: absolute;
  right: ${props => props.theme.outerMargin}px;
  left: ${props => props.theme.outerMargin}px;
  transform: translate3d(0, -100%, 0);
  padding-bottom: 16px;

  svg {
    color: ${props => rgba(props.theme.colorWhite, 0.6)};
    width: 100px;
    height: auto;
  }
`;

const BoardingPassPlaneSeat = styled.div`
  display: grid;
  align-items: center;
  grid-gap: 8px;
  grid-template-columns: 1fr 1fr;
`;

const BoardingPassRow = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
`;

const BoardingPassDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  grid-row-gap: 20px;
  flex: 1 1 auto;
`;

const BoardingPassDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

const BoaringPassDetailValue = styled.div`
  font-size: 20px;
  font-weight: 600;
  line-height: 1.1;
  margin: 0;
`;

const BoaringPassDetailLabel = styled.div`
  font-size: 14px;
  line-height: 1.1;
`;

const BoardingPassCode = styled.div`
  background-color: ${props => rgba(props.theme.colorText, 0.05)};
  color: ${props => rgba(props.theme.colorText, 0.8)};
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius}px;
  margin-left: auto;
`;

const BoardingPassBags = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  font-size: 14px;
  line-height: 1.1;

  button {
    margin-left: auto;
    flex: 0 0 auto;
  }

  svg {
    margin-right: 4px;
  }
`;

const BoardingPassPassengers = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 16px;
`;

const BoardingPassPassengerStatus = styled.div`
  font-weight: 600;
  display: flex;
  align-items: center;
`;
