function getStatusColor(status: string) {
  switch (status) {
    case 'ONLINE': return 'green';
    case 'ABSENT': return 'orange';
    case 'OFFLINE': return 'gray';
    default: return '#FFF';
  }
}

export default getStatusColor;
