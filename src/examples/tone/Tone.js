import React, { useEffect, useMemo, useRef } from 'react';
import Tone from 'tone';
import { createRoot, render, unmountComponentAtNode } from './reconciler';

const ToneRoot = props => {
  const { children, start } = props;
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
    if (start) {
      console.log('start tone')
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }
  }, [start]);

  useEffect(() => {
    return () => {
      unmountComponentAtNode(state.current.root);
    }
  }, []);

  return <div />;
};

export default ToneRoot;
