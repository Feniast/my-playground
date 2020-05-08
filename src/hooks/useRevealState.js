import { useEffect, useState } from 'react';
import { clamp } from '../helpers/math';
import throttle from 'lodash/throttle';

const noop = () => {};

const getElementPos = (elem, container) => {
  let x = 0,
    y = 0;
  let offsetEl = elem;
  while (offsetEl && offsetEl !== container) {
    x += offsetEl.offsetLeft;
    y += offsetEl.offsetTop;
    offsetEl = offsetEl.offsetParent;
  }
  return {
    x,
    y
  };
};

const getElementsRevealState = (elements, container = window) => {
  if (!elements) return {};
  const isSingle = !Array.isArray(elements);
  if (isSingle) {
    elements = [elements];
  }
  const isWindow = container === window;
  const root = isWindow ? document.documentElement : container;
  const cx = !isWindow ? container.scrollLeft : window.pageXOffset;
  const cy = !isWindow ? container.scrollTop : window.pageYOffset;
  const { clientWidth: cw, clientHeight: ch } = root;

  const results =  elements.map(element => {
    const { el, threshold } = element;
    const { x, y } = getElementPos(el, root);
    const { width: w, height: h } = el.getBoundingClientRect();
    const visibleX = (clamp(x + w, cx, cx + cw) - clamp(x, cx, cx + cw)) / w;
    const visibleY = (clamp(y + h, cy, cy + ch) - clamp(y, cy, cy + ch)) / h;
    const visible = visibleX * visibleY > (threshold || 0);

    return {
      visible,
      visibleX,
      visibleY
    };
  });

  return isSingle ? results[0] : results;
}

class ScrollHub {
  constructor() {
    this.store = new Map();
    this._id = 0;
  }

  register(container, element, onScroll, threshold = 0) {
    if (!element || !onScroll) return noop;
    const scrollContainer = container || window;
    if (!this.store.has(scrollContainer)) {
      this.registerScrollContainer(scrollContainer);
    }
    const entry = this.store.get(scrollContainer);
    const newId = ++this._id;
    const newElement = {
      id: newId,
      el: element,
      onScroll,
      threshold
    };
    entry.elements.push(newElement);
    this.update(container, newElement);

    return () => {
      const entry = this.store.get(scrollContainer);
      if (!entry) return;
      entry.elements = entry.elements.filter(e => e.id !== newId);
      if (entry.elements.length === 0) entry.destroy();
    };
  }

  registerScrollContainer(container) {
    const onScrollHandler = throttle(() => {
      const { elements } = this.store.get(container);
      this.update(container, elements);
    }, 16);

    container.addEventListener('scroll', onScrollHandler, false);
    this.store.set(container, {
      elements: [],
      destroy: () => {
        container.removeEventListener('scroll', onScrollHandler);
        this.store.delete(container);
      }
    });
  }

  update(container, elements) {
    if (!Array.isArray(elements)) {
      elements = [elements];
    }
    const revealStates = getElementsRevealState(elements, container);
    elements.forEach((element, idx) => {
      const { onScroll, state = {} } = element;
      const newState = revealStates[idx];
      newState.prevVisible = !!state.visible; // make it false when state.visible is not set initially in order to trigger some action
      element.state = newState;
      onScroll(newState);
    });
  }
}

const scrollHub = new ScrollHub();

const useRevealState = (
  ref,
  { threshold = 0, container = window, unwatchOnVisible = false } = {}
) => {
  const [state, setState] = useState({});

  useEffect(() => {
    if (!ref || !ref.current) return;
    let unsubscribe;
    const onScroll = unwatchOnVisible
      ? newState => {
          if (newState.visible) {
            if (unsubscribe) unsubscribe();
            setState(newState);
          }
        }
      : setState;
    unsubscribe = scrollHub.register(
      container,
      ref.current,
      onScroll,
      threshold
    );
    return unsubscribe;
  }, [ref, container, threshold, unwatchOnVisible]);

  return state;
};

export default useRevealState;
