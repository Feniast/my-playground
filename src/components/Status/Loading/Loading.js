import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { isNumberLike } from '../../../helpers/lang';

import './styles.scss';

const Loading = props => {
  const {
    prefixClass,
    className,
    strokeWidth,
    color,
    config,
    style,
    ...rest
  } = props;
  const classPrefix = `${prefixClass}-loader`;
  const classNames = classnames(classPrefix, className);
  const loaderRingStyle = {};
  if (typeof color === 'string')
    loaderRingStyle.borderColor = `${color} ${color} transparent transparent`;
  if (isNumberLike(strokeWidth))
    loaderRingStyle.borderWidth = `${strokeWidth}px`;
  else if (typeof strokeWidth === 'string')
    loaderRingStyle.borderWidth = strokeWidth;

  let content = null;
  let loaderStyle = style;
  if (config) {
    let {
      ringCount = 3,
      baseDuration = 1.5,
      durationIncrement = 0.25,
      baseSize = '1em',
      sizeIncrement = '1em'
    } = config;
    sizeIncrement = isNumberLike(sizeIncrement)
      ? `${sizeIncrement}px`
      : sizeIncrement;
    baseSize = isNumberLike(baseSize) ? `${baseSize}px` : baseSize;
    loaderStyle = {
      ...loaderStyle,
      width: `calc(${baseSize} + ${ringCount - 1} * ${sizeIncrement})`,
      height: `calc(${baseSize} + ${ringCount - 1} * ${sizeIncrement})`
    };
    const arr = new Array(ringCount).fill(0);
    const ringStyles = arr.map((_, i) => {
      let duration = baseDuration + durationIncrement * (ringCount - i - 1);
      let dimension = `calc(${baseSize} + ${ringCount -
        i -
        1} * ${sizeIncrement})`;
      let offset = `calc((${baseSize} + ${ringCount -
        i -
        1} * ${sizeIncrement}) / -2)`
      return {
        ...loaderRingStyle,
        animationDuration: `${duration}s`,
        width: dimension,
        height: dimension,
        marginLeft: offset,
        marginTop: offset
      };
    });
    content = arr.map((_, i) => (
      <div className={`${classPrefix}-ring`} key={i} style={ringStyles[i]} />
    ));
  } else {
    content = new Array(3)
      .fill(0)
      .map((_, i) => (
        <div
          className={`${classPrefix}-ring`}
          key={i}
          style={loaderRingStyle}
        />
      ));
  }

  return (
    <div className={classNames} style={loaderStyle} {...rest}>
      {content}
    </div>
  );
};

Loading.propTypes = {
  color: PropTypes.string,
  strokeWidth: PropTypes.oneOf([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  prefixClass: PropTypes.string,
  config: PropTypes.shape({
    ringCount: PropTypes.number,
    baseDuration: PropTypes.number,
    durationIncrement: PropTypes.number,
    baseSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    sizeIncrement: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  })
};

Loading.defaultProps = {
  prefixClass: 'mp'
};

export default Loading;
