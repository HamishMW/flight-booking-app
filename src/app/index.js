import React, { createContext, useReducer, useRef, Fragment, lazy, Suspense } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components/macro';
import { reducer, initialState } from './reducer';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { TransitionGroup, Transition } from 'react-transition-group';
import themes from './theme';
import Header from 'components/Header';
import Landing from 'screens/Landing';
import Booking from 'screens/booking';
import BoardingPass from 'screens/BoardingPass';
import { reflow } from 'utils/transition';
import { rgba } from 'utils/color';
import NavMenu from 'components/NavMenu';

const Globe = lazy(() => import('components/Globe'));

export const AppContext = createContext();
export const AppTransitionContext = createContext();

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { menuOpen, theme } = state;
  const viewportRef = useRef();
  const currentTheme = themes[theme];

  return (
    <AppContext.Provider value={{ ...state, dispatch, viewportRef }}>
      <ThemeProvider theme={currentTheme}>
        <GlobalStyle />
        <Router>
          <Route render={({ location }) =>
            <AppContainer>
              <AppViewport ref={viewportRef}>
                <Transition
                  mountOnEnter
                  unmountOnExit
                  in={location.pathname.includes('booking') || location.pathname === '/'}
                  onEnter={reflow}
                  timeout={400}
                >
                  {status =>
                    <Suspense fallback={<Fragment />}>
                      <Globe key={currentTheme.id} status={status} collapsed={location.pathname.includes('/booking')} />
                      <AppBackgroundScrim visible={location.pathname.includes('/booking')} />
                    </Suspense>
                  }
                </Transition>
                <Transition in={location.pathname.includes('booking')} timeout={400}>
                  {status => <Header status={status} />}
                </Transition>
                <TransitionGroup component={Fragment}>
                  <Transition
                    timeout={600}
                    key={location.pathname.split('/')[1]}
                    onEnter={reflow}
                  >
                    {status =>
                      <AppTransitionContext.Provider value={{ status }}>
                        <Suspense fallback={<Fragment />}>
                          <Switch location={location}>
                            <Route exact path="/" component={Landing} />
                            <Route exact path={['/booking', '/booking/:step']} component={Booking} />
                            <Route path="/boarding-pass" component={BoardingPass} />
                          </Switch>
                        </Suspense>
                      </AppTransitionContext.Provider>
                    }
                  </Transition>
                </TransitionGroup>
                <NavMenu visible={menuOpen} />
              </AppViewport>
            </AppContainer>
          } />
        </Router>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: ${props => props.theme.fontStack};
    color: ${props => props.theme.colorText};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow: hidden;
    background: #f2f2f2;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  button,
  input {
    font-family: inherit;
  }

  svg {
    display: block;
  }
`;

const AppContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  z-index: 0;
`;

const AppViewport = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: 100%;
  position: relative;
  max-width: 375px;
  max-height: 719px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: auto;
  border-radius: 32px;
  transform: translate3d(0, 0, 0);
  background: linear-gradient(
    ${props => props.theme.gradientColors[0]}, 
    ${props => props.theme.gradientColors[1]}
  );

  @media (max-width: ${props => props.theme.mobile}px) {
    max-width: 100%;
    max-height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    border-radius: 0;
  }
`;

const AppBackgroundScrim = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: ${props => props.visible ? 1 : 0};
  pointer-events: none;
  transition: opacity 0.4s ease;
  background: linear-gradient(
    ${props => rgba(props.theme.gradientColors[0], 0)} 0%, 
    ${props => rgba(props.theme.gradientColors[0], 0.4)} 20%, 
    ${props => props.theme.gradientColors[1]} 80%
  );
`;

export default App;
