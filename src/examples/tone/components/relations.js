import Tone from 'tone';

export const connectChild = (parent, child) => {
  const parentInst = parent._instance;
  const childInst = child._instance;
  if (childInst instanceof Tone.AudioNode) {
    console.log('audioNode');
    const dest = parentInst instanceof Tone.AudioNode ? parentInst : Tone.Master;
    childInst.connect(dest);
  }
}
