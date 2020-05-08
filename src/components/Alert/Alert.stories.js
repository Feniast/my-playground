import React from 'react';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';
import Award from 'react-feather/dist/icons/award';
import Icon from '../Icon';
import SrcAlert from './Alert';

const Alert = styled(SrcAlert)`
  margin-bottom: 12px;
`;

storiesOf('Alert', module)
  .add('basic', () => {
    return (
      <div>
        <Alert type="success" message="Success" />
        <Alert type="info" message="Info" />
        <Alert type="warning" message="Warning" />
        <Alert type="error" message="Error" />
      </div>
    );
  })
  .add('no icon', () => {
    return (
      <div>
        <Alert type="success" message="Success" showIcon={false} />
        <Alert type="info" message="Info" showIcon={false} />
        <Alert type="warning" message="Warning" showIcon={false} />
        <Alert type="error" message="Error" showIcon={false} />
      </div>
    );
  })
  .add('with description', () => {
    return (
      <div>
        <Alert
          type="success"
          message="Success"
          description="Adipisicing culpa amet ut pariatur quis nostrud tempor esse laborum laborum est culpa consectetur consequat. Laborum cillum non esse officia tempor eiusmod nostrud nulla ut nulla ex. Nulla excepteur est sint minim nulla. Lorem deserunt officia in fugiat ut tempor. Anim dolore ad culpa pariatur in elit cillum quis ea ipsum ex tempor. Aliquip ea aliqua consequat enim dolor excepteur dolor est culpa. Dolor ea nostrud excepteur mollit aliqua nostrud est."
        />
        <Alert
          type="info"
          message="Info"
          description="Proident ex dolore cillum consectetur pariatur pariatur voluptate enim ex deserunt. Non laboris dolore veniam velit pariatur voluptate excepteur et consectetur quis excepteur cillum cupidatat eu. Duis non ipsum est dolore aliqua tempor fugiat dolor dolore aliqua."
        />
        <Alert
          type="warning"
          message="Warning"
          description="Ut occaecat et tempor incididunt mollit sit minim dolor Lorem est mollit ea. In ea ex duis sint occaecat incididunt ea cupidatat anim amet adipisicing mollit. Ea aliqua do duis ex aliqua ea et ullamco est. Do excepteur qui nostrud nisi adipisicing veniam laboris aliquip mollit pariatur in."
        />
        <Alert
          type="error"
          message="Error"
          description="Eiusmod dolore amet mollit commodo adipisicing nulla reprehenderit occaecat minim laboris veniam sunt proident. Et sunt magna cillum dolor amet do esse voluptate amet magna sunt fugiat occaecat mollit. Qui exercitation tempor quis minim exercitation aliqua id est et elit elit. Reprehenderit adipisicing duis aliqua ad labore aliqua amet quis laborum. Anim tempor tempor est magna aute Lorem amet occaecat."
        />
        <Alert
          type="success"
          message="Success"
          description="Adipisicing culpa amet ut pariatur quis nostrud tempor esse laborum laborum est culpa consectetur consequat. Laborum cillum non esse officia tempor eiusmod nostrud nulla ut nulla ex. Nulla excepteur est sint minim nulla. Lorem deserunt officia in fugiat ut tempor. Anim dolore ad culpa pariatur in elit cillum quis ea ipsum ex tempor. Aliquip ea aliqua consequat enim dolor excepteur dolor est culpa. Dolor ea nostrud excepteur mollit aliqua nostrud est."
          showIcon={false}
        />
        <Alert
          type="info"
          message="Info"
          description="Proident ex dolore cillum consectetur pariatur pariatur voluptate enim ex deserunt. Non laboris dolore veniam velit pariatur voluptate excepteur et consectetur quis excepteur cillum cupidatat eu. Duis non ipsum est dolore aliqua tempor fugiat dolor dolore aliqua."
          showIcon={false}
        />
        <Alert
          type="warning"
          message="Warning"
          description="Ut occaecat et tempor incididunt mollit sit minim dolor Lorem est mollit ea. In ea ex duis sint occaecat incididunt ea cupidatat anim amet adipisicing mollit. Ea aliqua do duis ex aliqua ea et ullamco est. Do excepteur qui nostrud nisi adipisicing veniam laboris aliquip mollit pariatur in."
          showIcon={false}
        />
        <Alert
          type="error"
          message="Error"
          description="Eiusmod dolore amet mollit commodo adipisicing nulla reprehenderit occaecat minim laboris veniam sunt proident. Et sunt magna cillum dolor amet do esse voluptate amet magna sunt fugiat occaecat mollit. Qui exercitation tempor quis minim exercitation aliqua id est et elit elit. Reprehenderit adipisicing duis aliqua ad labore aliqua amet quis laborum. Anim tempor tempor est magna aute Lorem amet occaecat."
          showIcon={false}
        />
      </div>
    );
  })
  .add('custom icon', () => {
    return (
      <div>
        <Alert
          type="success"
          message="Default"
        />
        <Alert
          type="success"
          message="Custom"
          icon={<Icon component={<Award />} />}
        />
        <Alert
          type="success"
          message="Custom with description"
          description="Dolore fugiat eu sit nisi sint anim consectetur labore dolor officia. Aliquip laboris quis ad elit sint Lorem ad exercitation commodo officia fugiat dolore aliquip. Aute aute ex nostrud ipsum reprehenderit mollit esse sint. Velit amet labore amet nostrud cupidatat ut ea ex deserunt sit culpa irure aute. Irure commodo laboris dolore ex duis deserunt laboris non do do. Cupidatat deserunt proident dolore dolore aliquip nulla non ea tempor nulla nisi exercitation."
          icon={<Icon component={<Award />} />}
        />
      </div>
    );
  })
  .add('closable', () => {
    return (
      <div>
        <Alert
          type="success"
          message="Success"
          closable={true}
          onClose={() => console.log('on close')}
          afterClose={() => console.log('after close')}
        />
        <Alert
          type="info"
          message="Info"
          closable={true}
          description="Dolore fugiat eu sit nisi sint anim consectetur labore dolor officia. Aliquip laboris quis ad elit sint Lorem ad exercitation commodo officia fugiat dolore aliquip. Aute aute ex nostrud ipsum reprehenderit mollit esse sint. Velit amet labore amet nostrud cupidatat ut ea ex deserunt sit culpa irure aute. Irure commodo laboris dolore ex duis deserunt laboris non do do. Cupidatat deserunt proident dolore dolore aliquip nulla non ea tempor nulla nisi exercitation."
        />
      </div>
    );
  });
