import Tone from 'tone';
import { isArray } from 'util';

export const addTimes = times => {
  return new Tone.Time(
    (Array.isArray(times) ? times : [times]).reduce(
      (p, n) => Tone.Time(p) + Tone.Time(n)
    )
  );
};

export const getTimes = (durations, startTime = 0) => {
  let acc = startTime;
  const times = [startTime];
  durations.forEach(duration => {
    if (Array.isArray(duration)) {
      const isRest = duration[0] === 'r';
      const durArr = isRest ? duration.slice(1) : duration;
      acc = addTimes([acc, ...durArr]);
      if (isRest) {
        times[times.length - 1] = acc;
      } else {
        times.push(acc);
      }
    } else {
      acc = addTimes([acc, duration]);
      times.push(acc);
    }
  });

  return times;
};

export const getMusicParts = ({
  notes = [],
  velocities = [],
  rhythms = [],
  startTime = 0
}) => {
  rhythms = isArray(rhythms) ? rhythms : [rhythms];
  notes = isArray(notes) ? notes : [notes];
  notes = notes.filter(n => !!n);
  velocities = isArray(velocities) ? velocities : [velocities];
  const times = getTimes(rhythms, startTime);
  const parts = [];
  let i = 0;
  rhythms.forEach(rhythm => {
    if (isArray(rhythm) && rhythm[0] === 'r') return;
    const note = isArray(notes[i]) ? notes[i] : [notes[i]];
    note.forEach(n => {
      parts.push({
        note: n,
        duration: addTimes(rhythm),
        time: times[i],
        velocity: velocities[i]
      });
    });
    i++;
  });

  return parts;
};
