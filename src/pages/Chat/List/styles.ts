import styled from 'styled-components';
import Card from '@material-ui/core/Card';

export const MessagesContainer = styled.div`
  height: 75vh;
  overflow-y: auto;
`;

export const MessageCard = styled(Card)`
  display: inline-block;
  padding: 10px 15px;
  font-size: 16px;
`;

interface MessageContentProps {
  isFriend: boolean;
}

export const MessageContent = styled.div<MessageContentProps>`
  width: 80%;
  max-width: 500px;
  margin: 10px 15px;
  display: flex;
  margin-left: ${({ isFriend }) => (isFriend ? 0 : 'auto')};

  ${MessageCard} {
    background: ${({ isFriend }) => (isFriend ? '#FFF' : '#ccdffb')};
    margin-left: ${({ isFriend }) => (isFriend ? 0 : 'auto')};
  }
`;
