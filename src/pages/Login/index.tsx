import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { TextField, Link } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { Button, Actions } from './styles';

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      user {
        id
        username
        name
        picture
      }
      token
    }
  }
`;

const SET_TOKEN = gql`
  mutation setToken($token: String!) {
    setToken(token: $token) @client(always: true)
  }
`;

const LoginSchema = Yup.object().shape({
  username: Yup.string().max(20).required('Required'),
  password: Yup.string().min(8).max(20).required('Required'),
});

function Login() {
  const [login, { loading, error }] = useMutation(LOGIN);
  const [setToken] = useMutation(SET_TOKEN);

  const {
    handleSubmit, getFieldProps, errors, touched,
  } = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: LoginSchema,
    async onSubmit(values) {
      try {
        const { data } = await login({ variables: values });

        await setToken({ variables: { token: data?.login.token } });
      } catch (er) {
        console.log(er);
      }
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Username"
          {...getFieldProps('username')}
          helperText={(errors.username && touched.username) && errors.username}
          error={!!(errors.username && touched.username)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          {...getFieldProps('password')}
          helperText={(errors.password && touched.password) && errors.password}
          error={!!(errors.password && touched.password)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Login
        </Button>
      </form>

      <Actions>
        <Link component={RouterLink} to="/register">Register</Link>
      </Actions>

      {(error && error.graphQLErrors.length) && (
        <Alert severity="error">{error.graphQLErrors[0].message}</Alert>
      )}
    </>
  );
}

export default Login;
