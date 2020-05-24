import React from 'react';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from 'styled-components';
import { useTheme } from '@material-ui/core/styles';

import client from './apollo';
import Router from './Routes';

function App() {
  const theme = useTheme();

  return (
    <ApolloProvider client={client}>
      <CssBaseline />

      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
