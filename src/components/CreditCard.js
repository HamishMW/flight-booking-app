import React from 'react';
import styled, { keyframes } from 'styled-components/macro';
import { tint } from 'utils/color';
import { ReactComponent as LogoRfid } from 'assets/logo-rfid.svg';
import { ReactComponent as LogoVisa } from 'assets/logo-visa.svg';

export default function CreditCard({ user, color, ...props }) {
  const { firstName, lastName, card } = user;
  const { number, expiry } = card;

  return (
    <CreditCardContainer color={color} {...props}>
      <CreditCardRow>
        <LogoRfid />
        <LogoVisa />
      </CreditCardRow>
      <CreditCardRow>
        <CreditCardNumber>
          <CreditCardNumberObfuscated>····</CreditCardNumberObfuscated>
          <CreditCardNumberObfuscated>····</CreditCardNumberObfuscated>
          <CreditCardNumberObfuscated>····</CreditCardNumberObfuscated>
          <CreditCardNumberDigits>{number}</CreditCardNumberDigits>
        </CreditCardNumber>
      </CreditCardRow>
      <CreditCardRow>
        <CreditCardDetail>{`${firstName} ${lastName}`}</CreditCardDetail>
        <CreditCardDetail>{expiry}</CreditCardDetail>
      </CreditCardRow>
    </CreditCardContainer>
  );
}

const animCard = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
`;

const CreditCardContainer = styled.div`
  border-radius: 12px;
  background-color: ${props => props.background || tint(props.theme.colorText, -0.65)};
  color: ${props => props.color || props.theme.colorText};
  box-shadow: 0px 12px 34px rgba(0, 0, 0, 0.17), 0px 1px 12px rgba(0, 0, 0, 0.12);
  animation: ${animCard} 0.8s ${props => props.theme.curveFastoutSlowin} 0.4s forwards;
  opacity: 0;
  padding: 30px;
  display: grid;
  grid-gap: 30px;
  position: relative;
  z-index: 1;
`;

const CreditCardRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CreditCardNumber = styled.div`
  font-size: 20px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  flex: 1 0 auto;
`;

const CreditCardNumberObfuscated = styled.span`
  letter-spacing: 0.32em;
`;

const CreditCardNumberDigits = styled.span``;

const CreditCardDetail = styled.div`
  font-size: 14px;
  font-weight: 600;
`;
