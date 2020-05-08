import Tone from 'tone';
import { INSTRUMENT, EFFECT, EVENT, TYPE } from './constants';

const ToneTypeMap = {
  [INSTRUMENT]: {
    builtIn: [
      'Instrument',
      'NoiseSynth',
      'Synth',
      'AMSynth',
      'DuoSynth',
      'Sampler',
      'FMSynth',
      'MonoSynth',
      'PluckSynth',
      'MetalSynth',
      'PolySynth',
      'Monophonic',
      'MembraneSynth'
    ],
    custom: []
  },
  [EFFECT]: {
    builtIn: [
      'Chorus',
      'AutoPanner',
      'AutoWah',
      'PitchShift',
      'StereoWidener',
      'Tremolo',
      'Effect',
      'PingPongDelay',
      'MidSideEffect',
      'Convolver',
      'StereoFeedbackEffect',
      'Chebyshev',
      'StereoEffect',
      'Vibrato',
      'BitCrusher',
      'StereoXFeedbackEffect',
      'FeedbackEffect',
      'Reverb',
      'Distortion',
      'JCReverb',
      'Freeverb',
      'AutoFilter',
      'FeedbackDelay',
      'Phaser'
    ],
    custom: []
  },
  [EVENT]: {
    builtIn: [
      'Sequence',
      'Event',
      'Part',
      'Pattern',
      'Loop'
    ],
    custom: []
  },
  [TYPE]: {
    builtIn: [
      'Midi',
      'Frequency',
      'TimeBase',
      'TransportTime',
      'Ticks',
      'Time'
    ],
    custom: []
  }
};

export const getTypeDefinition = type => {
  const keys = Object.keys(ToneTypeMap);
  for (let k of keys) {
    const { builtIn, custom } = ToneTypeMap[k];
    if (builtIn.indexOf(type) >= 0)
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
