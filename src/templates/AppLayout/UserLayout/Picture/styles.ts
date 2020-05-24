import styled from 'styled-components';
import Avatar from '@material-ui/core/Avatar';

export const Container = styled.div`
  cursor: pointer;
  position: relative;

  > input {
    width: 0;
    height: 0;
    position: absolute;
  }

  :before {
    content: 'Edit';
    position: absolute;
    z-index: 1;
    top: 32%;
    left: 30%;
    color: #FFF;
  }

  :after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: rgb(0,0,0,.6);
    border-radius: 50%;    
  }

  :before, :after {
    transition: opacity .3s;
    opacity: 0;
  } 

  :hover {
    :before, :after {
      opacity: 1;
    } 
  }
`;

export const StyledAvatar = styled(Avatar)`
  width: 60px;
  height: 60px;
`;
