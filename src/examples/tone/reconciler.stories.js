import React, { useRef, useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import Tone from 'tone';
import Tune from './Tune';
import { getMusicParts } from './helpers';

const rhythms = [
  ['r', '8n'],
  '8n',
  '8n',
  '4n',
  ['r', '8n'],
  '8n',
  '8n',
  '4n',
  '8n',
  '4n',
  '8n',
  '8n',
  '8n',
  ['r', '8n'],
  '8n',
  '8n',
  '4n',
  ['r', '8n'],
  '8n',
  '8n',
  '4n',
  '8n',
  '4n',
  '8n',
  '8n',
  '8n',
  ['r', '8n'],
  '8n',
  '8n',
  '4n',
  '8n',
  '8n',
  '8n',
  ['r', '8n'],
  '4n',
  '4n',
  '4n',
  '8n',
  ['r', '8n'],
  '8n',
  '8n',
  '8n',
  '8n',
  '8n',
  '8n',
  '8n'
];
const notes = [
  'D5',
  'F5#',
  'G5',
  'C5',
  'G4',
  'B4',
  'C5',
  'D5',
  'G4',
  'C5',
  'B4',
  'D5',
  'F5#',
  'G5',
  'C5',
  'G4',
  'B4',
  'C5',
  'D5',
  'G4',
  'C5',
  'B4',
  null,
  'D5',
  'F5#',
  'G5',
  'G5',
  ['C5', 'A5'],
  'B5',
  'A5',
  'C6',
  'B5',
  'G5',
  null,
  'B4',
  'G4',
  'G5',
  'F5#',
  'G4',
  'G5',
  'D5'
];

const parts = getMusicParts({
  notes,
  rhythms,
  startTime: 0
});

const Example = () => {
  const [state, setState] = useState(false);
  const synth = useRef();
  const part = useRef();
  const onClick = React.useCallback(() => {
    setState(state => !state);
  }, []);
  const [pitch, setPitch] = useState('1');
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
        <aMSynth ref={synth}>
          {/* {state ? <triggerAttackRelease args={['C4', '4n']} /> : null} */}
          <part
            ref={part}
            args={[
              (inst, time, obj) => {
                inst.triggerAttackRelease(obj.note, obj.duration, time);
              },
              parts
            ]}
            start
          />
        </aMSynth>
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
