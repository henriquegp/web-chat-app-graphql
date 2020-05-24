import { InMemoryCache, gql } from 'apollo-boost';

interface System {
  token: string;
  __typename: string;
}

export interface LocalState {
  system: System;
}

export const INITIAL_STATE: LocalState = {
  system: {
    __typename: 'System',
    token: '',
  },
};

export const ALL_DATA_CACHE_QUERY = gql`
  query {
    system @client {
      token
    }
  }
`;

const getInitialState = () => {
  const storagedState = localStorage.getItem('LOCAL_STATE');

  return storagedState ? JSON.parse(storagedState) : INITIAL_STATE;
};

const cache = new InMemoryCache();

cache.writeData({
  data: getInitialState(),
});

export default cache;
