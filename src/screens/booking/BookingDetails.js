import React, { useContext, useState } from 'react';
import styled, { css } from 'styled-components/macro';
import Sheet, { SheetForm, SheetTitle, SheetFormInputs, SheetFormActions } from 'components/Sheet';
import Input from 'components/Input';
import AutocompleteInput from 'components/AutocompleteInput';
import DatePicker from 'components/DatePicker';
import Button from 'components/Button';
import { useHistory } from 'react-router-dom';
import { AppContext } from 'app';
import { BookingContext, BookingSheetWrapper } from '.';
import locationData from 'data/locations';
import plural from 'utils/plural';
import { rgba } from 'utils/color';
import { SegmentedControl, SegmentedControlOption } from 'components/SegmentedControl';
import { ReactComponent as IconLocation } from 'assets/icon-location.svg';
import { ReactComponent as IconFlight } from 'assets/icon-flight.svg';

export default function BookingDetails(props) {
  const { bookingDetails, dispatch } = useContext(AppContext);
  const { status, direction, handleScroll } = useContext(BookingContext);
  const { from, to, passengers, departureDate, returnDate, oneWay } = bookingDetails;
  const [errors, setErrors] = useState([]);
  const history = useHistory();
  const [fromValue, setFromValue] = useState(from);
  const [toValue, setToValue] = useState(to);

  const maxPassengers = 16;
  const maxPassengersArray = [];
  for (let i = 0; i < maxPassengers; i++) {
    maxPassengersArray.push({
      value: i + 1,
      text: plural('passenger', i + 1),
    });
  }

  const handleChange = (value, key) => {
    const newErrors = errors.filter(error => error !== key);
    setErrors(newErrors);

    dispatch({
      type: 'setBookingDetails',
      value: { ...bookingDetails, [key]: value },
    });
  };

  const handleSubmit = () => {
    const errorList = [];

    if (!departureDate) {
      errorList.push('departureDate');
    }

    if (!returnDate && !oneWay) {
      errorList.push('returnDate');
    }

    if (!from) {
      errorList.push('from');
    }

    setErrors(errorList);

    if (errorList.length) return;
    history.push('/booking/flights');

    const passengerArray = [];
    for (let i = 0; i < passengers - 1; i++) {
      passengerArray.push({
        email: '',
        id: `passenger-${i}-${new Date().getTime()}`,
      });
    }

    dispatch({ type: 'setPassengerData', value: passengerArray });
  };

  const handleDateChange = (value, order) => {
    const newErrors = errors.filter(error => error !== 'departureDate' && error !== 'returnDate');
    setErrors(newErrors);

    if (oneWay) {
      dispatch({
        type: 'setBookingDetails',
        value: { ...bookingDetails, departureDate: value },
      });
    } else if (order === 'last') {
      const rangeValue = value[1] ? value : [departureDate, value];
      dispatch({
        type: 'setBookingDetails',
        value: { ...bookingDetails, departureDate: rangeValue[0], returnDate: rangeValue[1] },
      });
    } else if (order === 'first') {
      const rangeValue = value[0] ? value : [value, returnDate];
      dispatch({
        type: 'setBookingDetails',
        value: { ...bookingDetails, departureDate: rangeValue[0], returnDate: rangeValue[1] },
      });
    }
  };

  return (
    <BookingSheetWrapper
      status={status}
      transitionDirection={direction}
      offset={140}
      onScroll={handleScroll}
      {...props}
    >
      <BookingDetailsLocation>
        <BookingDetailsLocationIcon isFrom>
          <IconLocation />
        </BookingDetailsLocationIcon>
        <BookingDetailsLocationIcon>
          <IconFlight />
        </BookingDetailsLocationIcon>
        <BookingDetailsInput
          showSuggestions
          label="From"
          spellCheck={false}
          matchKey="city"
          data={locationData}
          value={fromValue}
          error={errors.includes('from') && 'Please enter a location'}
          onSelect={value => handleChange(value, 'from')}
          onChange={value => setFromValue(value)}
        />
        <BookingDetailsInput
          showSuggestions
          label="To"
          spellCheck={false}
          matchKey="city"
          data={locationData}
          value={toValue === 'Anywhere' ? '' : toValue}
          placeholder="Anywhere"
          onSelect={value => handleChange(value, 'to')}
          onChange={value => setToValue(value)}
        />
      </BookingDetailsLocation>
      <Sheet shrinkable>
        <SheetForm autoComplete="off" method="post">
          <SheetFormInputs>
            <SegmentedControl value={oneWay ? 'One way' : 'Roundtrip'}>
              <SegmentedControlOption value="Roundtrip" onClick={() => handleChange(false, 'oneWay')} />
              <SegmentedControlOption value="One way" onClick={() => handleChange(true, 'oneWay')} />
            </SegmentedControl>
            <BookingDetailsInputGroup grouped={!oneWay}>
              <DatePicker
                first={!oneWay}
                required
                readOnly
                label="Departure"
                selectRange={!oneWay}
                value={oneWay ? departureDate : [departureDate, returnDate]}
                error={errors.includes('departureDate') && 'Select a date'}
                onChange={value => handleDateChange(value, oneWay ? null : 'first')}
                minDate={new Date()}
              >
                <DetailsDateTitle>
                  <SheetTitle>
                    {oneWay ? 'Select a departure date' : 'Select a departure & return date'}
                  </SheetTitle>
                </DetailsDateTitle>
              </DatePicker>
              {!oneWay &&
                <DatePicker
                  last
                  required
                  readOnly
                  selectRange
                  label="Return"
                  align="right"
                  value={[departureDate, returnDate]}
                  error={errors.includes('returnDate') && 'Select a date'}
                  onChange={value => handleDateChange(value, 'last')}
                  activeStartDate={departureDate || new Date()}
                  minDate={departureDate || new Date()}
                >
                  <DetailsDateTitle>
                    <SheetTitle>Select a departure & return date</SheetTitle>
                  </DetailsDateTitle>
                </DatePicker>
              }
            </BookingDetailsInputGroup>
            <Input
              label="Passengers"
              as="select"
              value={passengers}
              onChange={event => handleChange(event.target.value, 'passengers')}
            >
              {maxPassengersArray.map(({ value, text }) =>
                <option key={value} value={value}>{text}</option>
              )}
            </Input>
          </SheetFormInputs>
          <SheetFormActions>
            <Button primary large type="button" onClick={handleSubmit}>
              Continue
            </Button>
          </SheetFormActions>
        </SheetForm>
      </Sheet>
    </BookingSheetWrapper>
  );
}

const BookingDetailsInputGroup = styled.div`
  display: grid;
  grid-template-columns: ${props => props.grouped ? '1fr 1fr' : '100%'};
`;

const BookingDetailsLocation = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 20px 10px;
  margin-bottom: 30px;
  grid-template-columns: 24px 1fr;
  padding-right: ${props => props.theme.sheetPadding}px;

  @media (max-width: 320px) {
    padding-right: 16px;
  }
`;

const BookingDetailsLocationIcon = styled.div`
  grid-column: 1;
  grid-row: ${props => props.isFrom ? 1 : 2};
  color: ${props => props.theme.colorWhite};
  display: flex;
  flex-direction: column;
  align-items: center;

  ${props => props.isFrom && css`
    &::after {
      content: '';
      height: 100%;
      border-left: 2px dashed ${props => rgba(props.theme.colorWhite, 0.5)};
      flex: 1 1 auto;
      position: relative;
      top: 6px;
    }
  `}

  svg {
    position: relative;
    top: -3px;
    flex: 0 0 auto;
  }
`;

const BookingDetailsInput = styled(AutocompleteInput)`
  grid-column: 2;

  label {
    color: ${props => props.theme.colorWhite};
    text-shadow: 0 0 2px ${props => props.theme.colorPrimary};
  }

  input {
    box-shadow: none;
    background: ${props => props.theme.id === 'light'
    ? rgba(props.theme.colorBlack, 0.2)
    : rgba(props.theme.colorBlack, 0.4)};
    color: ${props => props.theme.colorWhite};
    font-size: 32px;
    height: 60px;
    padding-bottom: 2px;
    min-width: 0;

    &:focus {
      box-shadow: inset 0 0 0 2px ${props => props.theme.colorWhite};
    }

    &::placeholder {
      color: ${props => rgba(props.theme.colorWhite, 0.6)};
    }
  }

  [data-input-error] {
    color: ${props => props.theme.colorWhite};
  }
`;

const DetailsDateTitle = styled.div`
  margin-bottom: 20px;

  @media (max-width: 340px) {
    margin-bottom: 10px;
  }
`;
