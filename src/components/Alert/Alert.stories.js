import React from 'react';
import { storiesOf } from '@storybook/react';
import Alert from './Alert';

storiesOf('Alert', module).add('common', () => {
  return (
    <div>
      <Alert type="success" message="Success" description="Hello"/>
      <Alert type="info" message="Info" showIcon={false} />
      <Alert type="warning" message="Warning" />
      <Alert type="error" message="Error" />
    </div>
  );
});
