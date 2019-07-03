import React, { useRef, useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import Tone from 'tone';
import ToneRoot from './Tone';

const Example = () => {
  const [state, setState] = useState(false);
  const onClick = React.useCallback(() => {
    setState((state => !state));
  }, []);
  const trigger = React.useCallback((inst, time, note) => {
    console.log(Tone.Transport.position);
    inst.triggerAttackRelease(note, '8n', time);
  }, []);
  return (
    <>
      <div>Hello</div>
      <button onClick={onClick}>{state ? 'Stop' : 'Play'}</button>
      <ToneRoot start={state}>
        <distortion distortion={1}>
          <feedbackDelay delay="4n" feedback={0.2}>
            <synth>
              {/* {state ? <triggerAttackRelease args={['C4', '4n']} /> : null} */}
              <sequence args={[trigger, ['C5', 'C4', 'C3', 'C2'], '4n']} />
            </synth>
          </feedbackDelay>
        </distortion>
      </ToneRoot>
    </>
  );
}

storiesOf('Tone Reconciler', module)
  .add('hello', () => {
    return <Example />;
  });