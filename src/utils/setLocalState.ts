import cache, { LocalState } from '../apollo/cache';
import getLocalState from './getLocalState';

interface EventState {
  (state: LocalState): LocalState;
}

function setLocalState(getNewState: EventState) {
  const localState = getLocalState();

  const newState = getNewState(localState);

  cache.writeData({
    data: newState,
  });

  localStorage.setItem('LOCAL_STATE', JSON.stringify(newState));
}

export default setLocalState;
