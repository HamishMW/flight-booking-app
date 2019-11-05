import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled, { css } from 'styled-components/macro';
import Calendar from 'react-calendar/dist/entry.nostyle';
import { Transition } from 'react-transition-group';
import Input from 'components/Input';
import { rgba, tint } from 'utils/color';
import { reflow, isVisible } from 'utils/transition';
import { AppContext } from 'app';
import { formatDate } from 'utils/date';
import Button from 'components/Button';
import { useViewportSize } from 'hooks';

export default function DatePicker({
  value,
  locale,
  dateLocaleOptions,
  selectRange,
  first,
  last,
  align,
  children,
  ...props
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [firstInitClick, setFirstInitClick] = useState(first && !!value[1]);
  const [lastInitClick, setLastInitClick] = useState(last);
  const [partialValue, setPartialValue] = useState();
  const { viewportRef } = useContext(AppContext);
  const viewportSize = useViewportSize();
  const containerRef = useRef();
  const inputRef = useRef();
  const calendarRef = useRef();

  const closeCalendar = useCallback(() => {
    setCalendarOpen(false);

    // Allow a single initial selection to set the value
    if ((!firstInitClick && first && !value[0] && partialValue)) {
      props.onChange([partialValue, value[1]]);
    }
  }, [first, firstInitClick, partialValue, props, value]);

  useEffect(() => {
    const handleOuterClick = (event) => {
      if (
        !containerRef.current.contains(event.target) &&
        calendarRef.current && !calendarRef.current.contains(event.target)
      ) {
        closeCalendar();
      }
    };

    const handleKeyDown = (event) => {
      if (event.code === 'Escape') {
        closeCalendar();
      }
    };

    document.addEventListener('mousedown', handleOuterClick);
    document.addEventListener('keydown', handleKeyDown);

    return function cleanup() {
      document.removeEventListener('mousedown', handleOuterClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeCalendar]);

  const handleCalendarExiting = () => {
    inputRef.current.focus();
  };

  const getValue = () => {
    const placeholder = 'dd/mm/yyyy';

    if (!value) {
      return placeholder;
    }

    if (first) {
      return value[0] ? formatDate(value[0]) : placeholder;
    }

    if (last) {
      return value[1] ? formatDate(value[1]) : placeholder;
    }

    if (Array.isArray(value)) {
      return first ? formatDate(value[0]) : formatDate(value[1]);
    }

    return formatDate(value);
  };

  const focusCalendar = () => {
    calendarRef.current.focus();
  };

  const handleRangeClick = value => {
    // By default react-calendar doesn't support intial single 
    // selection or selecting the end date first, so we keep 
    // track of that here
    if (lastInitClick) {
      setLastInitClick(false);
    }
    if (firstInitClick) {
      setFirstInitClick(false);
    } else if (first) {
      setPartialValue(value);
    }
  };

  const openCalendar = () => {
    setCalendarOpen(!calendarOpen);
    setLastInitClick(last);
    setFirstInitClick(first && !!value[1]);
  };

  return (
    <DatePickerWrapper ref={containerRef}>
      <DateInputWrapper first={first} last={last} isPlaceholder={!value}>
        <Input
          aria-haspopup
          aria-expanded={calendarOpen}
          ref={inputRef}
          onClick={openCalendar}
          type="button"
          value={getValue()}
          {...props}
        />
      </DateInputWrapper>
      <Transition
        mountOnEnter
        unmountOnExit
        in={calendarOpen}
        onEnter={reflow}
        onEntered={focusCalendar}
        timeout={500}
        onExiting={handleCalendarExiting}
      >
        {status => createPortal(
          <CalendarWrapper
            status={status}
            ref={calendarRef}
            tabIndex={-1}
          >
            <CalendarBackdrop
              status={status}
              onMouseDown={closeCalendar}
              onTouchStart={closeCalendar}
            />
            <CalendarContent status={status} viewportSize={viewportSize}>
              {children}
              <Calendar
                value={value}
                nextAriaLabel="Next"
                prevAriaLabel="Previous"
                nextLabel=""
                prevLabel=""
                minDetail="year"
                onClickDay={selectRange ? handleRangeClick : closeCalendar}
                selectRange={firstInitClick || lastInitClick ? undefined : selectRange}
                maxDate={firstInitClick ? value[1] : undefined}
                {...props}
              />
              {selectRange &&
                <CalendarActionWrapper>
                  <Button large primary onClick={closeCalendar}>Done</Button>
                </CalendarActionWrapper>
              }
            </CalendarContent>
          </CalendarWrapper>,
          viewportRef.current,
        )}
      </Transition>
    </DatePickerWrapper>
  );
}


const DatePickerWrapper = styled.div`
  position: relative;
`;

const DateInputWrapper = styled.div`
  input {
    text-align: left;
    margin: 0;
    
    ${props => props.isPlaceholder && css`
      color: ${props => props.theme.colorTextLight};
    `}

    ${props => props.first && css`
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      position: relative;

      &:focus {
        z-index: 1;
      }
    `}

    ${props => props.last && css`
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      width: calc(100% + 1px);
      position: relative;
      left: -1px;
    `}
  }
`;

const CalendarWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 4096;

  &:focus {
    outline: none;
  }
`;

const CalendarBackdrop = styled.div`
  background: ${props => rgba(props.theme.colorBlack, 0.8)};
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: ${props => isVisible(props.status) ? 1 : 0};
  transition: opacity 0.4s ease;
`;

const CalendarActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 20px;
`;

const CalendarContent = styled.div`
  transform: ${props => isVisible(props.status) ? 'none' : 'translate3d(0, 100%, 0)'};
  background: ${props => props.theme.colorSurface};
  transition: transform 0.5s ${props => props.theme.curveFastoutSlowin};
  border-radius: ${props => props.theme.borderRadius * 3}px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  box-shadow: 0px -10px 20px rgba(0, 0, 0, 0.14), 0px -20px 40px rgba(0, 0, 0, 0.12);  
  padding: 30px;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  max-height: ${props => props.viewportSize.height}px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  @media (max-width: 340px) {
    padding: 20px;
  }

  .react-calendar {
    width: 100%;
    line-height: 1.125;
    padding: 0;

    button {
      margin: 0;
      border: 0;
      outline: none;
      font-family: inherit;
      font-size: 14px;
      font-weight: 600;
      transition-property: background, box-shadow, color;
      transition-duration: 0.3s;
      transition-timing-function: ease;
      cursor: pointer;

      &:disabled {
        opacity: 0.3;
        cursor: default;
      }

      &:enabled:focus {
        box-shadow: inset 0 0 0 3px ${props => rgba(props.theme.colorText, 0.2)};
      }
    }

    &--selectRange {
      .react-calendar__tile:not(.react-calendar__tile--active):not(.react-calendar__tile--hover) + .react-calendar__tile--hover {
        border-radius: 4px 0 0 4px;
      }

      .react-calendar__tile--active + .react-calendar__tile--hover {
        border-radius: 0;
      }

      .react-calendar__tile--hover + .react-calendar__tile--hover {
        border-radius: 0;
      }

      .react-calendar__tile--hover {
        background-color: ${props => rgba(props.theme.colorPrimary, 0.1)};

        & + .react-calendar__tile:hover {
          border-radius: 0 4px 4px 0;
        }
      }
    }
  }

  .react-calendar__navigation {
    height: 44px;
    margin-bottom: 5px;

    button {
      min-width: 44px;
      background: none;
      color: ${props => props.theme.colorText};
      border-radius: 4px;

      &:disabled {
        opacity: 1;
      }

      &:enabled:hover,
      &:enabled:focus {
        background-color: ${props => rgba(props.theme.colorText, 0.1)};
      }
    }
  }

  .react-calendar__month-view {
    &__weekdays {
      text-align: center;
      text-transform: uppercase;
      font-weight: 800;
      font-size: 12px;
      color: ${props => props.theme.colorTextLight};

      &__weekday {
        padding: 0.5em;
      }

      abbr {
        text-decoration: none;
        border: 0;
      }
    }

    &__weekNumbers {
      font-weight: bold;

      .react-calendar__tile {
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75em;
        padding: calc(0.75em / 0.75) calc(0.5em / 0.75);
      }
    }

    &__days {
      &__day {
        &--neighboringMonth.react-calendar__tile {
          visibility: hidden;
        }
      }
    }
  }

  .react-calendar__year-view,
  .react-calendar__decade-view,
  .react-calendar__century-view {
    .react-calendar__tile {
      padding: 2em 0.5em;
    }
  }

  .react-calendar__navigation__next2-button,
  .react-calendar__navigation__prev2-button {
    display: none;
  }

  button.react-calendar__navigation__next-button,
  button.react-calendar__navigation__prev-button {
    width: 44px;
    color: transparent;
    position: relative;
    display: grid;
    font-size: 0;
    align-content: center;
    justify-content: center;

    &::after {
      content: '';
      border-style: solid;
      border-width: 2px 2px 0 0;
      border-color: ${props => props.theme.colorTextLight};
      display: inline-block;
      width: 16px;
      height: 16px;
      position: relative;
      left: calc(50% - 8px);
      transform: rotate(-135deg);
      vertical-align: top;
      margin-right: -4px;
      grid-column: 1;
      grid-row: 1;
      align-self: center;
      justify-self: center;
    }

    &:disabled::after {
      opacity: 0.2;
    }
  }

  button.react-calendar__navigation__next-button::after {
    transform: rotate(45deg);
    margin-left: -4px;
  }

  button.react-calendar__tile {
    max-width: 100%;
    text-align: center;
    padding: 1em 0.5em;
    margin: 0.1em 0;
    background: none;
    border-radius: ${props => props.theme.borderRadius}px;
    color: ${props => props.theme.colorText};

    &:enabled:hover,
    &:enabled:focus {
      background-color: ${props => rgba(props.theme.colorText, 0.1)};
    }

    &--hasActive.react-calendar__tile--rangeStart.react-calendar__tile--rangeEnd,
    &--hasActive.react-calendar__tile--rangeEnd:not(.react-calendar__tile--rangeStart),
    &--hasActive.react-calendar__tile--rangeStart:not(.react-calendar__tile--rangeEnd),
    &--active.react-calendar__tile--rangeStart.react-calendar__tile--rangeEnd,
    &--active.react-calendar__tile--rangeEnd:not(.react-calendar__tile--rangeStart),
    &--active.react-calendar__tile--rangeStart:not(.react-calendar__tile--rangeEnd) {
      background: ${props => props.theme.colorPrimary};
      color: white;

      &:enabled:hover,
      &:enabled:focus {
        color: white;
        background: ${props => tint(props.theme.colorPrimary, -0.1)};
      }
    }

    &--hasActive + .react-calendar__tile--hasActive,
    &--active + .react-calendar__tile--active,
    &--active:not(.react-calendar__tile--rangeStart):not(.react-calendar__tile--rangeEnd) {
      border-radius: 0;
      background: ${props => rgba(props.theme.colorPrimary, 0.2)};
      color: ${props => props.theme['color.text.body']};

      &:enabled:hover {
        background: ${props => rgba(props.theme.colorPrimary, 0.4)};
        color: ${props => props.theme.colorText};
      }
    }

    &--rangeStart {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    &--rangeStart.react-calendar__tile--rangeEnd {
      border-radius: 4px;
    }

    &--active + .react-calendar__tile--rangeEnd {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      background: ${props => props.theme.colorPrimary};
      color: white;

      &:enabled:hover {
        background: ${props => tint(props.theme.colorPrimary, -0.1)};
        color: white;
      }
    }
  }
`;
