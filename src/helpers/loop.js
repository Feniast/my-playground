let subscribers = [];
let tId = null;

const loop = () => {
  subscribers.forEach(s => s());
  tId = subscribers.length > 0 ? requestAnimationFrame(loop) : null;
};

export const register = (fn) => {
  subscribers.push(fn);
  if (tId == null) {
    loop();
  }

  return () => {
    subscribers = subscribers.filter(s => s !== fn);
    if (subscribers.length === 0 && tId) {
      cancelAnimationFrame(tId);
      tId = null;
    }
  }
};
