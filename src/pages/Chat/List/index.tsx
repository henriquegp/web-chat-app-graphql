import React, { useEffect, useRef } from 'react';
import Typography from '@material-ui/core/Typography';

import { Message } from '..';
import {
  MessagesContainer, MessageContent, MessageCard,
} from './styles';

interface Props {
  messages: Message[];
  friendId: string;
}

function List({ messages, friendId }: Props) {
  const divRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (divRef.current) {
      divRef.current.scrollTop = divRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <MessagesContainer ref={divRef}>
      {messages.map(({ id, from, text }) => (
        <MessageContent
          key={id}
          isFriend={from === friendId}
        >
          <MessageCard>
            <Typography variant="body1">{text}</Typography>
          </MessageCard>
        </MessageContent>
      ))}
    </MessagesContainer>
  );
}

export default List;
