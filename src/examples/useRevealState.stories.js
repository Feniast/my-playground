import React from 'react';
import { storiesOf } from '@storybook/react';
import { TweenMax, Power4 } from 'gsap';

import Button from '../components/Button';

import useRevealState from '../hooks/useRevealState';

const randomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`;

const RevealedComponent = props => {
  const { text, once } = props;
  const wrapperRef = React.useRef();
  const textRef = React.useRef();
  const bg = React.useMemo(() => randomColor(), []);
  const scrollState = useRevealState(wrapperRef, {
    threshold: 0.5,
    unwatchOnVisible: !!once
  });
  React.useLayoutEffect(() => {
    TweenMax.set(textRef.current, {
      opacity: 0,
      y: '-100%'
    });
  }, []);
  React.useEffect(() => {
    if (scrollState.visible && !scrollState.prevVisible) {
      TweenMax.to(textRef.current, 1, {
        opacity: 1,
        y: '0%',
        ease: Power4.easeOut
      });
    } else if (scrollState.visibleY <= 0) {
      TweenMax.set(textRef.current, {
        opacity: 0,
        y: '-100%'
      });
    }
  }, [text, scrollState]);
  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontSize: '3rem',
        backgroundColor: bg
      }}
    >
      <div ref={textRef}>{text}</div>
    </div>
  );
};

storiesOf('useRevealState', module).add('reveal once', () => {
  return (
    <div>
      {['Hello', 'What', 'Greeting', 'Watch it'].map(text => (
        <RevealedComponent text={text} once={true} />
      ))}
    </div>
  );
})
.add('reveal always', () => {
  return (
    <div>
      {['Hello', 'What', 'Greeting', 'Watch it'].map(text => (
        <RevealedComponent text={text} />
      ))}
    </div>
  );
});
