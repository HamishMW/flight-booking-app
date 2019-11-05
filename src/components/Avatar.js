import React from 'react';
import styled from 'styled-components/macro';
import { rgba } from 'utils/color';

export default function Avatar({ user, ...props }) {
  const { firstName, lastName, email } = user;
  const initials = firstName && lastName ? `${firstName[0]}${lastName[0]}` : email[0];

  return (
    <AvatarContainer {...props}>
      <AvatarInitials>{initials}</AvatarInitials>
    </AvatarContainer>
  );
}

Avatar.defaultProps = {
  size: 36,
  white: false,
};

const AvatarContainer = styled.div`
  border-radius: ${props => props.size / 2}px;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  color: ${props => props.white
    ? props.theme.colorWhite
    : props.theme.colorPrimary};
  background-color: ${props => props.white
    ? rgba(props.theme.colorWhite, 0.2)
    : rgba(props.theme.colorPrimary, 0.2)};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: color 0.4s ease, background 0.4s ease;
`;

const AvatarInitials = styled.div`
  font-size: 14px;
  font-weight: 800;
  text-transform: uppercase;
  line-height: 1;
  letter-spacing: 0.05em;
`;
