import styled from 'styled-components';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Badge from '@material-ui/core/Badge';

export const Container = styled(Box)`
  display: flex;
  align-items: center;
`;

export const Info = styled.div`
  margin-left: 10px;
`;

export const Name = styled.span`
  font-size: 16px;
  font-weight: 500;
`;

export const StyledButton = styled(Button)`
  padding: 0;
  min-width: 0;

  > span {
    text-transform: initial;
  }
`;

interface BadgeProps {
  background: string;
}

export const StyledBagde = styled(Badge)<BadgeProps>`
  > .MuiBadge-badge {
    background: ${({ background }) => background};
    bottom: -8px;
    top: auto;
    right: 9px;
  }
`;
