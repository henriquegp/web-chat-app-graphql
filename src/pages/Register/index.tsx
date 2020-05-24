import React from 'react';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';

import { Button } from '../Login/styles';

const REGISTER = gql`
  mutation register($user: UserInput!) {
    register(user: $user)
  }
`;

const RegisterSchema = Yup.object().shape({
  name: Yup.string().max(60).required('Required'),
  username: Yup.string().max(20).required('Required'),
  password: Yup.string().min(8).max(20).required('Required'),
  confirmPassword: Yup
    .string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

function Register() {
  const [
    register,
    { loading, error, data },
  ] = useMutation<{ register: string }>(REGISTER);

  const {
    handleSubmit, getFieldProps, errors, touched,
  } = useFormik({
    initialValues: {
      name: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: RegisterSchema,
    async onSubmit(user) {
      try {
        await register({ variables: { user } });
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
          label="Name"
          {...getFieldProps('name')}
          helperText={(errors.name && touched.name) && errors.name}
          error={!!(errors.name && touched.name)}
        />
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
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          label="Password"
          type="password"
          {...getFieldProps('confirmPassword')}
          helperText={(errors.confirmPassword && touched.confirmPassword) && errors.confirmPassword}
          error={!!(errors.confirmPassword && touched.confirmPassword)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Register
        </Button>
      </form>

      {error}
      {(error && error.graphQLErrors.length) && (
        <Alert severity="error">{error.graphQLErrors[0].message}</Alert>
      )}
      {data && (
        <Alert severity="success">{data.register}</Alert>
      )}
    </>
  );
}

export default Register;
