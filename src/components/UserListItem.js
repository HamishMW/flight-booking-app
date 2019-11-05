import React from 'react';
import styled from 'styled-components/macro';
import Avatar from 'components/Avatar';

export default function UserListItem({ user, children, ...props }) {
  const { firstName, lastName, email } = user;
  const hasName = firstName && lastName;

  return (
    <UserListItemContainer {...props}>
      <UserListItemAvatar user={user} />
      {hasName && <UserListItemName>{`${firstName} ${lastName}`}</UserListItemName>}
      <UserListItemEmail onlyEmail={!hasName}>{email}</UserListItemEmail>
      {children &&
        <UserListItemContent>
          {children}
        </UserListItemContent>
      }
    </UserListItemContainer>
  );
}

const UserListItemContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-column-gap: 8px;
  align-items: center;
  font-size: 14px;
`;

const UserListItemAvatar = styled(Avatar)`
  grid-column: 1;
  grid-row: 1 / span 2;
`;

const UserListItemName = styled.div`
  grid-column: 2;
  grid-row: 1;
  font-weight: 500;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const UserListItemEmail = styled.div`
  grid-column: 2;
  grid-row: ${props => props.onlyEmail ? '1 / span 2' : 2};
  color: ${props => props.theme.colorTextLight};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

const UserListItemContent = styled.div`
  grid-column: 3;
  grid-row: 1 / span 2;
`;
