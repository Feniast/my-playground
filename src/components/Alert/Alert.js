import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Icon from '../Icon';

import './styles.scss';

class Alert extends React.PureComponent {
  static propTypes = {
    type: PropTypes.oneOf(['success', 'info', 'warning', 'error']),
    message: PropTypes.node,
    description: PropTypes.node,
    closable: PropTypes.bool,
    closeText: PropTypes.node,
    onClose: PropTypes.func,
    prefixClass: PropTypes.string,
    className: PropTypes.string,
    style: PropTypes.object,
    icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    showIcon: PropTypes.bool
  };

  static defaultProps = {
    type: 'info',
    prefixClass: 'mp',
    closable: false,
    showIcon: true
  };

  state = {
    closed: false
  };

  handleClose = () => {
    this.setState({
      closed: true
    });
  };

  render() {
    const {
      prefixClass,
      className,
      description,
      message,
      showIcon,
      icon,
      closeText,
      style
    } = this.props;
    let { closable, type } = this.props;
    const { closed } = this.state;
    if (!!closeText) {
      closable = true;
    }
    type = type || 'info';
    const classPrefix = `${prefixClass}-alert`;
    const classNames = classnames(
      classPrefix,
      `${classPrefix}-${type}`,
      {
        [`${classPrefix}-with-description`]: !!description,
        [`${classPrefix}-no-icon`]: !showIcon,
        [`${classPrefix}-closable`]: closable
      },
      className
    );

    let iconEl = null;
    const iconClassName = `${classPrefix}-icon`;
    const iconSize = !!description ? 24 : 14;
    if (showIcon) {
      if (typeof icon === 'string') {
        iconEl = <Icon type={icon} className={iconClassName} size={iconSize} />;
      } else if (React.isValidElement(icon)) {
        iconEl = React.cloneElement(icon, {
          className: classnames(iconClassName, icon.props.className)
        });
      } else {
        let iconType = 'alert-circle';
        if (type === 'warning') iconType = 'alert-triangle';
        if (type === 'success') iconType = 'check-circle';
        if (type === 'error') iconType = 'x-circle';
        iconEl = <Icon type={iconType} className={iconClassName} size={iconSize} />;
      }
    }

    const closeEl = closable ? (
      <button
        onClick={this.handleClose}
        className={`${classPrefix}-close-icon`}
      >
        {closeText || <Icon type="x" />}
      </button>
    ) : null;

    return closed ? null : (
      <div className={classNames} style={style}>
        {showIcon ? iconEl : null}
        <div className={`${classPrefix}-content`}>
          <span className={`${classPrefix}-message`}>{message}</span>
          <span className={`${classPrefix}-description`}>{description}</span>
        </div>
        {closeEl}
      </div>
    );
  }
}

export default Alert;
