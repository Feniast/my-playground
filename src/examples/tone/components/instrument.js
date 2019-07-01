import Tone from 'tone';
import CompBase from './compBase';
import { INSTRUMENT, TONE_CLASS } from '../constants';

export default class InstrumentNode extends CompBase {
  constructor(target, props) {
    super(target, props);
    this[TONE_CLASS] = INSTRUMENT;
  }

  getIgnoredProps() {
    console.log('nothing');
    return ['hello'];
  }

  update() {

  }

  appendChild(child) {
    child.parent = this;
    if (child.isTrigger) {
      child.execute(this._instance);
    }
  }

  removeChild(child) {
    child.parent = null;
  }

  insertChild(child, beforeChild) {
    
  }
}