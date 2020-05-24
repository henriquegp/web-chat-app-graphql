import cache, { LocalState, ALL_DATA_CACHE_QUERY } from '../apollo/cache';

function getLocalState() {
  const state = cache.readQuery<LocalState>({ query: ALL_DATA_CACHE_QUERY });

  if (!state) throw new Error('Local State not found');

  return state;
}

export default getLocalState;
