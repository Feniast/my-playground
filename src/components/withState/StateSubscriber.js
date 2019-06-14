import React from 'react';
import reduceRight from 'lodash/reduceRight';

const composeConsumers = (contexts, render) => {
  const arr = [];
  return reduceRight(
    contexts,
    (last, cur, i) => {
      return () => (
        <cur.State>
          {val => {
            arr[i] = val;
            return last();
          }}
        </cur.State>
      );
    },
    () => render(arr)
  );
};

const StateSubscriber = props => {
  const { states, children } = props;
  const render = composeConsumers(states, children);
  return render();
};

export default StateSubscriber;
