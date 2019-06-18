export const breakpoints = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'];

const breakpointsMap = {
  xs: '(max-width: 575px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  xxl: '(min-width: 1600px)'
};

let subscribers = [];
let id = 0;
let screens = {};

const mediaMatch = (query, callback, immediate = true) => {
  if (!query || !typeof callback === 'function') return;
  const mql = window.matchMedia(query);
  const listener = (event) => {
    callback(event.matches);
  }
  mql.addListener(listener);
  if (immediate) callback(mql.matches);
  return () => {
    mql.removeListener(listener);
  }
}

const MediaObserver = {
  mediaWatchers: [],
  subscribe(fn) {
    if (subscribers.length === 0) {
      this.register();
    }
    const sid = ++id;
    subscribers.push({
      id: sid,
      func: fn
    });
    fn(screens);
    return () => {
      this.unsubscribe(sid);
    }
  },
  unsubscribe(id) {
    subscribers = subscribers.filter(s => s.id !== id);
    if (subscribers.length === 0) {
      this.unregister();
    }
  },
  register() {
    this.mediaWatchers = Object.keys(breakpointsMap).map(key => {
      const query = breakpointsMap[key];
      const unlisten = mediaMatch(query, (matched) => {
        this.emit({ ...screens, [key]: matched });
      });
      return unlisten;
    });
  },
  unregister() {
    this.mediaWatchers.forEach(m => m());
    this.mediaWatchers = [];
  },
  emit(screensMatchedMap) {
    screens = screensMatchedMap;
    subscribers.forEach(s => s.func(screens));
  }
};

export default MediaObserver;
