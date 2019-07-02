import React, { useRef, useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import Tone from './Tone';

const Example = () => {
  const [state, setState] = useState(false);
  const onClick = React.useCallback(() => {
    setState((state => !state));
  }, []);
  const trigger = React.useCallback((inst, time, note) => {
    inst.triggerAttackRelease(note, '8n', time);
  }, []);
  return (
    <>
      <div>Hello</div>
      <button onClick={onClick}>{state ? 'Stop' : 'Play'}</button>
      <Tone>
        <distortion distortion={1}>
          <feedbackDelay delay="4n" feedback={0.2}>
            <synth>
              {/* {state ? <triggerAttackRelease args={['C4', '4n']} /> : null} */}
              <sequence args={[trigger, ['C5', 'C4', 'C3', 'C2'], '4n']} />
            </synth>
          </feedbackDelay>
        </distortion>
      </Tone>
    </>
  );
}

storiesOf('Tone Reconciler', module)
  .add('hello', () => {
    return <Example />;
  });