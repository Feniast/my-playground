import React, { useRef, useEffect } from 'react';
import { storiesOf } from '@storybook/react';
import { render } from './reconciler';
const root = {};
const Example = () => {
  const [x, setX] = React.useState('C4');
  const onClick = React.useCallback(() => {
    setX('C5');
  }, []);
  useEffect(() => {
    console.log('hello');
    render(
      <synth>
        <triggerAttackRelease args={[x, '4n', '8n']} />
      </synth>,
      root
    );
  });
  return (
    <>
      <div>Hello</div>
      <button onClick={onClick}>Click</button>
    </>
  )
}

storiesOf('Tone Reconciler', module)
  .add('hello', () => {
    return <Example />;
  });