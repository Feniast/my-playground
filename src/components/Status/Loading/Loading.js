import React from 'react';
import PropTypes from 'prop-types';

import './styles.scss';

const Loading = (props) => {

}

Loading.propTypes = {
  color: PropTypes.string,
  stroke: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  prefixClass: PropTypes.string
};

Loading.defaultProps = {
  prefixClass: 'mp'
};
