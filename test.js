const midi = require('midi');
const robot = require("robotjs");

const inputDAW = new midi.Input();
const inputMIDI = new midi.Input();
const output = new midi.Output();

for (let i = 0; i < inputDAW.getPortCount(); i++) {
  const name = inputDAW.getPortName(i);
  console.log("INPUT", i, name)
}
for (let i = 0; i < output.getPortCount(); i++) {
  const name = output.getPortName(i);
  console.log("OUTPUT", i, name)
}

inputDAW.on('message', (deltaTime, message) => {
  console.log(`DAW  m: ${message} d: ${deltaTime}`);
});
inputMIDI.on('message', (deltaTime, message) => {
  console.log(`MIDI m: ${message} d: ${deltaTime}`);

  const [_, note, velocity] = message;
  if (velocity == 0) {
    // keyup -> 無視する
    return
  }
  robot.typeString(`note: ${note}`);
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

output.openPort(0);
// get Version
// output.sendMessage([0xF0, 0x7E, 0x7F, 0x06, 0x01, 0xF7]);

output.sendMessage([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x00, 0x05, 0xF7]);

output.closePort();

process.on("SIGINT", () => {
  console.log("exit!")
  inputMIDI.closePort()
  inputDAW.closePort()
  process.exit(0)
});
