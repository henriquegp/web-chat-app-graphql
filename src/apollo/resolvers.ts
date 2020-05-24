import {
  Resolvers, InMemoryCache, ApolloClient, NormalizedCache,
} from 'apollo-boost';

import { subscriptionClient } from '.';
import setLocalState from '../utils/setLocalState';
import { INITIAL_STATE } from './cache';

interface Context {
  cache: InMemoryCache;
  client: ApolloClient<NormalizedCache>;
}

const resolvers: Resolvers = {
  Mutation: {
    setToken(obj, { token }) {
      setLocalState((state) => ({
        ...state,
        system: {
          ...state.system,
          token,
        },
      }));

      return null;
    },

    async logout() {
      localStorage.removeItem('LOCAL_STATE');
      setLocalState(() => INITIAL_STATE);
      subscriptionClient.close(true);

      return null;
    },
  },
};

export default resolvers;
