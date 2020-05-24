import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@material-ui/core';

import getStatusColor from '../../../utils/getStatusColor';
import { User } from '../UserLayout';
import { StatusBadge } from './styles';

const { REACT_APP_API_URL } = process.env;

interface QueryProps {
  friends: User[];
}

const GET_FRIENDS = gql`
  query GET_FRIENDS {
    friends {
      id
      name
      picture
      status
    }
  }
`;

interface SubscriptionData {
  userStatus: {
    id: string;
    status: string;
  };
}

const USER_STATUS = gql`
  subscription USER_STATUS {
    userStatus {
      id
      status
    }
  }
`;

function FriendList() {
  const {
    loading, data, subscribeToMore,
  } = useQuery<QueryProps>(GET_FRIENDS, { fetchPolicy: 'network-only' });

  useEffect(() => {
    const unsubscribe = subscribeToMore<SubscriptionData>({
      document: USER_STATUS,
      updateQuery: (prev, { subscriptionData }) => {
        const { id, status } = subscriptionData.data.userStatus;
        return {
          ...prev,
          friends: prev.friends.map(
            (friend) => (friend.id === id ? { ...friend, status } : friend),
          ),
        };
      },
    });

    return () => { unsubscribe(); };
  }, [subscribeToMore]);

  if (loading || !data) return null;

  return (
    <List component="nav">
      {data.friends.map((friend) => (
        <ListItem
          button
          key={friend.id}
          component={Link}
          to={`/${friend.id}`}
        >
          <ListItemAvatar>
            <StatusBadge
              variant="dot"
              badgeContent=" "
              background={getStatusColor(friend.status)}
            >
              <Avatar src={friend.picture && `http://${REACT_APP_API_URL}/files/${friend.picture}`} />
            </StatusBadge>
          </ListItemAvatar>

          <ListItemText>
            {friend.name}
          </ListItemText>
        </ListItem>
      ))}
    </List>
  );
}

export default FriendList;
