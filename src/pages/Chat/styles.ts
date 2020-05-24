import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

export const Header = styled.header`
  display: flex;
  align-items: center;
  margin: 10px 0px;
`;

export const StyledAvatar = styled(Avatar)`
  width: 80px;
  height: 80px;
`;

export const Tittle = styled(Typography)`
  margin-left: 15px;
`;
