import { useEffect, useState } from 'react';

const useMouseHover = ref => {
  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({
    x: 0,
    y: 0,
    cx: 0,
    cy: 0,
    percentX: 0,
    percentY: 0,
    percentCX: 0,
    percentCY: 0,
    rawX: 0,
    rawY: 0
  });

  useEffect(() => {
    let elem;
    if (typeof ref === 'undefined') {
      elem = document.documentElement;
    } else if (ref === null || !ref.current) {
      return;
    } else {
      elem = ref.current;
    }
    let innerHovered = false;

    const setMousePos = e => {
      const { clientX, clientY } = e;
      const boundsRect = elem.getBoundingClientRect();
      const { top, left, width, height } = boundsRect;
      const halfWidth = width / 2;
      const halfHeight = height / 2;
      const centerX = left + halfWidth;
      const centerY = top + halfHeight;
      const x = clientX - left;
      const y = clientY - top;
      const diffX = clientX - centerX;
      const diffY = clientY - centerY;
      const pos = {
        x,
        y,
        cx: diffX,
        cy: diffY,
        percentX: x / width,
        percentY: y / height,
        percentCX: diffX / halfWidth,
        percentCY: diffY / halfHeight, 
        rawX: clientX,
        rawY: clientY
      };
      setPos(pos);
    };

    const onMouseEnter = e => {
      innerHovered = true;
      setHovered(true);
      setMousePos(e);

      elem.addEventListener('mousemove', onMouseMove, false);
      elem.addEventListener('mouseleave', onMouseLeave, false);
    };

    const onMouseMove = e => {
      setMousePos(e);
    };

    const onMouseLeave = e => {
      innerHovered = false;
      setHovered(false);
      elem.removeEventListener('mousemove', onMouseMove);
      elem.removeEventListener('mouseleave', onMouseLeave);
    };

    elem.addEventListener('mouseenter', onMouseEnter, false);

    return () => {
      elem.removeEventListener('mouseenter', onMouseEnter);
      innerHovered && elem.removeEventListener('mousemove', onMouseMove);
      innerHovered && elem.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [ref]);

  return [hovered, pos];
};

export default useMouseHover;
