import styled from 'styled-components';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const drawerWidth = 320;

export const StyledToolbar = styled(Toolbar)`
  ${({ theme }) => theme.breakpoints.up('sm')} {
    width: calc(100% - ${drawerWidth}px);
    margin-left: ${drawerWidth}px;

    & > .menu-button {
      display: none;
    }
  }
`;

export const ToolbarTitle = styled(Typography)`
  flex-grow: 1;
`;

export const Paper = styled.div`
  max-width: ${drawerWidth}px;
  width: 80%;
`;

export const Main = styled.main`
  width: 100%;

  ${({ theme }) => theme.breakpoints.up('sm')} {
    width: calc(100% - ${drawerWidth}px);
    margin-left: ${drawerWidth}px;
  }
`;
