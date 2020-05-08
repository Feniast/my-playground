import { useEffect, useState } from 'react';

const useMedia = (query) => {
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
    };
  }, [query]);
  return matched;
};

export default useMedia;
