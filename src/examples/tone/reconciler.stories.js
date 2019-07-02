import React, { useRef, useEffect, useState } from 'react';
import { storiesOf } from '@storybook/react';
import Tone from './Tone';

const Example = () => {
  const [state, setState] = useState(false);
  const onClick = React.useCallback(() => {
    setState((state => !state));
  }, []);
  return (
    <>
      <div>Hello</div>
      <button onClick={onClick}>{state ? 'Stop' : 'Play'}</button>
      <Tone>
        <duoSynth vibratoAmount={20}>
          { state ? <triggerAttackRelease args={['C4', '4n']} /> : null }
        </duoSynth>
      </Tone>
    </>
  )
}

storiesOf('Tone Reconciler', module)
  .add('hello', () => {
    return <Example />;
  });