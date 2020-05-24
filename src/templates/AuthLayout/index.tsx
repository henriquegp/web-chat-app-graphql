import React, { ReactChild } from 'react';

import { Container, Typography } from '@material-ui/core';
import Content from './styles';

interface Props {
  children: ReactChild;
}

function AuthLayout({ children }: Props) {
  return (
    <Container component="main" maxWidth="xs">
      <Content>
        <Typography component="h1" variant="h5">
          Talk
        </Typography>
        { children }
      </Content>
    </Container>
  );
}

export default AuthLayout;
