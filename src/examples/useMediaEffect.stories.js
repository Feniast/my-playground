import React, { useRef } from 'react';
import { storiesOf } from '@storybook/react';
import { TimelineMax, TweenMax } from 'gsap';

import useMediaEffect from '../hooks/useMediaEffect';

const Example = () => {
  const ref = useRef();
  const matched = useMediaEffect('(min-width: 800px)', () => {
    const tl = new TimelineMax({ repeat: -1, yoyo: true }).to(ref.current, 1, {
      scale: 2,
      opacity: 0.5
    });

    return () => {
      TweenMax.set(ref.current, {
        clearProps: 'scale,opacity'
      });
      tl.kill();
    }
  }, []);
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
      }}
    >
      <p style={{ position: 'absolute', top: 'calc(50% - 200px)', textAlign: 'center' }}>
        { matched ? 'pulse when over 800px' : 'static when less than 800px' }
      </p>
      <div
        ref={ref}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          backgroundColor: 'rgb(162, 228, 137)'
        }}
      />
    </div>
  );
}

storiesOf('useMediaEffect', module).add('animate when match media', () => {
  return (
    <div>
      <Example />
    </div>
  );
});