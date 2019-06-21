import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { CSSTransition } from 'react-transition-group';
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
    afterClose: PropTypes.func,
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

  handleClose = (e) => {
    e.preventDefault();
    const { onClose } = this.props;
    this.setState({
      closed: true
    });
    if (typeof onClose === 'function') {
      onClose();
    }
  };

  onClosed = () => {
    const { afterClose } = this.props;
    if (typeof afterClose === 'function') {
      afterClose();
    }
  }

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
    if (showIcon) {
      if (typeof icon === 'string') {
        iconEl = <Icon type={icon} className={iconClassName} />;
      } else if (React.isValidElement(icon)) {
        iconEl = React.cloneElement(icon, {
          className: classnames(iconClassName, icon.props.className)
        });
      } else {
        let iconType = 'alert-circle';
        if (type === 'warning') iconType = 'alert-triangle';
        if (type === 'success') iconType = 'check-circle';
        if (type === 'error') iconType = 'x-circle';
        iconEl = <Icon type={iconType} className={iconClassName} />;
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

    return (
      <CSSTransition
        in={!closed}
        timeout={300}
        classNames={classPrefix}
        unmountOnExit
        enter={false}
        onExited={this.onClosed}
      >
      <div className={classNames} style={style}>
        {showIcon ? iconEl : null}
        <div className={`${classPrefix}-content`}>
          <span className={`${classPrefix}-message`}>{message}</span>
          <span className={`${classPrefix}-description`}>{description}</span>
        </div>
        {closeEl}
      </div>
      </CSSTransition>
    );
  }
}

export default Alert;
