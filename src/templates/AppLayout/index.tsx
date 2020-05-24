import React, { ReactChild, useState } from 'react';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useMutation } from '@apollo/react-hooks';
import {
  AppBar, Toolbar, Drawer, IconButton, Divider, Tabs, Tab, Hidden, Button,
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import MenuIcon from '@material-ui/icons/Menu';
import ExitIcon from '@material-ui/icons/ExitToApp';

import UserLayout from './UserLayout';
import FriendList from './FriendList';
import FriendRequests from './FriendRequests';

import {
  Paper, StyledToolbar, Main, ToolbarTitle,
} from './styles';

interface Props {
  children: ReactChild;
}

const LOGOUT = gql`
  mutation LOGOUT {
    logout @client
  }
`;

function AppLayout({ children }: Props) {
  const [toggleSideMenu, setToggleSideMenu] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [logout] = useMutation(LOGOUT);

  const drawer = (
    <>
      <Toolbar />
      <Divider />

      <UserLayout />
      <Divider />

      <Button
        component={Link}
        to="/"
        size="large"
        startIcon={<HomeIcon />}
      >
        Home
      </Button>
      <Divider />

      <Tabs
        variant="fullWidth"
        indicatorColor="primary"
        value={tabIndex}
        onChange={(e, newValue) => setTabIndex(newValue)}
      >
        <Tab label="Friends" />
        <Tab label="Requests" />
      </Tabs>

      { tabIndex === 0 && <FriendList /> }
      { tabIndex === 1 && <FriendRequests /> }
    </>
  );

  return (
    <>
      <AppBar position="relative">
        <StyledToolbar>
          <IconButton
            color="inherit"
            className="menu-button"
            onClick={() => setToggleSideMenu(!toggleSideMenu)}
          >
            <MenuIcon />
          </IconButton>

          <ToolbarTitle variant="h6" color="inherit" noWrap>
            Talk
          </ToolbarTitle>

          <IconButton
            color="inherit"
            title="Logout"
            onClick={() => logout()}
          >
            <ExitIcon />
          </IconButton>
        </StyledToolbar>
      </AppBar>

      <Hidden smUp implementation="css">
        <Drawer
          anchor="left"
          variant="temporary"
          open={toggleSideMenu}
          PaperProps={{ component: Paper }}
          onClose={() => setToggleSideMenu(false)}
        >
          {drawer}
        </Drawer>
      </Hidden>

      <Hidden xsDown implementation="css">
        <Drawer
          anchor="left"
          variant="permanent"
          open
          PaperProps={{ component: Paper }}
        >
          {drawer}
        </Drawer>
      </Hidden>

      <Main>{ children }</Main>
    </>
  );
}

export default AppLayout;
