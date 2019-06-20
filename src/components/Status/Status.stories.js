import React from 'react';
import Loading from './Loading';
import { withKnobs, color, number } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';

storiesOf('Status', module)
  .addDecorator(withKnobs)
  .add('loading', () => {
    return (
      <Loading
        color={color('color', '#3cefff')}
        strokeWidth={number('strokeWidth', 4)}
      />
    );
  })
  .add('loading custom config', () => {
    return (
      <Loading
        color={color('color', '#3cefff')}
        strokeWidth={number('strokeWidth', 6)}
        config={{
          ringCount: number('ringCount', 4),
          baseSize: number('baseSize', 11),
          sizeIncrement: number('sizeIncrement', 16),
          baseDuration: number('baseDuration(s)', 0.8),
          durationIncrement: number('durationIncrement(s)', 0.5)
        }}
      />
    );
  });
