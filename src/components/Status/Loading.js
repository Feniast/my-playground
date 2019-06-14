import React from 'react';
import PropTypes from 'prop-types';

import { Spin } from 'antd';
import classnames from 'classnames';

import './styles/loading.scss';

const Loading = props => {
  const { spinnerSize = 'large', center, ...rest } = props;
  return (
    <div className={classnames('va-loading', { 'va-loading--center': center })}>
      <Spin size={spinnerSize} {...rest} />
    </div>
  );
};

Loading.propTypes = {
  spinnerSize: PropTypes.oneOf(['small', 'default', 'large']),
  center: PropTypes.bool
};

Loading.defaultProps = {
  spinnerSize: 'large',
  center: true
};

export default Loading;
