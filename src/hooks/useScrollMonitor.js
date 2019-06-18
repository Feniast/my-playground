import { useEffect, useState } from 'react';
import { register } from '../helpers/loop';

let elements = [];
let id = 0;

const useScrollMonitor = (ref, {
  threshold = 0
}) => {
  const [state, setState] = useState({
    inViewport: false,
    revealState: '',
    prevRatio: 0
  });
  useEffect(() => {

  }, []);
}