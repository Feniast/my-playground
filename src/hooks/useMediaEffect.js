import { useEffect } from 'react';
import useMedia from './useMedia';

const useMediaEffect = (query, effect, guards = []) => {
  const matched = useMedia(query);
  const effectGuards = [matched, effect, ...guards];
  useEffect(() => {
    if (matched) return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effectGuards);
  return matched;
}

export default useMediaEffect;
