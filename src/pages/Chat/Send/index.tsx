import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';

import { Container, StyledInput } from './styles';

const SendSchema = Yup.object().shape({
  text: Yup.string().max(2000).required('Required'),
});

const SEND_MESSAGE = gql`
  mutation SEND_MESSAGE($userId: String!, $text: String!) {
    sendMessage(userId: $userId, text: $text) {
      text
    }
  }
`;

interface Props {
  friendId: string;
}

function Send({ friendId }: Props) {
  const [sendMessage, { loading }] = useMutation(SEND_MESSAGE);
  const { handleSubmit, getFieldProps, values } = useFormik({
    initialValues: { text: '' },
    validationSchema: SendSchema,
    async onSubmit({ text }, { resetForm }) {
      await sendMessage({
        variables: {
          text,
          userId: friendId,
        },
      });
      resetForm();
    },
  });

  return (
    <form onSubmit={handleSubmit}>
      <Container>
        <StyledInput
          maxLength={2000}
          placeholder="Type your message..."
          autoComplete="off"
          {...getFieldProps('text')}
        />
        <div>
          <IconButton
            type="submit"
            color="primary"
            disabled={loading || !values.text}
            size="small"
          >
            <SendIcon />
          </IconButton>
        </div>
      </Container>
    </form>
  );
}

export default Send;
