import user from 'data/user';

export const initialState = {
  user: user,
  theme: 'light',
  menuOpen: false,
  scrolled: false,
  departureFlight: {},
  returnFlight: {},
  passengerData: [],
  bookingDetails: {
    from: 'Sydney',
    to: 'Anywhere',
    oneWay: false,
    departureDate: null,
    returnDate: null,
    passengers: 1,
  }
};

export function reducer(state, action) {
  switch (action.type) {
    case 'setMenuOpen':
      return { ...state, menuOpen: action.value };
    case 'setBookingDetails':
      return { ...state, bookingDetails: action.value };
    case 'setDepartureFlight':
      return { ...state, departureFlight: action.value };
    case 'setReturnFlight':
      return { ...state, returnFlight: action.value };
    case 'setScrolled':
      if (action.value !== state.scrolled) {
        return { ...state, scrolled: action.value };
      }
      return state;
    case 'setPassengerData':
      const bookingDetails = { ...state.bookingDetails, passengers: action.value.length + 1 };
      return { ...state, passengerData: action.value, bookingDetails };
    case 'toggleTheme':
      const oppositeTheme = state.theme === 'light' ? 'dark' : 'light';
      return { ...state, theme: action.value !== undefined ? action.value : oppositeTheme };
    default:
      throw new Error();
  }
}
