import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
} from '@material-ui/core';
import {
  Check as CheckIcon,
  Close as CloseIcon,
} from '@material-ui/icons';

import { User } from '../UserLayout';

const { REACT_APP_API_URL } = process.env;

interface FriendRequest {
  id: string;
  from: User;
}

interface QueryProps {
  friendRequests: FriendRequest[];
}

const GET_FRIEND_REQUESTS = gql`
  query GET_FRIENDS {
    friendRequests {
      id
      from {
        name
        picture
      }
    }
  }
`;

const ACCEPT_REQUEST = gql`
  mutation ACCEPT_REQUEST($requestId: String!) {
    acceptFriendRequest(requestId: $requestId)
  }
`;

const REJECT_REQUEST = gql`
  mutation REJECT_REQUEST($requestId: String!) {
    rejectFriendRequest(requestId: $requestId)
  }
`;

function FriendRequests() {
  const { loading, data, refetch } = useQuery<QueryProps>(GET_FRIEND_REQUESTS, {
    fetchPolicy: 'no-cache',
  });
  const [acceptRequest] = useMutation(ACCEPT_REQUEST);
  const [rejectRequest] = useMutation(REJECT_REQUEST);

  async function handleAccept(requestId: string) {
    await acceptRequest({ variables: { requestId } });
    await refetch();
  }

  async function handleReject(requestId: string) {
    await rejectRequest({ variables: { requestId } });
    await refetch();
  }

  if (loading || !data) return null;

  return (
    <List>
      {data.friendRequests.map(({ id, from }) => (
        <ListItem key={id}>
          <ListItemAvatar>
            <Avatar src={from.picture && `http://${REACT_APP_API_URL}/files/${from.picture}`} />
          </ListItemAvatar>

          <ListItemText>{from.name}</ListItemText>

          <ListItemSecondaryAction>
            <IconButton
              aria-label="accept"
              size="small"
              color="primary"
              onClick={() => handleAccept(id)}
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              aria-label="reject"
              size="small"
              onClick={() => handleReject(id)}
            >
              <CloseIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      ))}
    </List>
  );
}

export default FriendRequests;
