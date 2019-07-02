import Tone from 'tone';
import { INSTRUMENT } from './constants';

const ToneTypeMap = {
  [INSTRUMENT]: {
    internal: ['Synth', 'AMSynth', 'DuoSynth'],
    custom: []
  }
};

export const getTypeDefinition = type => {
  const keys = Object.keys(ToneTypeMap);
  for (let k of keys) {
    const { internal, custom } = ToneTypeMap[k];
    if (internal.indexOf(type) >= 0)
      return {
        type: k,
        constructor: Tone[type]
      };
    const def = custom.find(({ name }) => name === type);
    if (def) {
      return {
        type: k,
        constructor: def.constructor
      };
    }
  }
  return null;
};

export const registerType = (type, name, constructor) => {
  if (!ToneTypeMap[type]) return;
  ToneTypeMap[type].custom.push({
    name,
    constructor
  });

  return () => {
    ToneTypeMap[type].custom = ToneTypeMap[type].custom.filter(
      o => o.name !== name
    );
  };
};
