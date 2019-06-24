import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';
import Button from './Button';

const ButtonContainer = styled.div`
  > button {
    margin-right: 8px;
  }

  margin-bottom: 16px;
`;

storiesOf('Button', module)
  .add('basic', () => {
    return (
      <>
        <ButtonContainer>
          <Button>Default</Button>
          <Button size="small">Small Button</Button>
          <Button size="large">Large Button</Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button>Default</Button>
          <Button type="primary">Primary</Button>
          <Button type="success">Success</Button>
          <Button type="danger">Danger</Button>
          <Button type="warning">Warning</Button>
          <Button type="info">Info</Button>
        </ButtonContainer>
      </>
    );
  })
  .add('disabled', () => {
    return (
      <>
        <ButtonContainer>
          <Button disabled>Default</Button>
          <Button size="small" disabled>
            Small Button
          </Button>
          <Button size="large" disabled>
            Large Button
          </Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button disabled>Default</Button>
          <Button type="primary" disabled>
            Primary
          </Button>
          <Button type="success" disabled>
            Success
          </Button>
          <Button type="danger" disabled>
            Danger
          </Button>
          <Button type="warning" disabled>
            Warning
          </Button>
          <Button type="info" disabled>
            Info
          </Button>
        </ButtonContainer>
      </>
    );
  })
  .add('loading', () => {
    return (
      <>
        <ButtonContainer>
          <Button loading>Default</Button>
          <Button size="small" loading>
            Small Button
          </Button>
          <Button size="large" loading>
            Large Button
          </Button>
        </ButtonContainer>
        <ButtonContainer>
          <Button loading>Default</Button>
          <Button type="primary" loading>
            Primary
          </Button>
          <Button type="success" loading>
            Success
          </Button>
          <Button type="danger" loading>
            Danger
          </Button>
          <Button type="warning" loading>
            Warning
          </Button>
          <Button type="info" loading>
            Info
          </Button>
        </ButtonContainer>
      </>
    );
  });
