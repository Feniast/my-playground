import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import get from 'lodash/get';
import createUseContext from 'constate';

const createStateContainer = (stateFactory, memoInputsFactory) => {
  if (!isFunction(stateFactory)) {
    throw new Error('you must provide a state factory function');
  }

  const useStateContext = createUseContext(stateFactory, memoInputsFactory);
  const StateContainer = props => {
    const { children, ...rest } = props;
    let content = children;
    if (isFunction(children)) {
      content = (
        <useStateContext.Context.Consumer>
          {children}
        </useStateContext.Context.Consumer>
      );
    }
    return (
      <useStateContext.Provider {...rest}>{content}</useStateContext.Provider>
    );
  };

  StateContainer.propTypes = {
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.element, PropTypes.func])
  };

  StateContainer.displayName = 'StateContainer';

  const withState = Component => {
    const withStateWrapper = React.forwardRef((props, ref) => {
      const state = useStateContext();
      return <Component ref={ref} {...state} {...props} />;
    });

    withStateWrapper.displayName = `withState(${get(
      Component,
      'displayName',
      'Component'
    )})`;

    return withStateWrapper;
  };

  const State = (props) => {
    const { children, render } = props;
    const renderChildren = children || render;
    const state = useStateContext();
    if (isFunction(renderChildren)) {
      return renderChildren(state);
    }
    console.warn('You can only use a render function as the children of the State Component');
    return null;
  }

  State.propsTypes = {
    render: PropTypes.func,
    children: PropTypes.func
  };

  StateContainer.State = State;
  StateContainer.withState = withState;
  StateContainer.useStateContext = useStateContext;
  StateContainer.Context = useStateContext.Context;

  return StateContainer;
};

export default createStateContainer;
