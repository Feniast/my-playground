import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import ErrorComponent from './Error';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';
import usePrevious from '../../hooks/usePrevious';

const getErrorMessage = (error, defaultMessage = 'Error Occurred') => {
  let msg = '';
  if (isString(error)) {
    msg = error;
  } else if (error && isString(error.message)) {
    msg = error.message;
  } else {
    msg = defaultMessage;
  }

  return msg;
};

const Status = props => {
  const {
    error,
    loading,
    loadingProps = {},
    errorProps = {},
    inactiveBehavior,
    onError,
    useOverlay,
    overlayStyle = {},
    renderLoading,
    renderError,
    render,
    children
  } = props;

  const lastError = usePrevious(error);
  useEffect(() => {
    if (error) {
      if (error === lastError) return;
      if (isFunction(onError)) onError(error);
    }
  });

  const fromErrors = {
    title: getErrorMessage(error)
  };

  const renderLoadingStatus = isFunction(renderLoading)
    ? () => renderLoading(loading)
    : () => <Loading key="loading" {...loadingProps} />;

  const renderErrorStatus = isFunction(renderError)
    ? () => renderError(error)
    : () => <ErrorComponent key="error" {...fromErrors} {...errorProps} />;

  const renderComp = render || children;

  const showLoading = loading;
  const showError = !loading && error;
  const contentActive = !loading && !error;
  const overlayActive =
    ((useOverlay === 'loading' || useOverlay === true) && showLoading) ||
    ((useOverlay === 'error' || useOverlay === true) && showError);

  // there is no meaning rendering an overlay on nothing, so render original component anyway
  const showContent = contentActive || overlayActive;

  let wrapperStyle;
  let statusOverlayStyle;
  let contentStyle;
  let content;

  if (useOverlay) {
    wrapperStyle = {
      position: 'relative'
    };
    if (overlayActive) {
      statusOverlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 1,
        ...overlayStyle,
        display: 'block'
      };
    } else {
      statusOverlayStyle = {
        ...overlayStyle,
        display: showLoading || showError ? 'block' : 'none'
      };
    }
  } else {
    statusOverlayStyle = {
      display: showLoading || showError ? 'block' : 'none'
    };
  }
  if (!showContent && inactiveBehavior === 'destroy') {
    content = null;
  } else {
    content = renderComp();
  }
  if (!showContent && inactiveBehavior === 'hide') {
    contentStyle = { display: 'none' };
  }

  return (
    <div data-testid="status-wrapper" style={wrapperStyle}>
      <div data-testid="status-overlay" style={statusOverlayStyle}>
        {showLoading ? renderLoadingStatus() : null}
        {showError ? renderErrorStatus() : null}
      </div>
      <div data-testid="status-inner" style={contentStyle}>
        {content}
      </div>
    </div>
  );
};

Status.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  loading: PropTypes.bool,
  loadingProps: PropTypes.object,
  errorProps: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    onCtaClick: PropTypes.func,
    ctaText: PropTypes.string
  }),
  inactiveBehavior: PropTypes.oneOf(['show', 'hide', 'destroy']),
  onError: PropTypes.func,
  useOverlay: PropTypes.oneOf([true, false, 'loading', 'error']),
  overlayStyle: PropTypes.object,
  renderLoading: PropTypes.func,
  renderError: PropTypes.func,
  render: PropTypes.func,
  children: PropTypes.func
};

Status.defaultProps = {
  inactiveBehavior: 'hide',
  loading: false,
  error: '',
  useOverlay: false
};

export default Status;
