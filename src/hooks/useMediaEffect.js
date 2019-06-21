import { useEffect, useState } from 'react';

const useMediaEffect = (query, effect, guards = []) => {
  const [matched, setMatched] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(query);
    const listen = event => {
      setMatched(event.matches);
    };
    mql.addListener(listen);
    setMatched(mql.matches);

    return () => {
      mql.removeListener(listen);
    }
  }, [query]);
  const effectGuards = [matched, effect, ...guards];
  useEffect(() => {
    if (matched) return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, effectGuards);
}

export default useMediaEffect;
