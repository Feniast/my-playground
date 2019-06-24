import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';
import Button from './Button';

storiesOf('Button', module).add('basic', () => {
  return (
    <>
      <div>
        <Button>hello</Button>
        <Button size="large">Large Button</Button>
        <Button size="small">Small Button</Button>
      </div>
      <div>
        <Button>Default</Button>
        <Button type="primary">Primary</Button>
        <Button type="success">Success</Button>
        <Button type="danger">Danger</Button>
        <Button type="warning">Warning</Button>
        <Button type="info">Info</Button>
      </div>
    </>
  );
});
