import React from 'react';
import { storiesOf } from '@storybook/react';
import { Row, Col } from './index';

storiesOf('Grid', module).add('normal', () => {
  return (
    <Row gutter={12}>
      {[
        { xs: 24, sm: 12, md: 6, lg: 4, xl: 3 },
        { xs: 24, sm: 12, md: 6, lg: 4, xl: 3 },
        { xs: 24, sm: 12, md: 6, lg: 4, xl: 3 },
        { xs: 24, sm: 12, md: 6, lg: 4, xl: 3 }
      ].map(n => (
        <Col {...n}>
          <div
            style={{
              height: '100px',
              background: '#6549ff',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff'
            }}
          >{`col`}</div>
        </Col>
      ))}
    </Row>
  );
});
