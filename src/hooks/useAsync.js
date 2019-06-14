import { useCallback, useReducer } from 'react';
import isFunction from 'lodash/isFunction';

const asyncReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case 'load':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'resolve':
      return {
        ...state,
        loading: false,
        data: payload
      };
    case 'reject':
      return {
        ...state,
        loading: false,
        error: payload
      };
    default:
      return state;
  }
};

const useAsync = (
  action,
  { onStart, onResolve, onReject, onComplete, onLoading, onError, initialData } = {}
) => {
  const [state, dispatch] = useReducer(asyncReducer, {
    error: null,
    loading: false,
    data: initialData
  });
  const callAsync = useCallback(
    async (...args) => {
      if (isFunction(onStart)) onStart();
      dispatch({
        type: 'load'
      });
      if (isFunction(onLoading)) onLoading(true);
      try {
        let result = await action(...args);
        if (isFunction(onResolve)) {
          result = onResolve(result);
        }
        if (isFunction(onError)) {
          onError(null);
        }
        dispatch({
          type: 'resolve',
          payload: result
        });
      } catch (e) {
        let err = isFunction(onReject) ? onReject(e) : e;
        if (isFunction(onError)) {
          onError(err);
        }
        dispatch({
          type: 'reject',
          payload: err
        });
      } finally {
        if (isFunction(onLoading)) onLoading(false);
        if (isFunction(onComplete)) onComplete();
      }
    },
    [action, onComplete, onLoading, onReject, onResolve, onStart, onError]
  );
  return {
    error: state.error,
    loading: state.loading,
    data: state.data,
    callAsync
  };
};

export default useAsync;
