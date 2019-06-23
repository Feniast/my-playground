import React, { useRef, useCallback } from 'react';
import styled from 'styled-components';
import { storiesOf } from '@storybook/react';
import classnames from 'classnames';
import useMouseHover from '../hooks/useMouseHover';
import useRaf from '../hooks/useRaf';

const BasicExample = () => {
  const ref = useRef();
  const [hovered, pos] = useMouseHover(ref);
  return (
    <BasicExample.Wrapper>
      <BasicExample.Indicator>
        <p>{`hovered: ${hovered}`}</p>
        {Object.keys(pos).map((k) => {
          const v = pos[k];
          return <p>{`${k}: ${v}`}</p>
        })}
      </BasicExample.Indicator>
      <BasicExample.Box ref={ref}></BasicExample.Box>
    </BasicExample.Wrapper>
  )
}

BasicExample.Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

BasicExample.Box = styled.div`
  width: 200px;
  height: 200px;
  background-color: #234999;
`;

BasicExample.Indicator = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  font-size: 12px;
  min-width: 150px;
  background-color: rgba(255, 38, 38, 0.5);
  color: white;
  padding: 20px;
`;

const TrackingCursorExample = () => {
  const cursorPos = useRef({
    x: 0,
    y: 0
  });
  const [, pos] = useMouseHover();
  const cursor = useRef();
  const text = useRef();
  const [textHovered] = useMouseHover(text);
  const track = useCallback(() => {
    const { x: tx, y: ty } = pos;
    cursorPos.current.x += (tx - cursorPos.current.x) * 0.1;
    cursorPos.current.y += (ty - cursorPos.current.y) * 0.1;
    cursor.current.style.transform = `translate(${cursorPos.current.x}px, ${
      cursorPos.current.y
    }px)`;
  }, [pos]);
  useRaf(track);
  return (
    <TrackingCursorExample.Wrapper>
      <TrackingCursorExample.CursorWrapper>
          <TrackingCursorExample.Cursor
            ref={cursor}
            className={classnames({ hover: textHovered })}
          >
            <TrackingCursorExample.CursorInner></TrackingCursorExample.CursorInner>
          </TrackingCursorExample.Cursor>
      </TrackingCursorExample.CursorWrapper>
      <TrackingCursorExample.Text ref={text}>
        Hello world
      </TrackingCursorExample.Text>
    </TrackingCursorExample.Wrapper>
  );
}

TrackingCursorExample.Wrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1b1b1b;
`;

TrackingCursorExample.CursorWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  mix-blend-mode: exclusion;
`;

TrackingCursorExample.CursorInner = styled.div`
  will-change: transform;
  transition: all 0.3s ease-in-out;
  background-color: transparent;
  width: 100%;
  height: 100%;
  border: 1px solid white;
  border-radius: 50%;
  .hover & {
    background-color: white;
    transform: scale(1.5);
  }
`;

TrackingCursorExample.Cursor = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 80px;
  height: 80px;
  margin-left: -40px;
  margin-top: -40px;
`;

TrackingCursorExample.Text = styled.p`
  -webkit-text-stroke: 2px #fff;
  color: transparent;
  transition: all 0.5s ease-in-out;
  text-transform: uppercase;
  font-size: 4rem;
  font-weight: bold;
  font-family: Arial, Helvetica, sans-serif;
  &:hover {
    color: white;
    cursor: none;
  }
`;

storiesOf('useMouseHover', module)
  .add('basic', () => {
    return (
      <div>
        <BasicExample />
      </div>
    );
  })
  .add('tracking cursor', () => {
    return (
      <div>
        <TrackingCursorExample />
      </div>
    );
  });