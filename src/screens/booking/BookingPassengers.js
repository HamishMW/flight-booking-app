import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import Sheet, { SheetHeader, SheetTitle, SheetForm, SheetFormInputs, SheetFormActions } from 'components/Sheet';
import AutocompleteInput from 'components/AutocompleteInput';
import Button from 'components/Button';
import { useHistory } from 'react-router-dom';
import { AppContext } from 'app';
import { BookingSheetWrapper, BookingContext } from './index';
import { shareUsers } from 'data/user';
import { rgba } from 'utils/color';
import { ReactComponent as IconDelete } from 'assets/icon-delete.svg';
import { TransitionGroup, Transition } from 'react-transition-group';
import { isVisible, reflow } from 'utils/transition';
import UserListItem from 'components/UserListItem';
import { useScrollRestore } from 'hooks';

export default function BookingPayment(props) {
  const { dispatch, passengerData, user } = useContext(AppContext);
  const { status, direction, handleScroll } = useContext(BookingContext);
  const history = useHistory();
  useScrollRestore(status);

  const handleSubmit = event => {
    event.preventDefault();
    history.push('/booking/payment');
  };

  const handleChange = (value, index) => {
    const newPassengerData = [...passengerData];
    newPassengerData[index] = { ...newPassengerData[index], email: value };
    dispatch({ type: 'setPassengerData', value: newPassengerData });
  };

  const handleRemove = itemIndex => {
    const newPassengerData = passengerData.filter((item, index) => index !== itemIndex);
    dispatch({ type: 'setPassengerData', value: newPassengerData });
  };

  const addPassenger = () => {
    const newPassengerData = [...passengerData, { email: '', id: `passenger-${passengerData.length}-${new Date().getTime()}` }];
    dispatch({ type: 'setPassengerData', value: newPassengerData });
  };

  const availableUsers = shareUsers.filter(user =>
    !passengerData.find(passenger => passenger.email === user.email));

  return (
    <BookingSheetWrapper
      status={status}
      transitionDirection={direction}
      onScroll={handleScroll}
      {...props}
    >
      <Sheet>
        <SheetForm autoComplete="off" method="post" onSubmit={handleSubmit}>
          <SheetFormInputs>
            <SheetHeader>
              <SheetTitle>Invite passengers</SheetTitle>
            </SheetHeader>
            <PassengerPrimaryUser>
              <PassengerPrimaryUserEmail>{user.email}</PassengerPrimaryUserEmail>
              <PassengerPrimaryUserTag>You</PassengerPrimaryUserTag>
            </PassengerPrimaryUser>
            <TransitionGroup>
              {passengerData.map((item, index) =>
                <Transition key={item.id} timeout={400} onEnter={reflow}>
                  {status =>
                    <PassengerUser status={status}>
                      <PassengerUserContent status={status}>
                        <AutocompleteInput
                          required
                          labelHidden
                          showSuggestions
                          placeholder="name@email.com"
                          data={availableUsers}
                          matchKey="email"
                          type="email"
                          label={`Passenger ${index + 2} email`}
                          value={item.email}
                          onChange={value => handleChange(value, index)}
                          renderOption={user => <UserListItem user={user} />}
                        />
                        <PassengerDeleteButton
                          iconOnly
                          type="button"
                          aria-label="Remove passenger"
                          onClick={() => handleRemove(index)}
                        >
                          <IconDelete />
                        </PassengerDeleteButton>
                      </PassengerUserContent>
                    </PassengerUser>
                  }
                </Transition>
              )}
            </TransitionGroup>
          </SheetFormInputs>
          <SheetFormActions>
            <Button secondary large type="button" onClick={addPassenger}>Add passenger</Button>
            <Button primary large>Continue</Button>
          </SheetFormActions>
        </SheetForm>
      </Sheet>
    </BookingSheetWrapper>
  );
}

const PassengerPrimaryUser = styled.div`
  border-radius: ${props => props.theme.borderRadius}px;
  background-color: ${props => rgba(props.theme.colorText, 0.05)};
  height: 48px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const PassengerPrimaryUserEmail = styled.div`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  flex: 1 1 auto;
`;

const PassengerPrimaryUserTag = styled.span`
  text-transform: uppercase;
  letter-spacing: 0.02em;
  font-weight: 800;
  font-size: 14px;
  color: ${props => props.theme.colorTextLight};
  flex: 1 0 auto;
  text-align: right;
`;

const PassengerUser = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  height: ${props => isVisible(props.status) ? 68 : 0}px;
  transition: height 0.4s ${props => props.theme.curveFastoutSlowin};

  input {
    padding-right: 40px;
  }
`;

const PassengerUserContent = styled.div`
  transform: ${props => isVisible(props.status) ? 'none' : 'scale(0.7)'};
  opacity: ${props => isVisible(props.status) ? 1 : 0};
  transition: transform 0.4s ${props => props.theme.curveFastoutSlowin}, opacity 0.4s ease;
`;

const PassengerDeleteButton = styled(Button)`
  position: absolute;
  top: 8px;
  right: 8px;
`;
