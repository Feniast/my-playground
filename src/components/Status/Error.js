import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from 'antd';
import Button from '../ControlButton';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';

import './styles/error.scss';

// Antd version
const ErrorComp = React.memo(props => {
  const { title, description, ctaText, onCtaClick, onClose } = props;
  let descriptionText = description || null;
  if (descriptionText) {
    descriptionText = isString(descriptionText) ? (
      <p className="va-error-desc">{descriptionText}</p>
    ) : (
      descriptionText
    );
  }
  const closable = isFunction(onClose);
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
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.node
  ]),
  ctaText: PropTypes.string,
  onCtaClick: PropTypes.func,
  onClose: PropTypes.func
};

export default ErrorComp;
