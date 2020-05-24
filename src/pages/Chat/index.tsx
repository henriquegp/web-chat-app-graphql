import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import { Divider, Container } from '@material-ui/core';

import { User } from '../../templates/AppLayout/UserLayout';
import List from './List';
import Send from './Send';
import {
  Header, StyledAvatar, Tittle,
} from './styles';

const { REACT_APP_API_URL } = process.env;

const USER_AND_MESSAGE = gql`
  query USER_AND_MESSAGE($userId: String!) {
    user(userId: $userId) {
      id
      name
      picture
    }

    messages(userId: $userId) {
      id
      from
      to
      text
    }
  }
`;

const CHAT_MESSAGE = gql`
  subscription CHAT_MESSAGE($userId: String!) {
    chatMessage(userId: $userId) {
      id
      from
      to
      text
    }
  }
`;

export interface Message {
  id: string;
  from: string;
  to: string;
  text: string;
}

interface QueryProps {
  messages: Message[]
  user: User;
}

interface SubscriptionData {
  chatMessage: Message;
}

function Chat() {
  const { userId } = useParams();
  const {
    data, loading, subscribeToMore,
  } = useQuery<QueryProps>(
    USER_AND_MESSAGE,
    {
      variables: { userId },
      fetchPolicy: 'network-only',
    },
  );

  useEffect(() => {
    const unsubscribe = subscribeToMore<SubscriptionData>({
      document: CHAT_MESSAGE,
      variables: { userId },
      updateQuery: (prev, { subscriptionData }) => {
        const { chatMessage } = subscriptionData.data;

        return {
          ...prev,
          messages: [...prev.messages, chatMessage],
        };
      },
    });

    return () => { unsubscribe(); };
  }, [subscribeToMore, userId]);

  if (loading || !data) { return null; }
  const { messages, user } = data;

  return (
    <Container maxWidth="lg">
      <Header>
        <StyledAvatar src={`http://${REACT_APP_API_URL}/files/${user.picture}`} />
        <Tittle variant="h6">{user.name}</Tittle>
      </Header>
      <Divider />

      <List
        messages={messages}
        friendId={userId}
      />
      <Divider />

      <Send friendId={userId} />
    </Container>
  );
}

export default Chat;
