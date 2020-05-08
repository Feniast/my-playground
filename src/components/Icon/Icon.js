import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import IconMap from './icons';
import './styles.scss';

const Icon = (props) => {
  const { 
    type,
    component,
    color,
    className,
    style,
    prefixClass
  } = props;
  const classPrefix = `${prefixClass}-icon`;
  const classNames = classnames(classPrefix, className);
  let iconEl = null;
  if (type && IconMap[type]) {
    const Comp = IconMap[type];
    iconEl = <Comp color={color} />;
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
  className: PropTypes.string,
  style: PropTypes.object,
  prefixClass: PropTypes.string
};

Icon.defaultProps = {
  prefixClass: 'mp'
};

export default Icon;
