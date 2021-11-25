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
  output.sendMessage([
    0x80, note, 0x00
  ])
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

output.openPort(1); // MIDI

// get Version
// output.sendMessage([0xF0, 0x7E, 0x7F, 0x06, 0x01, 0xF7]);

// change keys mode
//output.sendMessage([0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D, 0x00, 0x05, 0xF7]);

const HEADER = [0xF0, 0x00, 0x20, 0x29, 0x02, 0x0D]
const DELIMITER = [0xF7];
output.sendMessage([
  ...HEADER,
  0x0E, // Programmer / Live mode change
  0x01, // Programmer mode
  ...DELIMITER
])

// // Lighting the lower left pad static red
// output.sendMessage([
//   0x90, 0x0B, 0x05
// ])

// // Flashing the upper left pad green
// output.sendMessage([
//   0x90, 0x51, 0x05
// ])
// output.sendMessage([
//   0x91, 0x51, 0x13
// ])

// // Pulsing the lower right pad blue
// output.sendMessage([
//   0x92, 0x12, 0x2D
// ])

output.sendMessage([
  ...HEADER,
  0x03,
  0x03, 0x0B, 127, 127, 127,
  0x03, 0x0C, 127, 0, 0,
  0x03, 0x0D, 0, 0, 127,
  0x03, 0x0E, 0, 127, 0,
  ...DELIMITER
])

process.on("SIGINT", () => {
  console.log("exit!")
  output.closePort();
  inputMIDI.closePort()
  inputDAW.closePort()
  process.exit(0)
});
