import React, { useContext } from 'react';
import styled, { css } from 'styled-components/macro';
import { useHistory } from 'react-router-dom';
import { AppContext } from 'app';
import plural from 'utils/plural';
import { formatDateShort } from 'utils/date';
import Button from 'components/Button';
import { isVisible } from 'utils/transition';
import Card from 'components/Card';

function BookingSearchDetails({ status, direction, ...props }) {
  const { bookingDetails, scrolled } = useContext(AppContext);
  const { departureDate, returnDate, from, to, oneWay, passengers } = bookingDetails;
  const history = useHistory();
  const bookingSearchOptions = `${formatDateShort(departureDate)}${oneWay ? ''
    : `—${formatDateShort(returnDate)}`}, ${plural('passenger', passengers)}`;

  return (
    <BookingSearchDetailsContainer
      scrolled={scrolled}
      status={status}
      transitionDirection={direction}
      {...props}
    >
      <BookingSearchCard>
        <BookingSearchDestination>{`${from}—${to}`}</BookingSearchDestination>
        <BookingSearchOptions>{bookingSearchOptions}</BookingSearchOptions>
        <BookingSearchAction>
          <Button flat onClick={() => history.goBack()}>Edit</Button>
        </BookingSearchAction>
      </BookingSearchCard>
    </BookingSearchDetailsContainer>
  );
}

const BookingSearchDetailsContainer = styled.div`
  transform: ${props => isVisible(props.status) ? 'none' : `translate3d(${props.transitionDirection * 100}%, 0, 0)`};
  transition: transform 0.6s ${props => props.theme.curveFastoutSlowin};
  width: 100%;
  padding: 0 ${props => props.theme.outerMargin}px;
  position: absolute;
  top: 64px;
  z-index: 2048;

  ${props => props.scrolled && css`
    transform: translate3d(0, ${-64 + props.theme.outerMargin}px, 0);
  `}

  ${props => props.scrolled && !isVisible(props.status) && css`
    transform: translate3d(${props.transitionDirection * 100}%, ${-64 + props.theme.outerMargin}px, 0);
  `}
`;

const BookingSearchCard = styled(Card)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const BookingSearchDestination = styled.div`
  font-size: 16px;
`;

const BookingSearchOptions = styled.div`
  font-size: 14px;
`;

const BookingSearchAction = styled.div`
  position: absolute;
  right: 16px;
`;

export default BookingSearchDetails;
