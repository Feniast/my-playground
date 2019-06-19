import React from 'react';
import { storiesOf } from '@storybook/react';
import Splitting from 'splitting';
import 'splitting/dist/splitting.css';
import { TweenMax, Power4 } from 'gsap';

import useRevealState from '../hooks/useRevealState';

const randomColor = () => `hsl(${Math.floor(Math.random() * 360)}, 80%, 50%)`;

const RevealedComponent = props => {
  const { text } = props;
  const wrapperRef = React.useRef();
  const textRef = React.useRef();
  const bg = React.useMemo(() => randomColor(), []);
  const scrollState = useRevealState(wrapperRef, {
    threshold: 0.5,
    unwatchOnVisible: true
  });
  React.useEffect(() => {
    if (scrollState.visible) {
      TweenMax.to(textRef.current, 1, {
        opacity: 1,
        y: '0%',
        ease: Power4.easeOut
      });
    } else {
      TweenMax.set(textRef.current, {
        opacity: 0,
        y: '-100%'
      });
    }
  }, [text, scrollState.visible]);
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

storiesOf('useRevealState', module).add('common', () => {
  return (
    <div>
      {['Hello', 'What', 'Greeting', 'Watch it'].map(text => (
        <RevealedComponent text={text} />
      ))}
    </div>
  );
});
