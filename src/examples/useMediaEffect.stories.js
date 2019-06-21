import React, { useRef } from 'react';
import { storiesOf } from '@storybook/react';
import { TimelineMax, Power4 } from 'gsap';

import useMediaEffect from '../hooks/useMediaEffect';

const Example = () => {
  const ref = useRef();
  useMediaEffect('(min-width: 800px)', () => {
    const tl = new TimelineMax({ repeat: -1, yoyo: true }).to(ref.current, 1, {
      scale: 2
    });

    return () => {
      tl.stop();
    }
  }, []);
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div ref={ref} style={{ width: '200px', height: '200px', borderRadius: '50%', backgroundColor: 'red' }}></div>
    </div>
  )
}

storiesOf('useMediaEffect', module).add('basic', () => {
  return (
    <div>
      <Example />
    </div>
  );
});