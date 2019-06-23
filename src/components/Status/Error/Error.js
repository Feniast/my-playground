import React from 'react';
import PropTypes from 'prop-types';
import Alert from '../../Alert';
import classnames from 'classnames';
import Button from '../ControlButton';

import './styles.scss';

const ErrorComp = React.memo(props => {
  const { title, description, ctaText, onCtaClick, onClose, prefixClass, className } = props;
  const classPrefix = `${prefixClass}-error`;
  let descriptionText = description || null;
  if (descriptionText) {
    descriptionText = typeof descriptionText === 'string' ? (
      <p className={`${classPrefix}-desc`}>{descriptionText}</p>
    ) : (
      descriptionText
    );
  }
  const closable = typeof onClose === 'function';
  const classNames = classnames(classPrefix, className);
  const showDescription = descriptionText || (ctaText && onCtaClick);
  const errorBody = showDescription ? (
    <React.Fragment>
      {descriptionText}
      {ctaText && onCtaClick ? (
        <Button type="primary" onClick={onCtaClick}>
          {ctaText}
        </Button>
      ) : null}
    </React.Fragment>
  ) : null;
  return (
    <Alert
      className={classNames}
      message={title}
      description={errorBody}
      type="error"
      showIcon
      closable={closable}
      onClose={onClose}
    />
  );
});

ErrorComp.propTypes = {
  prefixClass: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType(PropTypes.node),
  ctaText: PropTypes.string,
  onCtaClick: PropTypes.func,
  onClose: PropTypes.func
};

ErrorComp.defaultProps = {
  prefixClass: 'mp'
};

export default ErrorComp;
