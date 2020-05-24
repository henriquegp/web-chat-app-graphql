import {
  ApolloClient, split, ApolloLink, concat,
} from 'apollo-boost';
import { createUploadLink } from 'apollo-upload-client';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import cache from './cache';
import typeDefs from './typeDefs';
import resolvers from './resolvers';
import getLocalState from '../utils/getLocalState';

const { REACT_APP_API_URL } = process.env;

const httpLink = createUploadLink({
  uri: `http://${REACT_APP_API_URL}/graphql`,
});

export const subscriptionClient = new SubscriptionClient(
  `ws://${REACT_APP_API_URL}/graphql`,
  {
    reconnect: true,
    lazy: true,
    connectionParams: () => {
      const { system } = getLocalState();

      return {
        headers: {
          authorization: `Bearer ${system.token}`,
        },
      };
    },
  },
);

const wsLink = new WebSocketLink(subscriptionClient);

const authMiddleware = new ApolloLink((operation, forward) => {
  const { system } = getLocalState();

  operation.setContext({
    headers: {
      authorization: `Bearer ${system.token}`,
    },
  });

  return forward(operation);
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition'
      && definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: concat(authMiddleware, link),
  cache,
  typeDefs,
  resolvers,
});

export default client;
