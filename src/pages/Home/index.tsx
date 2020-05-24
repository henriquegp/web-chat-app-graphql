import React, { ChangeEvent } from 'react';
import { gql } from 'apollo-boost';
import { useLazyQuery } from '@apollo/react-hooks';
import lodash from 'lodash';
import {
  Typography,
  InputAdornment,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

import { User } from '../../templates/AppLayout/UserLayout';
import UserList from './UserList';
import { StyledInput, StyledContainer } from './styles';

export interface SearchUser extends User {
  isFriends: boolean;
  requestId: string;
}

interface QueryProps {
  searchUsers: SearchUser[];
}

const SEARCH_USERS = gql`
  query SEARCH_USERS($name: String!) {
    searchUsers(name: $name) {
      id
      username
      name
      picture
      isFriends
      requestId
    }
  }
`;

function Home() {
  const [searchUsers, {
    called, loading, data, refetch,
  }] = useLazyQuery<QueryProps>(SEARCH_USERS);

  const search = lodash.debounce((name: string) => {
    searchUsers({ variables: { name } });
  }, 500);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { target: { value } } = event;

    if (value.length > 2) {
      search(value);
    }
  }

  return (
    <StyledContainer maxWidth="sm">
      <Typography variant="h5">Add Friends</Typography>

      <StyledInput
        onChange={handleChange}
        placeholder="Search"
        startAdornment={(
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        )}
      />

      {called && !loading && data && (
        <UserList
          users={data.searchUsers}
          reload={() => refetch()}
        />
      )}
    </StyledContainer>
  );
}

export default Home;
