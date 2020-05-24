import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
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
  Add as AddIcon,
  Close as CloseIcon,
} from '@material-ui/icons';

import { SearchUser } from '.';

const { REACT_APP_API_URL } = process.env;

const ADD_FRIEND = gql`
  mutation ADD_FRIEND($userId: String!) {
    friendRequest(userId: $userId)
  }
`;

const REMOVE_FRIEND_REQUEST = gql`
  mutation REMOVE_FRIEND($requestId: String!) {
    rejectFriendRequest(requestId: $requestId)
  }
`;

interface Props {
  users: SearchUser[];
  reload(): void;
}

function UserList({ users, reload }: Props) {
  const [addFriend, { loading: addLoading }] = useMutation(ADD_FRIEND);
  const [
    removeFriendRequest,
    { loading: removeLoading },
  ] = useMutation(REMOVE_FRIEND_REQUEST);

  async function handleAdd(userId: string) {
    await addFriend({ variables: { userId } });
    reload();
  }

  async function handleRemove(requestId: string) {
    await removeFriendRequest({ variables: { requestId } });
    reload();
  }

  return (
    <List>
      {users.map((user) => (
        <ListItem key={user.id}>
          <ListItemAvatar>
            <Avatar src={user.picture && `http://${REACT_APP_API_URL}/files/${user.picture}`} />
          </ListItemAvatar>

          <ListItemText>{user.name}</ListItemText>

          {!user.isFriends && (
            <ListItemSecondaryAction>
              {!user.requestId
                ? (
                  <IconButton
                    aria-label="add friend"
                    size="small"
                    color="primary"
                    disabled={addLoading}
                    onClick={() => handleAdd(user.id)}
                  >
                    <AddIcon />
                  </IconButton>
                )
                : (
                  <IconButton
                    title="Remove friend request"
                    aria-label="remove friend request"
                    size="small"
                    disabled={removeLoading}
                    onClick={() => handleRemove(user.requestId)}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  );
}

export default UserList;
