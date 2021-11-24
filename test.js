const midi = require('midi');

const inputDAW = new midi.Input();
const inputMIDI = new midi.Input();

for (let i = 0; i < inputDAW.getPortCount(); i++) {
  const name = inputDAW.getPortName(i);
  console.log(i, name)
}

inputDAW.on('message', (deltaTime, message) => {
  console.log(`DAW  m: ${message} d: ${deltaTime}`);
});
inputMIDI.on('message', (deltaTime, message) => {
  console.log(`MIDI m: ${message} d: ${deltaTime}`);
});

inputDAW.openPort(0);
inputMIDI.openPort(1);

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
// For example if you want to receive only MIDI Clock beats
// you should use
// input.ignoreTypes(true, false, true)
inputDAW.ignoreTypes(false, false, false);
inputMIDI.ignoreTypes(false, false, false);

process.on("SIGINT", () => {
  console.log("exit!")
  inputMIDI.closePort()
  inputDAW.closePort()
  process.exit(0)
});
