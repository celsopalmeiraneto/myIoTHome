import { Microphone, uint16Array, thresholdContext } from 'jsupm_mic';
import { Transmitter } from '../types';
import { Sensor } from './Sensor';

var threshCtx = new thresholdContext();
threshCtx.averageReading = 0;
threshCtx.runningAverage = 0;
threshCtx.averagedOver = 2;

class GroveSoundSensor extends Sensor {
  mic: Microphone;

  constructor(analogicPort: number, transmitter: Transmitter) {
    super(transmitter, '-');

    if (analogicPort < 0) throw new Error('Analogic port must be GTE 0');

    this.mic = new Microphone(analogicPort);
  }

  read() {
    const startTime = Date.now();
    while (Date.now() < startTime + 500) {
      const buffer = new uint16Array(128);
      const len = this.mic.getSampledWindow(2, 128, buffer);

      if (!len) continue;

      const thresh = this.mic.findThreshold(threshCtx, 30, buffer, len);
      if (thresh) return thresh;
    }

    return 0;
  }
}

export default GroveSoundSensor;
