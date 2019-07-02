import Tone from 'tone';
import CompBase from './compBase';
import { INSTRUMENT, TONE_CLASS } from '../constants';
import { attachChild, detachChild } from './relations';

export default class InstrumentNode extends CompBase {
  constructor(target, props) {
    super(target, props);
    this[TONE_CLASS] = INSTRUMENT;
  }

  getIgnoredProps() {
    console.log('InstrumentNode ignored props');
    return ['hello'];
  }

  update() {

  }

  appendChild(child) {
    console.log('instrument add child');
    child.parent = this;
    attachChild(this, child);
  }

  removeChild(child) {
    console.log('instrument remove child');
    detachChild(this, child);
    child.parent = undefined;
  }

  insertChild(child, beforeChild) {
    
  }
}