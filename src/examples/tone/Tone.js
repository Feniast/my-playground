import React, { useEffect, useMemo, useRef } from 'react';
import { createRoot, render, unmountComponentAtNode } from './reconciler';

const Tone = props => {
  const { children } = props;
  const root = useMemo(() => createRoot(), []);
  const state = useRef({
    root
  });
  useEffect(() => {
    render(
      children,
      root
    );
  });

  useEffect(() => {
    return () => {
      unmountComponentAtNode(state.current.root);
    }
  }, []);

  return <div />;
};

export default Tone;
