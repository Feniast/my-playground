import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './styles.scss';

// TODO: generate this according to needs
import AlertTriangle from 'react-feather/dist/icons/alert-triangle';
import AlertCircle from 'react-feather/dist/icons/alert-circle';
import XCircle from 'react-feather/dist/icons/x-circle';
import CheckCircle from 'react-feather/dist/icons/check-circle';
import X from 'react-feather/dist/icons/x';

const IconMap = {
  'alert-triangle': AlertTriangle,
  'alert-circle': AlertCircle,
  'x-circle': XCircle,
  'check-circle': CheckCircle,
  x: X
};

const Icon = (props) => {
  const { 
    type,
    component,
    color,
    size,
    className,
    style,
    prefixClass
  } = props;
  const classPrefix = `${prefixClass}-icon`;
  const classNames = classnames(classPrefix, className);
  let iconEl = null;
  if (type && IconMap[type]) {
    const Comp = IconMap[type];
    iconEl = <Comp color={color} size={size} />;
  } else if (component) {
    iconEl = component;
  }
  return (
    <i className={classNames} style={style}>{iconEl}</i>
  )
}

Icon.propTypes = {
  type: PropTypes.string,
  component: PropTypes.node,
  color: PropTypes.string,
  size: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  prefixClass: PropTypes.string
};

Icon.defaultProps = {
  prefixClass: 'mp'
};

export default Icon;
