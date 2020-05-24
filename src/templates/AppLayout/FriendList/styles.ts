import styled from 'styled-components';
import Badge from '@material-ui/core/Badge';

interface BadgeProps {
  background: string;
}

export const StatusBadge = styled(Badge)<BadgeProps>`
  > .MuiBadge-badge {
    background: ${({ background }) => background};
    bottom: 0;
    top: auto;
    right: 5px;
  }
`;

export const UnseenBadge = styled(Badge)`
  margin-right: 8px;
`;
