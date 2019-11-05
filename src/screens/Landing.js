import React, { useContext } from 'react';
import styled from 'styled-components/macro';
import Button from 'components/Button';
import { AppContext, AppTransitionContext } from 'app';
import { Link } from 'react-router-dom';
import { isVisible, reflow } from 'utils/transition';
import { Transition } from 'react-transition-group';
import { useScrollRestore } from 'hooks';

export default function Landing(props) {
  const { user } = useContext(AppContext);
  const { status } = useContext(AppTransitionContext);
  useScrollRestore(status);

  return (
    <LandingContainer status={status} {...props}>
      <Transition appear in={true} onEnter={reflow} timeout={600}>
        {status =>
          <LandingHeading>
            <LandingHeadingWord status={status} index={1}>
              <span>Welcome </span>
            </LandingHeadingWord>
            <LandingHeadingWord status={status} index={2}>
              <span>back, </span>
            </LandingHeadingWord>
            <LandingHeadingWord status={status} index={3}>
              <span>{user.firstName}</span>
            </LandingHeadingWord>
          </LandingHeading>
        }
      </Transition>
      <LandingButtonContainer>
        <Button large primary as={Link} to="/booking">Book a flight</Button>
      </LandingButtonContainer>
    </LandingContainer>
  );
}

const LandingContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  grid-column: 1;
  grid-row: 1;
  padding-top: 64px;
  transform: ${props => isVisible(props.status) ? 'none' : 'translate3d(-100%, 0, 0)'};
  transition: transform 0.6s ${props => props.theme.curveFastoutSlowin};
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

const LandingHeading = styled.h1`
  color: ${props => props.theme.colorWhite};
  font-size: 40px;
  font-weight: 700;
  text-align: center;
  line-height: 1.1;
  padding: ${props => props.theme.outerMargin}px;

  @media (max-width: 320px) {
    font-size: 32px;
    margin-top: 0;
    madding-top: 6px;
  }
`;

const LandingHeadingWord = styled.span`
  position: relative;
  overflow: hidden;
  display: inline-flex;

  span {
    transform: ${props => isVisible(props.status) ? 'none' : 'translate3d(0, 100%, 0)'};
    transition: transform 0.8s ${props => props.theme.curveFastoutSlowin};
    transition-delay: ${props => props.index * 0.2 + 0.4}s;
    display: inline-block;
    white-space: pre;
  }
`;

const LandingButtonContainer = styled.div`
  padding: ${props => props.theme.outerMargin + props.theme.sheetPadding}px;
  margin-top: auto;
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
`;
