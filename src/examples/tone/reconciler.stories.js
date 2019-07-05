import React, { useRef, useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import Tone from 'tone';
import Tune from './Tune';

const Example = () => {
  const [state, setState] = useState(false);
  const synth = useRef();
  const seq = useRef();
  const onClick = React.useCallback(() => {
    setState(state => !state);
  }, []);
  const trigger = React.useCallback((inst, time, note) => {
    console.log(note);
    // console.log(Tone.Transport.position);
    inst.triggerAttackRelease(note, '8n', time);
  }, []);
  useEffect(() => {
    setInterval(() => {
      seq.current && console.log(seq.current._events);
    }, 1000);
  }, []);
  const [pitch, setPitch] = useState('1');
  const x = ['C', 'D', 'E', 'F', 'G', 'A', 'B'][pitch - 1] + '5';
  return (
    <>
      <div>Hello</div>
      <button onClick={onClick}>{state ? 'Stop' : 'Play'}</button>
      <input
        type="range"
        min="1"
        max="7"
        step="1"
        onChange={e => setPitch(e.target.value)}
        value={pitch}
      />
      <Tune start={state}>
        {state ? (
          <distortion distortion={1}>
            <feedbackDelay delay="4n" feedback={0.2}>
              <synth ref={synth}>
                {/* {state ? <triggerAttackRelease args={['C4', '4n']} /> : null} */}
                <sequence
                  ref={seq}
                  args={[trigger, ['C2', 'C3', 'C4', x], '4n']}
                  start
                />
                {/* <part
                  args={[
                    trigger,
                    [[0, 'C5'], ['0:2', 'D5'], ['0:3:2', 'E5']]
                  ]}
                  start
                /> */}
              </synth>
            </feedbackDelay>
          </distortion>
        ) : null}
        {/* <membraneSynth>
          <part
            args={[trigger, [[0, 'C2'], ['0:2', 'C2'], ['0:3:2', 'C2']]]}
            start
          />
        </membraneSynth> */}
      </Tune>
    </>
  );
};

storiesOf('Tone Reconciler', module).add('hello', () => {
  return <Example />;
});
