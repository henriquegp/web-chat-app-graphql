import React from 'react';
import {
  Switch, Route, Redirect, RouteProps,
} from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

import AuthLayout from './templates/AuthLayout';
import AppLayout from './templates/AppLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Chat from './pages/Chat';

interface OwnProps {
  isAuthorized: boolean;
  redirect: string;
}

type ProtectedRouteProps = OwnProps & RouteProps;

const AuthRoute = ({
  isAuthorized,
  children,
  redirect,
  ...rest
}: ProtectedRouteProps) => (
  <Route
    {...rest}
    render={() => (isAuthorized ? children : <Redirect to={redirect} />)}
  />
);

const IS_AUTHORIZED = gql`
  query {
    system @client {
      token
    }
  }
`;

function Routes() {
  const { data } = useQuery(IS_AUTHORIZED);
  const isAuthorized = !!data?.system.token;

  return (
    <>
      <Switch>
        <AuthRoute
          exact
          path={['/login', '/register']}
          isAuthorized={!isAuthorized}
          redirect="/"
        >
          <AuthLayout>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/register" component={Register} />
            </Switch>
          </AuthLayout>
        </AuthRoute>

        <AuthRoute path="/" isAuthorized={isAuthorized} redirect="/login">
          <AppLayout>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/:userId" component={Chat} />
              <Redirect to="/" />
            </Switch>
          </AppLayout>
        </AuthRoute>
      </Switch>
    </>
  );
}

export default Routes;
