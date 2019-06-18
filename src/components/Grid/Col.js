import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { RowContext } from './Row';

const breakpointPropTypes = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.shape({
    span: PropTypes.number,
    push: PropTypes.number,
    pull: PropTypes.number,
    offset: PropTypes.number,
    order: PropTypes.number
  })
]);

class Col extends React.PureComponent {
  static propTypes = {
    span: PropTypes.number,
    push: PropTypes.number,
    pull: PropTypes.number,
    offset: PropTypes.number,
    order: PropTypes.number,
    className: PropTypes.string,
    prefixClass: PropTypes.string,
    xs: breakpointPropTypes,
    sm: breakpointPropTypes,
    md: breakpointPropTypes,
    lg: breakpointPropTypes,
    xl: breakpointPropTypes,
    xxl: breakpointPropTypes
  };

  static defaultProps = {
    prefixClass: 'mp'
  };

  renderCol(gutter) {
    const {
      span,
      push,
      pull,
      offset,
      order,
      className,
      prefixClass,
      xs,
      sm,
      md,
      lg,
      xl,
      xxl,
      style,
      children,
      ...rest
    } = this.props;
    const classPrefix = `${prefixClass}-col`;
    const responsiveClassesDef = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'].reduce(
      (def, breakpoint) => {
        let sizeProps = {};
        const breakpointProps = this.props[breakpoint];
        if (typeof breakpointProps === 'number') {
          sizeProps.span = breakpointProps;
        } else if (typeof breakpointProps === 'object') {
          sizeProps = breakpointProps;
        }
        const newClasses = {
          ...def,
          [`${classPrefix}-${breakpoint}-${sizeProps.span}`]: !!sizeProps.span,
          [`${classPrefix}-${breakpoint}-pull-${
            sizeProps.pull
          }`]: !!sizeProps.pull,
          [`${classPrefix}-${breakpoint}-push-${
            sizeProps.push
          }`]: !!sizeProps.push,
          [`${classPrefix}-${breakpoint}-offset-${
            sizeProps.offset
          }`]: !!sizeProps.offset,
          [`${classPrefix}-${breakpoint}-order-${sizeProps.order}`]:
            sizeProps.order >= 0
        };
        return newClasses;
      },
      {}
    );

    const classes = classnames(
      classPrefix,
      {
        [`${classPrefix}-${span}`]: !!span,
        [`${classPrefix}-pull-${pull}`]: !!pull,
        [`${classPrefix}-push-${push}`]: !!push,
        [`${classPrefix}-offset-${offset}`]: !!offset,
        [`${classPrefix}-order-${order}`]: order >= 0
      },
      responsiveClassesDef,
      className
    );
    const colStyle =
      gutter > 0
        ? {
            paddingLeft: `${gutter / 2}px`,
            paddingRight: `${gutter / 2}px`
          }
        : style;
    return (
      <div {...rest} className={classes} style={colStyle}>
        {children}
      </div>
    );
  }

  render() {
    return (
      <RowContext.Consumer>
        {({ gutter }) => this.renderCol(gutter)}
      </RowContext.Consumer>
    );
  }
}

export default Col;
