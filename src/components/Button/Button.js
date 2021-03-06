import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../Icon';

import './styles.scss';

class Button extends React.PureComponent {
  static propTypes = {
    type: PropTypes.oneOf([
      'primary',
      'success',
      'danger',
      'warning',
      'info'
    ]),
    htmlType: PropTypes.oneOf(['button', 'reset', 'submit']),
    className: PropTypes.string,
    prefixClass: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.func,
    target: PropTypes.string,
    href: PropTypes.string,
    icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    loading: PropTypes.bool,
    size: PropTypes.oneOf(['large', 'small']),
    block: PropTypes.bool
  };

  static defaultProps = {
    htmlType: 'button',
    loading: false,
    prefixClass: 'mp',
    block: false
  };

  handleClick = e => {
    const { onClick, loading } = this.props;
    if (loading) return;
    if (typeof onClick === 'function') {
      onClick(e);
    }
  };

  render() {
    const {
      type,
      htmlType,
      className,
      prefixClass,
      onClick,
      target,
      href,
      icon,
      loading,
      size,
      children,
      block,
      ...rest
    } = this.props;
    const classPrefix = `${prefixClass}-btn`;
    let btnSize;
    if (size === 'large') {
      btnSize = 'lg';
    } else if (size === 'small') {
      btnSize = 'sm';
    } else {
      btnSize = '';
    }
    const classNames = classnames(
      classPrefix,
      {
        [`${classPrefix}-${type}`]: type,
        [`${classPrefix}-${btnSize}`]: !!btnSize,
        [`${classPrefix}-loading`]: loading,
        [`${classPrefix}-icon-only`]: !children && icon,
        [`${classPrefix}-block`]: block
      },
      className
    );

    let iconNode = null;
    if (loading) {
      iconNode = <Icon type="loading" />;
    } else if (icon) {
      if (typeof icon === 'string') {
        iconNode = <Icon type={icon} />;
      } else if (React.isValidElement(icon)) {
        iconNode = icon;
      }
    }
    
    let childrenNode = null;
    if (typeof children === 'string') {
      childrenNode = <span>{children}</span>
    }

    if (href) {
      return (
        <a
          href={href}
          target={target}
          className={classNames}
          onClick={this.handleClick}
          {...rest}
        > 
          {iconNode}
          {childrenNode}
        </a>
      );
    }

    return (
      <button
        className={classNames}
        type={htmlType}
        onClick={this.handleClick}
        {...rest}
      >
        {iconNode}
        {childrenNode}
      </button>
    );
  }
}

export default Button;
