import React, { useState, useEffect, MouseEvent } from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Menu, MenuItem } from '@material-ui/core';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import Picture from './Picture';
import getStatusColor from '../../../utils/getStatusColor';

import {
  Container, Info, Name, StyledButton, StyledBagde,
} from './styles';

const GET_USER = gql`
  query GET_USER {
    currentUser {
      id
      name
      picture
      status
    }
  }
`;

const SET_STATUS = gql`
  mutation SET_STATUS($status: String!) {
    setUserStatus(status: $status)
  }
`;

const USER_STATUS = gql`
  subscription USER_STATUS {
    userStatus {
      id
      status
    }
  }
`;

export interface User {
  id: string;
  name: string;
  picture: string;
  status: string;
}

interface SubscriptionData {
  userStatus: {
    id: string;
    status: string;
  };
}

interface QueryProps {
  currentUser: User;
}

function UserLayout() {
  const [anchorStatus, setAnchorStatus] = useState<null | HTMLElement>(null);
  const [setStatus] = useMutation(SET_STATUS);
  const {
    data,
    loading,
    refetch,
    subscribeToMore,
  } = useQuery<QueryProps>(GET_USER, { fetchPolicy: 'network-only' });

  useEffect(() => {
    const unsubscribe = subscribeToMore<SubscriptionData>({
      document: USER_STATUS,
      updateQuery: (prev, { subscriptionData }) => {
        const { id, status } = subscriptionData.data.userStatus;

        if (prev.currentUser.id !== id) { return prev; }

        return {
          currentUser: {
            ...prev.currentUser,
            status,
          },
        };
      },
    });

    return () => { unsubscribe(); };
  }, [subscribeToMore]);

  function handleMenu(event: MouseEvent<HTMLButtonElement>) {
    setAnchorStatus(event.currentTarget);
  }

  async function handleStatus(status: string) {
    await setStatus({ variables: { status } });
    // await refetch();
    setAnchorStatus(null);
  }

  if (loading || !data) return null;
  const { currentUser } = data;

  return (
    <Container px={3} py={1}>
      <StyledBagde
        badgeContent=" "
        background={getStatusColor(currentUser.status)}
      >
        <Picture
          src={currentUser.picture}
          reload={() => refetch()}
        />
      </StyledBagde>

      <Info>
        <Name>{currentUser.name}</Name>
        <div>
          <StyledButton
            size="small"
            endIcon={<ArrowDownIcon />}
            onClick={handleMenu}
          >
            {currentUser.status.toLowerCase()}
          </StyledButton>
          <Menu
            keepMounted
            anchorEl={anchorStatus}
            open={!!anchorStatus}
            onClose={() => setAnchorStatus(null)}
          >
            <MenuItem onClick={() => handleStatus('ONLINE')}>Online</MenuItem>
            <MenuItem onClick={() => handleStatus('ABSENT')}>Absent</MenuItem>
            <MenuItem onClick={() => handleStatus('OFFLINE')}>Offline</MenuItem>
          </Menu>
        </div>
      </Info>
    </Container>
  );
}

export default UserLayout;
