import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import ErrorComponent from './Error';
import get from 'lodash/get';
import isString from 'lodash/isString';
import isFunction from 'lodash/isFunction';

const defaultResolveErrorToProps = (error, defaultMessage) => {
  let msg = '';
  if (isString(error)) {
    msg = error;
  } else if (error && isString(error.message)) {
    msg = error.message;
  } else {
    msg = defaultMessage;
  }

  return {
    title: msg
  };
};

const usePrevious = value => {
  const ref = useRef(null);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

const withStatus = (
  Component,
  {
    loadingComponent,
    errorComponent,
    defaultErrorMessage = 'Error Occured',
    resolveErrorToProps
  } = {}
) => {
  const LoadingComp = loadingComponent || Loading;
  const ErrorComp = errorComponent || ErrorComponent;

  const Wrapper = React.memo(
    React.forwardRef((props, ref) => {
      const {
        error,
        loading,
        loadingProps = {},
        errorProps = {},
        inactiveBehavior,
        onError,
        disableError,
        disableLoading,
        useOverlay,
        overlayStyle = {},
        ...rest
      } = props;

      const lastError = usePrevious(error);
      useEffect(() => {
        if (error) {
          if (error === lastError) return;
          if (isFunction(onError)) onError(error);
        }
      });

      let fromErrors = {};
      if (error) {
        fromErrors = isFunction(resolveErrorToProps)
          ? resolveErrorToProps(error)
          : defaultResolveErrorToProps(error, defaultErrorMessage);
        fromErrors = fromErrors || {};
      }

      const renderLoading = () => (
        <LoadingComp key="loading" {...loadingProps} />
      );
      const renderError = () => (
        <ErrorComp key="error" {...fromErrors} {...errorProps} />
      );
      const renderComp = () => (
        <Component
          key="component"
          ref={ref}
          error={error}
          loading={loading}
          {...rest}
        />
      );

      const showLoading = !disableLoading && loading;
      const showError = !disableError && !loading && error;
      const contentActive = !loading && !error;
      const overlayActive =
        ((useOverlay === 'loading' || useOverlay === true) && showLoading) ||
        ((useOverlay === 'error' || useOverlay === true) && showError);

      // there is no meaning rendering an overlay on nothing, so render original component anyway
      const showContent = contentActive || overlayActive;

      if (useOverlay) {
        let statusOverlayStyle;
        let content;
        let contentStyle;

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
        if (!showContent && inactiveBehavior === 'destroy') {
          content = null;
        } else {
          content = renderComp();
        }
        if (!showContent && inactiveBehavior === 'hide') {
          contentStyle = { display: 'none' };
        }
        return (
          <div data-testid="status-wrapper" style={{ position: 'relative' }}>
            <div data-testid="status-overlay" style={statusOverlayStyle}>
              {showLoading ? renderLoading() : null}
              {showError ? renderError() : null}
            </div>
            <div data-testid="status-inner" style={contentStyle}>
              {content}
            </div>
          </div>
        );
      } else {
        let content = null;
        if (inactiveBehavior === 'show') {
          content = renderComp();
        } else if (inactiveBehavior === 'hide') {
          content = (
            <div
              key="component"
              style={{
                display: contentActive ? 'block' : 'none'
              }}
            >
              {renderComp()}
            </div>
          );
        } else if (inactiveBehavior === 'destroy' && contentActive) {
          content = renderComp();
        }
        return (
          <>
            {showLoading ? renderLoading() : null}
            {showError ? renderError() : null}
            {content}
          </>
        );
      }
    })
  );

  Wrapper.displayName = `withStatus(${get(
    Component,
    'displayName',
    'Component'
  )})`;

  Wrapper.propTypes = {
    error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    loading: PropTypes.bool,
    loadingProps: PropTypes.object,
    errorProps: PropTypes.object,
    inactiveBehavior: PropTypes.oneOf(['show', 'hide', 'destroy']),
    onError: PropTypes.func,
    disableError: PropTypes.bool,
    disableLoading: PropTypes.bool,
    useOverlay: PropTypes.oneOf([true, false, 'loading', 'error']),
    overlayStyle: PropTypes.object
  };

  Wrapper.defaultProps = {
    inactiveBehavior: 'hide',
    loading: false,
    error: '',
    disableError: false,
    disableLoading: false,
    useOverlay: false
  };

  return Wrapper;
};

export default withStatus;
